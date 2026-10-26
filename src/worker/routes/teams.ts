import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

const generateTeamCode = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) code += chars.charAt(Math.floor(Math.random() * chars.length));
  return code;
};

const generateUniqueTeamCode = async (prisma: any, maxAttempts = 10): Promise<string> => {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateTeamCode();
    const existing = await prisma.team.findUnique({ where: { teamCode: code } });
    if (!existing) return code;
  }
  throw new Error('Failed to generate a unique team code');
};

const teamMemberSelect = {
  id: true, role: true,
  user: { select: { id: true, name: true, email: true, profileAvatar: true } },
};

// ── POST /create ──────────────────────────────────────────────

router.post('/create', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { eventId, teamName } = body;
  if (!eventId || !teamName) return jsonError(c, requestId, 'eventId and teamName are required', 400);

  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, TeamSize: true, EventName: true } });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);
    if (event.TeamSize <= 1) return jsonError(c, requestId, 'This is not a team event', 400);

    const existingMembership = await prisma.teamMember.findFirst({ where: { userId, team: { eventId } } });
    if (existingMembership) return jsonError(c, requestId, 'You are already in a team for this event', 409);

    const teamCode = await generateUniqueTeamCode(prisma);
    const team = await prisma.team.create({
      data: {
        teamName, teamCode, eventId, createdById: userId,
        members: { create: { userId, eventId, role: 'leader' } },
      },
      select: {
        id: true, teamName: true, teamCode: true, eventId: true, createdAt: true,
        members: { select: teamMemberSelect },
      },
    });
    return c.json({ msg: 'Team created successfully', team }, 201);
  } catch (err: any) {
    if (err.code === 'P2002') return jsonError(c, requestId, 'You are already in a team for this event', 409);
    logger.error(`[${requestId}] createTeam error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── POST /join ────────────────────────────────────────────────

router.post('/join', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { eventId, teamCode } = body;
  if (!eventId || !teamCode) return jsonError(c, requestId, 'eventId and teamCode are required', 400);

  const prisma = c.get('prisma');
  try {
    const team = await prisma.team.findUnique({
      where: { teamCode: teamCode.toUpperCase().trim() },
      select: {
        id: true, teamName: true, teamCode: true, eventId: true,
        event: { select: { TeamSize: true, EventName: true } },
        members: { select: { id: true, userId: true, role: true, user: { select: { id: true, name: true, email: true, profileAvatar: true } } } },
      },
    });
    if (!team) return jsonError(c, requestId, 'Invalid team code', 404);
    if (team.eventId !== eventId) return jsonError(c, requestId, 'This team code does not belong to the specified event', 400);
    if (team.members.length >= team.event.TeamSize) return jsonError(c, requestId, `Team is full (max ${team.event.TeamSize} members)`, 409);

    const existingMembership = await prisma.teamMember.findFirst({ where: { userId, team: { eventId } } });
    if (existingMembership) return jsonError(c, requestId, 'You are already in a team for this event', 409);

    await prisma.teamMember.create({ data: { teamId: team.id, eventId: team.eventId, userId, role: 'member' } });

    const updatedTeam = await prisma.team.findUnique({
      where: { id: team.id },
      select: { id: true, teamName: true, teamCode: true, eventId: true, createdAt: true, members: { select: teamMemberSelect } },
    });
    return c.json({ msg: 'Joined team successfully', team: updatedTeam }, 200);
  } catch (err: any) {
    if (err.code === 'P2002') return jsonError(c, requestId, 'You are already in a team for this event', 409);
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── GET /details/:teamId ──────────────────────────────────────

router.get('/details/:teamId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const teamId = c.req.param('teamId');
  const prisma = c.get('prisma');
  const team = await prisma.team.findUnique({
    where: { id: teamId },
    select: {
      id: true, teamName: true, teamCode: true, eventId: true, createdById: true, createdAt: true,
      event: { select: { EventName: true, TeamSize: true } },
      members: {
        select: { id: true, role: true, joinedAt: true, user: { select: { id: true, name: true, email: true, profileAvatar: true, collegeName: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  });
  if (!team) return jsonError(c, requestId, 'Team not found', 404);
  return c.json({ msg: 'Team details fetched', team: { ...team, maxMembers: team.event?.TeamSize, currentMembers: team.members?.length ?? 0 } }, 200);
});

// ── GET /my-team/:eventId ─────────────────────────────────────

router.get('/my-team/:eventId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  const membership = await prisma.teamMember.findFirst({
    where: { userId, team: { eventId } },
    select: {
      role: true,
      team: {
        select: {
          id: true, teamName: true, teamCode: true, eventId: true, createdById: true, createdAt: true,
          event: { select: { EventName: true, TeamSize: true } },
          members: {
            select: { id: true, role: true, joinedAt: true, user: { select: { id: true, name: true, email: true, profileAvatar: true } } },
            orderBy: { joinedAt: 'asc' },
          },
        },
      },
    },
  });
  if (!membership) return c.json({ msg: 'No team found for this event', team: null }, 200);
  return c.json({ msg: 'Team found', team: { ...membership.team, myRole: membership.role, maxMembers: membership.team?.event?.TeamSize, currentMembers: membership.team?.members?.length ?? 0 } }, 200);
});

// ── DELETE /leave/:teamId ─────────────────────────────────────

router.delete('/leave/:teamId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const teamId = c.req.param('teamId');
  const prisma = c.get('prisma');
  try {
    const membership = await prisma.teamMember.findFirst({ where: { teamId, userId }, select: { id: true, role: true } });
    if (!membership) return jsonError(c, requestId, 'You are not a member of this team', 404);

    const allMembers = await prisma.teamMember.findMany({ where: { teamId }, orderBy: { joinedAt: 'asc' } });
    if (allMembers.length === 1) {
      await prisma.team.delete({ where: { id: teamId } });
      return c.json({ msg: 'You left the team. Team has been dissolved.' }, 200);
    }
    await prisma.teamMember.delete({ where: { id: membership.id } });
    if (membership.role === 'leader') {
      const nextLeader = allMembers.find((m) => m.id !== membership.id);
      if (nextLeader) await prisma.teamMember.update({ where: { id: nextLeader.id }, data: { role: 'leader' } });
    }
    return c.json({ msg: 'You have left the team' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

export default router;
