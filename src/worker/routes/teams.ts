import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import { createNotification } from '../utils/notification';
import type { FcmConfig } from '../fcm';

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
          lookingForMembers: true, lookingFor: true,
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

// ── Team finder ───────────────────────────────────────────────
// Leaders mark a team as recruiting; students browse open teams for an event
// and send join requests that the leader accepts or declines.

const getFcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

const isTeamLeader = async (prisma: any, teamId: string, userId: string) => {
  const m = await prisma.teamMember.findUnique({ where: { teamId_userId: { teamId, userId } }, select: { role: true } });
  return m?.role === 'leader';
};

// PUT /:teamId/recruiting { lookingForMembers, lookingFor? }
router.put('/:teamId/recruiting', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const teamId = c.req.param('teamId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const prisma = c.get('prisma');
  try {
    if (!(await isTeamLeader(prisma, teamId, c.get('userId')))) return jsonError(c, requestId, 'Only the team leader can do this', 403);
    const team = await prisma.team.update({
      where: { id: teamId },
      data: {
        lookingForMembers: Boolean(body?.lookingForMembers),
        lookingFor: typeof body?.lookingFor === 'string' ? body.lookingFor.trim().slice(0, 200) || null : undefined,
      },
      select: { id: true, lookingForMembers: true, lookingFor: true },
    });
    return c.json({ msg: 'Team updated', team }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] recruiting error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// GET /open/:eventId — recruiting teams that still have space
router.get('/open/:eventId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { TeamSize: true } });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);

    const [teams, myRequests] = await Promise.all([
      prisma.team.findMany({
        where: { eventId, lookingForMembers: true },
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, teamName: true, lookingFor: true, createdAt: true,
          members: { select: { role: true, user: { select: { id: true, name: true, profileAvatar: true, tags: true } } } },
        },
      }),
      prisma.teamJoinRequest.findMany({ where: { eventId, userId }, select: { teamId: true, status: true } }),
    ]);
    const requestStatus = new Map(myRequests.map((r) => [r.teamId, r.status]));
    const open = teams
      .filter((t) => t.members.length < event.TeamSize)
      .map((t) => ({
        ...t,
        memberCount: t.members.length,
        maxMembers: event.TeamSize,
        myRequestStatus: requestStatus.get(t.id) ?? null,
      }));
    return c.json({ msg: 'Open teams', teams: open }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] open teams error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// POST /:teamId/requests { message? }
router.post('/:teamId/requests', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const teamId = c.req.param('teamId');
  const userId = c.get('userId');
  let body: any = {};
  try { body = await c.req.json(); } catch { /* message is optional */ }

  const prisma = c.get('prisma');
  try {
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      select: {
        id: true, teamName: true, eventId: true, lookingForMembers: true,
        event: { select: { TeamSize: true, EventName: true } },
        _count: { select: { members: true } },
        members: { where: { role: 'leader' }, select: { userId: true } },
      },
    });
    if (!team) return jsonError(c, requestId, 'Team not found', 404);
    if (!team.lookingForMembers) return jsonError(c, requestId, 'This team is not looking for members', 409);
    if (team._count.members >= team.event.TeamSize) return jsonError(c, requestId, 'This team is full', 409);

    const inTeam = await prisma.teamMember.findFirst({ where: { userId, eventId: team.eventId }, select: { id: true } });
    if (inTeam) return jsonError(c, requestId, 'You are already in a team for this event', 409);

    const message = typeof body?.message === 'string' ? body.message.trim().slice(0, 300) || null : null;
    const request = await prisma.teamJoinRequest.upsert({
      where: { teamId_userId: { teamId, userId } },
      create: { teamId, userId, eventId: team.eventId, message },
      update: { status: 'pending', message },
      select: { id: true, status: true },
    });

    const leaderId = team.members[0]?.userId;
    if (leaderId) {
      const requester = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
      c.executionCtx.waitUntil(createNotification(prisma as any, getFcmCfg(c), {
        userId: leaderId,
        type: 'team_join_request',
        title: `${requester?.name ?? 'Someone'} wants to join ${team.teamName}`,
        body: message ?? `For ${team.event.EventName}. Open the team tab to respond.`,
        data: { teamId, eventId: team.eventId },
        push: true,
      }));
    }
    return c.json({ msg: 'Request sent', request }, 201);
  } catch (err: any) {
    logger.error(`[${requestId}] join request error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// GET /:teamId/requests — pending requests (leader only)
router.get('/:teamId/requests', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const teamId = c.req.param('teamId');
  const prisma = c.get('prisma');
  try {
    if (!(await isTeamLeader(prisma, teamId, c.get('userId')))) return jsonError(c, requestId, 'Only the team leader can do this', 403);
    const requests = await prisma.teamJoinRequest.findMany({
      where: { teamId, status: 'pending' },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true, message: true, createdAt: true,
        user: { select: { id: true, name: true, profileAvatar: true, collegeName: true, course: true, year: true, tags: true } },
      },
    });
    return c.json({ msg: 'Requests', requests }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] list requests error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// PUT /:teamId/requests/:requestId { action: 'accept' | 'decline' }
router.put('/:teamId/requests/:requestId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const teamId = c.req.param('teamId');
  const joinRequestId = c.req.param('requestId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const action = body?.action;
  if (action !== 'accept' && action !== 'decline') return jsonError(c, requestId, 'action must be accept or decline', 400);

  const prisma = c.get('prisma');
  try {
    if (!(await isTeamLeader(prisma, teamId, c.get('userId')))) return jsonError(c, requestId, 'Only the team leader can do this', 403);
    const jr = await prisma.teamJoinRequest.findFirst({
      where: { id: joinRequestId, teamId, status: 'pending' },
      select: { id: true, userId: true, eventId: true, team: { select: { teamName: true, event: { select: { TeamSize: true } }, _count: { select: { members: true } } } } },
    });
    if (!jr) return jsonError(c, requestId, 'Request not found', 404);

    if (action === 'accept') {
      if (jr.team._count.members >= jr.team.event.TeamSize) return jsonError(c, requestId, 'Your team is full', 409);
      const inTeam = await prisma.teamMember.findFirst({ where: { userId: jr.userId, eventId: jr.eventId }, select: { id: true } });
      if (inTeam) {
        await prisma.teamJoinRequest.update({ where: { id: jr.id }, data: { status: 'declined' } });
        return jsonError(c, requestId, 'They already joined another team', 409);
      }
      await prisma.$transaction([
        prisma.teamMember.create({ data: { teamId, eventId: jr.eventId, userId: jr.userId, role: 'member' } }),
        prisma.teamJoinRequest.update({ where: { id: jr.id }, data: { status: 'accepted' } }),
        // Their other pending requests for this event no longer apply.
        prisma.teamJoinRequest.updateMany({
          where: { userId: jr.userId, eventId: jr.eventId, status: 'pending', NOT: { id: jr.id } },
          data: { status: 'declined' },
        }),
      ]);
    } else {
      await prisma.teamJoinRequest.update({ where: { id: jr.id }, data: { status: 'declined' } });
    }

    c.executionCtx.waitUntil(createNotification(prisma as any, getFcmCfg(c), {
      userId: jr.userId,
      type: 'team_join_response',
      title: action === 'accept' ? `You're in ${jr.team.teamName}!` : `${jr.team.teamName} didn't accept your request`,
      body: action === 'accept' ? 'Open the event to meet your team.' : 'Other teams are still looking. Have a look.',
      data: { teamId, eventId: jr.eventId },
      push: true,
    }));
    return c.json({ msg: action === 'accept' ? 'Member added' : 'Request declined' }, 200);
  } catch (err: any) {
    if (err?.code === 'P2002') return jsonError(c, requestId, 'They already joined another team', 409);
    logger.error(`[${requestId}] respond request error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

export default router;
