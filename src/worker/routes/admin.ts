import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';

const router = new Hono<HonoEnv>();

// ── Inline admin check (re-used locally) ─────────────────────

const isAdmin = async (userId: string, adminEmails: string, prisma: any): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return false;
  const emails = [
    'zynvosocial@gmail.com', 'rishirajnatj@gmail.com',
    ...(adminEmails ?? '').split(',').map((e: string) => e.trim()).filter(Boolean),
  ].map((e: string) => e.toLowerCase());
  return emails.includes(user.email.toLowerCase());
};

// ── DELETE /clubs/:clubId/members — remove member ─────────────

router.delete('/clubs/:clubId/members', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const id = c.get('userId');
  const clubId = c.req.param('clubId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { member } = body;
  if (!member || typeof member !== 'string') return jsonError(c, requestId, 'member id is required', 400);
  if (!clubId) return jsonError(c, requestId, 'clubId is required', 400);

  const prisma = c.get('prisma') as any;
  try {
    const userEmail = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (!userEmail) return jsonError(c, requestId, 'unauthorized id', 404);

    const founder = await prisma.clubs.findUnique({ where: { id: clubId, founderEmail: userEmail.email } });
    if (!founder) return jsonError(c, requestId, "You're not the club president", 403);

    await prisma.userClubMembership.delete({
      where: { userId_clubId: { userId: member, clubId } },
    });
    await prisma.user.update({
      where: { id: member },
      data: { clubId: null, clubName: null },
      select: { id: true },
    });

    return c.json({ msg: 'member removed' }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return jsonError(c, requestId, 'member not found', 404);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /users — list all users (admin only) ──────────────────

router.get('/users', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma') as any;
  if (!(await isAdmin(userId, c.env.ADMIN_EMAILS, prisma))) {
    return jsonError(c, requestId, 'Access denied', 403);
  }
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, collegeName: true, clubName: true, createdAt: true, isVerified: true } }),
    prisma.user.count(),
  ]);
  return c.json({ users, total, totalPages: Math.ceil(total / limit), page }, 200);
});

// ── DELETE /users/:userId — delete any user (admin only) ──────

router.delete('/users/:userId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const adminId = c.get('userId');
  const targetId = c.req.param('userId');
  const prisma = c.get('prisma') as any;
  if (!(await isAdmin(adminId, c.env.ADMIN_EMAILS, prisma))) {
    return jsonError(c, requestId, 'Access denied', 403);
  }
  try {
    await prisma.$transaction(async (tx: any) => {
      await tx.team.deleteMany({ where: { createdById: targetId } });
      await tx.teamMember.deleteMany({ where: { userId: targetId } });
      await tx.userEvents.deleteMany({ where: { userId: targetId } });
      await tx.registrationAnswer.deleteMany({ where: { userId: targetId } });
      await tx.eventQueue.deleteMany({ where: { userId: targetId } });
      await tx.postUpvote.deleteMany({ where: { userId: targetId } });
      await tx.postDownvote.deleteMany({ where: { userId: targetId } });
      await tx.deviceToken.deleteMany({ where: { userId: targetId } });
      await tx.notification.deleteMany({ where: { userId: targetId } });
      await tx.wave.deleteMany({ where: { OR: [{ senderId: targetId }, { receiverId: targetId }] } });
      await tx.createPost.deleteMany({ where: { authorId: targetId } });
      await tx.user.delete({ where: { id: targetId } });
    });
    return c.json({ success: true }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return c.json({ success: true }, 200);
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ═══════════════════════════════════════════════════════════════
// Club-founder controls ported from Express adminControls (Cloud Run retirement)
// Membership uses UserClubMembership (multi-club), not the legacy user.clubId.
// ═══════════════════════════════════════════════════════════════

const readJson = async (c: any): Promise<any> => {
  try { return await c.req.json(); } catch { return {}; }
};

// Returns the club if the caller is its founder, else null.
const founderClub = async (prisma: any, userId: string, clubId: string | undefined) => {
  if (!clubId) return null;
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return null;
  const club = await prisma.clubs.findUnique({ where: { id: clubId } });
  return club && club.founderEmail === user.email ? club : null;
};

const ensureMembership = (prisma: any, userId: string, clubId: string) =>
  prisma.userClubMembership.upsert({
    where: { userId_clubId: { userId, clubId } },
    create: { userId, clubId },
    update: {},
  });

// ── PUT /updateClubLinks/:id ──────────────────────────────────

router.put('/updateClubLinks/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('id');
  const { instagram, twitter, linkedin } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    if (!(await founderClub(prisma, c.get('userId'), clubId))) {
      return c.json({ msg: 'Invalid founder ID' }, 403);
    }
    const updated: Record<string, string> = {};
    if (instagram) updated.instagram = instagram;
    if (twitter) updated.twitter = twitter;
    if (linkedin) updated.linkedin = linkedin;
    if (Object.keys(updated).length === 0) return c.json({ msg: 'No social links provided to update' }, 400);
    await prisma.clubs.update({ where: { id: clubId }, data: updated });
    return c.json({ msg: 'Social links updated successfully', updated }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── PUT /addWings/:id ─────────────────────────────────────────

router.put('/addWings/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('id');
  const { wings } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    if (!(await founderClub(prisma, c.get('userId'), clubId))) {
      return c.json({ msg: 'Invalid Founder id' }, 403);
    }
    await prisma.clubs.update({ where: { id: clubId }, data: { wings: wings || [] } });
    return c.json({ msg: 'wings added' }, 201);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /removeMember/:clubId ────────────────────────────────

router.post('/removeMember/:clubId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('clubId');
  const { member } = await readJson(c);
  if (!member || typeof member !== 'string') return c.json({ msg: 'member id is required' }, 400);
  const prisma = c.get('prisma');
  try {
    if (!(await founderClub(prisma, c.get('userId'), clubId))) {
      return c.json({ msg: 'Youre not the club president' }, 403);
    }
    await prisma.$transaction([
      prisma.userClubMembership.deleteMany({ where: { userId: member, clubId } }),
      // Clear the legacy single-club pointer too, if it points at this club
      prisma.user.updateMany({ where: { id: member, clubId }, data: { clubId: null, clubName: null } }),
    ]);
    return c.json({ msg: 'members remove' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── PUT /transferOwnership/:clubId ────────────────────────────

router.put('/transferOwnership/:clubId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('clubId');
  const body = await readJson(c);
  // The frontend sends newOwnerEmail; Express read email. Accept both.
  const email: string | undefined = body.newOwnerEmail ?? body.email;
  if (!email) return c.json({ msg: 'New owner email is required' }, 400);
  const prisma = c.get('prisma');
  try {
    if (!(await founderClub(prisma, c.get('userId'), clubId))) {
      return c.json({ msg: 'Youre not the club president' }, 403);
    }
    const newOwner = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (!newOwner) return c.json({ msg: 'The user is not present on Zynvo Social' }, 404);
    await prisma.$transaction([
      prisma.clubs.update({ where: { id: clubId }, data: { founderEmail: email } }),
      ensureMembership(prisma, newOwner.id, clubId),
    ]);
    return c.json({ msg: 'Founder updated, your sacrifices will go down in history.' }, 201);
  } catch (err: any) {
    // founderEmail is unique: the new owner already founds another club
    if (err.code === 'P2002') return c.json({ msg: 'That user already owns another club' }, 409);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /addCoreMembers/:clubId ──────────────────────────────

router.post('/addCoreMembers/:clubId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('clubId');
  const { coremember1, coremember2, coremember3 } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const club = await founderClub(prisma, c.get('userId'), clubId);
    if (!club) return c.json({ msg: "You're not the club president" }, 403);

    const coreMembers: string[] = [coremember1, coremember2, coremember3].filter(Boolean);
    const users = await prisma.user.findMany({ where: { email: { in: coreMembers } }, select: { id: true, email: true } });
    const missingMembers = coreMembers.filter((email) => !users.some((u: any) => u.email === email));
    if (missingMembers.length > 0) {
      return c.json({ msg: 'Some members are not on Zynvo Social', missingMembers }, 400);
    }

    await prisma.$transaction([
      prisma.clubs.update({
        where: { id: clubId },
        data: {
          coremember1: coremember1 || club.coremember1,
          coremember2: coremember2 || club.coremember2,
          coremember3: coremember3 || club.coremember3,
        },
      }),
      ...users.map((u: any) => ensureMembership(prisma, u.id, clubId)),
    ]);
    return c.json({ msg: 'Core members added successfully', added: coreMembers }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── POST /removeCoremembers/:clubId ───────────────────────────
// Removes the core role only; the users stay members of the club.

router.post('/removeCoremembers/:clubId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('clubId');
  const { coremember1, coremember2, coremember3 } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const club = await founderClub(prisma, c.get('userId'), clubId);
    if (!club) return c.json({ msg: "You're not the club president" }, 403);

    const toRemove: string[] = [coremember1, coremember2, coremember3].filter(Boolean);
    if (toRemove.length === 0) return c.json({ msg: 'No core members provided to remove' }, 400);

    const current = [club.coremember1, club.coremember2, club.coremember3];
    const invalidMembers = toRemove.filter((email) => !current.includes(email));
    if (invalidMembers.length > 0) {
      return c.json({ msg: 'Some users are not core members of this club', invalidMembers }, 400);
    }

    const keep = (email: string | null) => (email && toRemove.includes(email) ? null : email);
    await prisma.clubs.update({
      where: { id: clubId },
      data: {
        coremember1: keep(club.coremember1),
        coremember2: keep(club.coremember2),
        coremember3: keep(club.coremember3),
      },
    });
    return c.json({ msg: 'Core members removed successfully', removed: toRemove }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── Event-level founder controls ──────────────────────────────

const founderOfEventClub = async (prisma: any, userId: string, eventId: string) => {
  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true } });
  if (!event) return { event: null, allowed: false };
  return { event, allowed: !!(await founderClub(prisma, userId, event.clubId)) };
};

router.post('/deleteEvent/:eventId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const { event, allowed } = await founderOfEventClub(prisma, c.get('userId'), eventId);
    if (!event) return c.json({ msg: 'no such event found' }, 404);
    if (!allowed) return c.json({ msg: 'unauthorized access' }, 403);
    // Delete dependents first; several relations don't cascade
    await prisma.$transaction([
      prisma.registrationAnswer.deleteMany({ where: { eventId } }),
      prisma.eventCustomQuestion.deleteMany({ where: { eventId } }),
      prisma.eventAnnouncement.deleteMany({ where: { eventId } }),
      prisma.eventGallery.deleteMany({ where: { eventId } }),
      prisma.judges.deleteMany({ where: { eventId } }),
      prisma.speakers.deleteMany({ where: { eventId } }),
      prisma.userEvents.deleteMany({ where: { eventId } }),
      prisma.teamMember.deleteMany({ where: { team: { eventId } } }),
      prisma.team.deleteMany({ where: { eventId } }),
      prisma.scheduleSession.deleteMany({ where: { scheduleDay: { eventId } } }),
      prisma.scheduleDay.deleteMany({ where: { eventId } }),
      prisma.event.delete({ where: { id: eventId } }),
    ]);
    return c.json({ msg: 'event deleted, refresh page' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

router.put('/updateEventLinks/:eventId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const { link1, link2, link3 } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const { event, allowed } = await founderOfEventClub(prisma, c.get('userId'), eventId);
    if (!event || !allowed) return c.json({ msg: "you're forbidden sir" }, 403);
    const updated: Record<string, string> = {};
    if (link1) updated.link1 = link1;
    if (link2) updated.link2 = link2;
    if (link3) updated.link3 = link3;
    if (Object.keys(updated).length === 0) return c.json({ msg: 'No links provided to update' }, 400);
    await prisma.event.update({ where: { id: eventId }, data: updated });
    return c.json({ msg: 'Event links updated successfully', updated }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

export default router;
