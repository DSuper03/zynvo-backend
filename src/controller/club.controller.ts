import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import prisma from '../db/db';
import { generateRequestId, sendErrorResponse } from '../utils/helper';
import { link } from 'fs';

const clubSelectBase = {
    id: true,
    name: true,
    collegeName: true,
    description: true,
    type: true,
    profilePicUrl: true,
} as const;

const clubSelectWithMembers = {
    ...clubSelectBase,
    founderEmail: true,
    facultyEmail: true,
    members: {
        select: {
            id: true,
            name: true,
            email: true,
        }
    }
} as const;

export const getAllClubs = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    logger.info(`[${requestId}] GET /getAll - Starting request`, {
        userId: req.id,
        query: req.query
    });

    try {
        const pages = parseInt(req.query.page as string) || 1;
        const limit = 10;
        const skip = (pages - 1) * limit;

        logger.info(`[${requestId}] Fetching clubs with pagination`, {
            page: pages,
            limit,
            skip
        });

        const [resp, totalData] = await Promise.all([
            prisma.clubs.findMany({
                skip,
                take: limit,
                select: clubSelectWithMembers,
            }),
            prisma.clubs.count()
        ]);

        logger.info(`[${requestId}] Successfully fetched clubs`, {
            clubsCount: resp.length,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        });

        res.status(200).json({
            resp,
            totalPages: Math.ceil(totalData / limit)
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error in GET /getAll`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            userId: req.id
        });

        console.error(`[${requestId}] Database error:`, error);

        sendErrorResponse(res, requestId, 'Error fetching clubs', 500, error);
    }
};


export const getClubByQuery = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { id, name, collegeName } = req.query;

    logger.info(`[${requestId}] GET /getClub - Starting request`, {
        userId: req.id,
        queryParams: { id, name, collegeName }
    });

    try {
        if (id) {
            logger.info(`[${requestId}] Searching club by ID`, { id });

            const response = await prisma.clubs.findUnique({
                where: { id: id as string },
                select: {
                    id: true,
                    name: true,
                    collegeName: true,
                    description: true,
                    founderEmail: true,
                    facultyEmail: true,
                    members: true,
                },
            });

            if (!response) {
                logger.warn(`[${requestId}] Club not found by ID`, { id });
                sendErrorResponse(res, requestId, 'no such club', 404);
                return;
            }

            logger.info(`[${requestId}] Club found by ID`, {
                clubId: response.id,
                clubName: response.name
            });

            res.status(200).json({
                msg: 'club found',
                response,
                requestId
            });
            return;
        }

        else if (name && collegeName) {
            logger.info(`[${requestId}] Searching club by name and college`, {
                name,
                collegeName
            });

            const response = await prisma.clubs.findFirst({
                where: {
                    name: name as string,
                    collegeName: collegeName as string,
                },
                select: clubSelectBase,
            });

            if (!response) {
                logger.warn(`[${requestId}] Club not found by name and college`, {
                    name,
                    collegeName
                });
                sendErrorResponse(res, requestId, 'no such club', 404);
                return;
            }

            logger.info(`[${requestId}] Club found by name and college`, {
                clubId: response.id
            });

            res.status(200).json({
                msg: 'club found',
                response,
                requestId
            });
            return;
        }

        else if (collegeName) {
            logger.info(`[${requestId}] Searching clubs by college`, { collegeName });

            const response = await prisma.clubs.findMany({
                where: {
                    collegeName: collegeName as string
                },
                select: clubSelectWithMembers,
            });

            if (!response || response.length === 0) {
                logger.warn(`[${requestId}] No clubs found for college`, { collegeName });
                res.status(200).json({
                    msg: 'no clubs found for this college',
                    requestId
                });
                return;
            }

            logger.info(`[${requestId}] Clubs found for college`, {
                collegeName,
                clubsCount: response.length
            });

            res.status(200).json({
                msg: 'clubs found',
                response,
                count: response.length,
                requestId
            });
            return;
        }

        else if (name) {
            logger.info(`[${requestId}] Searching clubs by name`, { name });

            const response = await prisma.clubs.findMany({
                where: { name: name as string },
                select: clubSelectBase,
            });

            if (!response || response.length === 0) {
                logger.warn(`[${requestId}] No clubs found by name`, { name });
                sendErrorResponse(res, requestId, 'no such club', 404);
                return;
            }

            logger.info(`[${requestId}] Clubs found by name`, {
                name,
                clubsCount: response.length
            });

            res.status(200).json({
                msg: 'clubs found, add college filter to sort out',
                response,
                requestId
            });
            return;
        }
        else {
            logger.warn(`[${requestId}] No query parameters provided`);
            sendErrorResponse(res, requestId, 'Please provide at least one parameter: id, name, or collegeName', 400);
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error in GET /getClub`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            queryParams: { id, name, collegeName },
            userId: req.id
        });

        console.error(`[${requestId}] Database error:`, error);
        sendErrorResponse(res, requestId, 'server error', 500, error);
    }
};


export const getClubsByCollege = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    try {
        const collegeName = decodeURIComponent(req.params.college);

        logger.info(`[${requestId}] GET /getClubs/:college - Starting request`, {
            collegeName,
            originalParam: req.params.college
        });

        if (!collegeName || collegeName.trim() === '') {
            logger.warn(`[${requestId}] Empty college name provided`);
            sendErrorResponse(res, requestId, 'College name is required', 400);
            return;
        }

        const clubs = await prisma.clubs.findMany({
            where: {
                collegeName: {
                    contains: collegeName,
                    mode: 'insensitive'
                }
            },
            select: clubSelectWithMembers,
        });

        logger.info(`[${requestId}] Successfully fetched clubs for college`, {
            collegeName,
            clubsFound: clubs.length
        });

        res.status(200).json({
            msg: `Clubs for ${collegeName} found`,
            clubs,
            count: clubs.length,
            requestId
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error in GET /getClubs/:college`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            college: req.params.college
        });

        console.error(`[${requestId}] Database error:`, error);

        sendErrorResponse(res, requestId, 'server error', 500, error);
    }
};

export const getClubById = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    try {
        const clubId = req.params.id;

        logger.info(`[${requestId}] GET /:id - Starting request`, {
            clubId,
            userId: req.id
        });

        if (!clubId || clubId.trim() === '') {
            logger.warn(`[${requestId}] Empty club ID provided`);
            sendErrorResponse(res, requestId, 'Club ID is required', 400);
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: {
                id: clubId,
            },
            select: {
                ...clubSelectBase,
                founderEmail: true,
                clubContact: true,
                requirements: true,
                facultyEmail: true,
                wings: true,
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        profileAvatar: true,
                        course: true,
                        year: true
                    }
                }
            },
        });

        if (!club) {
            logger.warn(`[${requestId}] Club not found`, { clubId });
            sendErrorResponse(res, requestId, 'Club not found', 404);
            return;
        }

        logger.info(`[${requestId}] Club details retrieved successfully`, {
            clubId: club.id,
            clubName: club.name,
            membersCount: club.members.length
        });

        res.status(200).json({
            msg: 'Club details retrieved successfully',
            club,
            requestId
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error in GET /:id`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            clubId: req.params.id,
            userId: req.id
        });

        console.error(`[${requestId}] Database error:`, error);
        sendErrorResponse(res, requestId, 'Error retrieving club details', 500, error);
    }
};

export const createClub = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    try {
        const {
            name,
            description,
            type,
            FounderEmail,
            clubContact,
            requirements,
            facultyEmail,
            logo,
            wings,
            instagram,
            twitter,
            linkedin
        } = req.body;

        const userId = req.id;

        logger.info(`[${requestId}] POST /club - Starting club creation`, {
            userId,
            clubName: name,
            founderEmail: FounderEmail,
            type
        });

        if (!name || !description || !FounderEmail || !facultyEmail) {
            logger.warn(`[${requestId}] Missing required fields`, {
                hasName: !!name,
                hasDescription: !!description,
                hasFounderEmail: !!FounderEmail,
                hasFacultyEmail: !!facultyEmail
            });

            sendErrorResponse(res, requestId, 'Missing required fields: name, description, FounderEmail, facultyEmail', 400);
            return;
        }

        logger.info(`[${requestId}] Fetching user and founder information`, { userId, FounderEmail });

        const [college, founder, alrFounder] = await Promise.all([
            // Get user's college
            prisma.user.findUnique({
                where: { id: userId },
                select: { collegeName: true },
            }),
            // Check if founder exists
            prisma.user.findUnique({
                where: { email: FounderEmail },
                select: { id: true, name: true },
            }),
            // Check if founder is already a president
            prisma.clubs.findFirst({
                where: { founderEmail: FounderEmail },
                select: { id: true },
            })
        ]);
        if (!college || !college.collegeName) {
            logger.warn(`[${requestId}] User college not found`, { userId });
            sendErrorResponse(res, requestId, 'User college information not found. Please update your profile.', 400);
            return;
        }

        logger.info(`[${requestId}] User college found`, {
            collegeName: college.collegeName
        });

        if (!founder) {
            logger.warn(`[${requestId}] Founder not found`, { FounderEmail });
            sendErrorResponse(res, requestId, 'founder not found, ask him to register', 404);
            return;
        }

        logger.info(`[${requestId}] Founder found`, {
            founderId: founder.id,
            founderName: founder.name
        });

        const duplicateClub = await prisma.clubs.findFirst({
            where: {
                collegeName: college.collegeName,
                name: name,
            },
            select: { id: true },
        });

        if (duplicateClub) {
            logger.warn(`[${requestId}] Duplicate club name found`, {
                existingClubId: duplicateClub.id,
                name,
                collegeName: college.collegeName
            });

            res.status(409).json({
                msg: 'the club of this name already exists in your college, delete that or create a new club',
                existingClubId: duplicateClub.id,
                requestId
            });
            return;
        }

        if (alrFounder) {
            logger.warn(`[${requestId}] Founder is already a president`, {
                FounderEmail,
                existingClub: alrFounder.id
            });

            res.status(400).json({
                msg: "President you chose, is already a president of one club",
                existingClubId: alrFounder.id,
                requestId
            });
            return;
        }

        logger.info(`[${requestId}] Creating club with transaction`, {
            name,
            collegeName: college.collegeName
        });

        const result = await prisma.$transaction(async (tx) => {
            const newClub = await tx.clubs.create({
                data: {
                    name: name,
                    collegeName: college.collegeName,
                    description: description,
                    type: type,
                    founderEmail: FounderEmail,
                    clubContact: clubContact,
                    requirements: requirements,
                    facultyEmail: facultyEmail,
                    profilePicUrl: logo,
                    wings: wings || [],
                    instagram : instagram ? instagram : "none",
                    twitter : twitter ? twitter : "none",
                    linkedin : linkedin ? linkedin : "none"
                },
                select: { id: true, name: true }
            });

            const updatedFounder = await tx.user.update({
                where: { email: FounderEmail },
                data: {
                    clubId: newClub.id,
                    clubName: newClub.name
                },
                select: { id: true }
            });

            return { club: newClub, founderUpdated: !!updatedFounder };
        });

        logger.info(`[${requestId}] Club creation completed successfully`, {
            clubId: result.club.id,
            clubName: result.club.name,
            founderJoined: result.founderUpdated
        });

        res.status(201).json({
            msg: 'club formed!',
            clubId: result.club.id,
            requestId
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error in POST /club`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            userId: req.id,
            requestBody: req.body
        });

        console.error(`[${requestId}] Club creation error:`, error);

        sendErrorResponse(res, requestId, 'error creating club', 500, error);
    }
};


