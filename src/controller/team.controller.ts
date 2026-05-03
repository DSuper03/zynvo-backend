import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { generateRequestId, sendErrorResponse } from '../utils/helper';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Generate a 6-character uppercase alphanumeric invite code.
 * Excludes visually-confusing characters: 0/O, 1/I/L.
 */
const generateTeamCode = (): string => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

/**
 * Try up to `maxAttempts` times to produce a code that doesn't already exist
 * in the database.  Returns the unique code or throws.
 */
const generateUniqueTeamCode = async (maxAttempts = 10): Promise<string> => {
    for (let i = 0; i < maxAttempts; i++) {
        const code = generateTeamCode();
        const existing = await prisma.team.findUnique({ where: { teamCode: code } });
        if (!existing) return code;
    }
    throw new Error('Failed to generate a unique team code after multiple attempts');
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * POST /create
 * Body: { eventId: string, teamName: string }
 *
 * Creates a new team for the given event. The authenticated user becomes
 * the team leader and first member.
 */
export const createTeam = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { eventId, teamName } = req.body;

    logger.info(`[${requestId}] POST /teams/create`, { userId, eventId, teamName });

    if (!eventId || !teamName) {
        sendErrorResponse(res, requestId, 'eventId and teamName are required', 400);
        return;
    }

    try {
        // 1. Validate event exists and is a team event (TeamSize > 1)
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true, TeamSize: true, EventName: true },
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        if (event.TeamSize <= 1) {
            sendErrorResponse(res, requestId, 'This is not a team event', 400);
            return;
        }

        // 2. Check the user isn't already part of a team for this event
        const existingMembership = await prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId },
            },
        });

        if (existingMembership) {
            sendErrorResponse(res, requestId, 'You are already in a team for this event', 409);
            return;
        }

        // 3. Generate unique invite code
        const teamCode = await generateUniqueTeamCode();

        // 4. Create team + add the creator as leader in a single transaction
        const team = await prisma.team.create({
            data: {
                teamName,
                teamCode,
                eventId,
                createdById: userId,
                members: {
                    create: {
                        userId,
                        role: 'leader',
                    },
                },
            },
            select: {
                id: true,
                teamName: true,
                teamCode: true,
                eventId: true,
                createdAt: true,
                members: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: { id: true, name: true, email: true, profileAvatar: true },
                        },
                    },
                },
            },
        });

        logger.info(`[${requestId}] Team created`, { teamId: team.id, teamCode: team.teamCode });

        res.status(201).json({
            msg: 'Team created successfully',
            team,
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error creating team`, { error: error.message, stack: error.stack });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

/**
 * POST /join
 * Body: { eventId: string, teamCode: string }
 *
 * Joins an existing team via invite code.
 */
export const joinTeam = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { eventId, teamCode } = req.body;

    logger.info(`[${requestId}] POST /teams/join`, { userId, eventId, teamCode });

    if (!eventId || !teamCode) {
        sendErrorResponse(res, requestId, 'eventId and teamCode are required', 400);
        return;
    }

    try {
        // 1. Find the team by code
        const team = await prisma.team.findUnique({
            where: { teamCode: teamCode.toUpperCase().trim() },
            select: {
                id: true,
                teamName: true,
                teamCode: true,
                eventId: true,
                event: { select: { TeamSize: true, EventName: true } },
                members: {
                    select: {
                        id: true,
                        userId: true,
                        role: true,
                        user: {
                            select: { id: true, name: true, email: true, profileAvatar: true },
                        },
                    },
                },
            },
        });

        if (!team) {
            sendErrorResponse(res, requestId, 'Invalid team code', 404);
            return;
        }

        // 2. Ensure the team belongs to the requested event
        if (team.eventId !== eventId) {
            sendErrorResponse(res, requestId, 'This team code does not belong to the specified event', 400);
            return;
        }

        // 3. Check team is not full
        if (team.members.length >= team.event.TeamSize) {
            sendErrorResponse(res, requestId, `Team is full (max ${team.event.TeamSize} members)`, 409);
            return;
        }

        // 4. Check the user isn't already in ANY team for this event
        const existingMembership = await prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId },
            },
        });

        if (existingMembership) {
            sendErrorResponse(res, requestId, 'You are already in a team for this event', 409);
            return;
        }

        // 5. Add member
        await prisma.teamMember.create({
            data: {
                teamId: team.id,
                userId,
                role: 'member',
            },
        });

        // 6. Fetch updated team to return
        const updatedTeam = await prisma.team.findUnique({
            where: { id: team.id },
            select: {
                id: true,
                teamName: true,
                teamCode: true,
                eventId: true,
                createdAt: true,
                members: {
                    select: {
                        id: true,
                        role: true,
                        user: {
                            select: { id: true, name: true, email: true, profileAvatar: true },
                        },
                    },
                },
            },
        });

        logger.info(`[${requestId}] User joined team`, { teamId: team.id, userId });

        res.status(200).json({
            msg: 'Joined team successfully',
            team: updatedTeam,
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error joining team`, { error: error.message, stack: error.stack });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

/**
 * GET /details/:teamId
 *
 * Fetches full team details including all members.
 */
export const getTeamDetails = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { teamId } = req.params;

    logger.info(`[${requestId}] GET /teams/details/${teamId}`);

    try {
        const team = await prisma.team.findUnique({
            where: { id: teamId },
            select: {
                id: true,
                teamName: true,
                teamCode: true,
                eventId: true,
                createdById: true,
                createdAt: true,
                event: {
                    select: { EventName: true, TeamSize: true },
                },
                members: {
                    select: {
                        id: true,
                        role: true,
                        joinedAt: true,
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                profileAvatar: true,
                                collegeName: true,
                            },
                        },
                    },
                    orderBy: { joinedAt: 'asc' },
                },
            },
        });

        if (!team) {
            sendErrorResponse(res, requestId, 'Team not found', 404);
            return;
        }

        res.status(200).json({
            msg: 'Team details fetched',
            team: {
                ...team,
                maxMembers: team.event.TeamSize,
                currentMembers: team.members.length,
            },
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching team details`, { error: error.message });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

/**
 * GET /my-team/:eventId
 *
 * Returns the authenticated user's team for the specified event, or null.
 */
export const getMyTeam = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { eventId } = req.params;

    logger.info(`[${requestId}] GET /teams/my-team/${eventId}`, { userId });

    try {
        const membership = await prisma.teamMember.findFirst({
            where: {
                userId,
                team: { eventId },
            },
            select: {
                role: true,
                team: {
                    select: {
                        id: true,
                        teamName: true,
                        teamCode: true,
                        eventId: true,
                        createdById: true,
                        createdAt: true,
                        event: {
                            select: { EventName: true, TeamSize: true },
                        },
                        members: {
                            select: {
                                id: true,
                                role: true,
                                joinedAt: true,
                                user: {
                                    select: {
                                        id: true,
                                        name: true,
                                        email: true,
                                        profileAvatar: true,
                                    },
                                },
                            },
                            orderBy: { joinedAt: 'asc' },
                        },
                    },
                },
            },
        });

        if (!membership) {
            res.status(200).json({
                msg: 'No team found for this event',
                team: null,
            });
            return;
        }

        res.status(200).json({
            msg: 'Team found',
            team: {
                ...membership.team,
                myRole: membership.role,
                maxMembers: membership.team.event.TeamSize,
                currentMembers: membership.team.members.length,
            },
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching user team`, { error: error.message });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

/**
 * DELETE /leave/:teamId
 *
 * Removes the authenticated user from the team.
 * - If the leader leaves and other members exist, the next member is promoted.
 * - If the last member leaves, the team is deleted.
 */
export const leaveTeam = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { teamId } = req.params;

    logger.info(`[${requestId}] DELETE /teams/leave/${teamId}`, { userId });

    try {
        // 1. Check the user is actually in the team
        const membership = await prisma.teamMember.findFirst({
            where: { teamId, userId },
        });

        if (!membership) {
            sendErrorResponse(res, requestId, 'You are not a member of this team', 404);
            return;
        }

        // 2. Get all team members to decide what happens next
        const allMembers = await prisma.teamMember.findMany({
            where: { teamId },
            orderBy: { joinedAt: 'asc' },
        });

        if (allMembers.length === 1) {
            // Last member — delete the entire team (cascade deletes TeamMember)
            await prisma.team.delete({ where: { id: teamId } });

            logger.info(`[${requestId}] Last member left, team deleted`, { teamId });

            res.status(200).json({ msg: 'You left the team. Team has been dissolved.' });
            return;
        }

        // 3. Remove the member
        await prisma.teamMember.delete({ where: { id: membership.id } });

        // 4. If the leaving member was the leader, promote the next oldest member
        if (membership.role === 'leader') {
            const nextLeader = allMembers.find((m) => m.id !== membership.id);
            if (nextLeader) {
                await prisma.teamMember.update({
                    where: { id: nextLeader.id },
                    data: { role: 'leader' },
                });
                logger.info(`[${requestId}] New leader promoted`, { newLeaderId: nextLeader.userId });
            }
        }

        logger.info(`[${requestId}] User left team`, { teamId, userId });

        res.status(200).json({ msg: 'You have left the team' });
    } catch (error: any) {
        logger.error(`[${requestId}] Error leaving team`, { error: error.message, stack: error.stack });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};
