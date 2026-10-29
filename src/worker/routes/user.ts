import { Hono, type Context } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

const updateAvatarSchema = z.object({ profileAvatar: z.string().url() });
const updateCollegeSchema = z.object({ collegeName: z.string().trim().min(2) });

// ── GET /getUser ──────────────────────────────────────────────

router.get('/getUser', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        collegeName: true, twitter: true, instagram: true, linkedin: true,
        createdAt: true, id: true, bio: true, year: true, tags: true,
        course: true, profileAvatar: true, name: true, clubName: true,
        clubId: true, email: true, isVerified: true,
        eventAttended: {
          where: { userId },
          select: {
            uniquePassId: true,
            checkedInAt: true,
            // Dates/venue feed the app's "My events" calendar.
            event: { select: { EventName: true, id: true, posterUrl: true, startDate: true, endDate: true, Venue: true, EventMode: true, clubName: true } },
          },
        },
        CreatePost: {
          where: { authorId: userId },
          select: { id: true, description: true, image: true },
        },
        clubMemberships: {
          select: {
            clubId: true, joinedAt: true,
            club: { select: { id: true, name: true, collegeName: true, profilePicUrl: true } },
          },
        },
      },
    });
    if (!user) return jsonError(c, requestId, 'User not found', 404);
    return c.json({ user }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] getUser error`, { error: err.message });
    return jsonError(c, requestId, 'error fetching details', 500);
  }
});

// ── GET /getSidebarUser ───────────────────────────────────────

router.get('/getSidebarUser', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  const data = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, profileAvatar: true } });
  if (!data) return jsonError(c, requestId, 'no user found', 404);
  return c.json({ data }, 200);
});

// ── GET /getPublicUser ────────────────────────────────────────

router.get('/getPublicUser', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.req.query('id') as string;
  if (!userId) return jsonError(c, requestId, 'id is required', 400);
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        collegeName: true, twitter: true, instagram: true, linkedin: true,
        createdAt: true, id: true, bio: true, year: true, tags: true,
        course: true, profileAvatar: true, name: true, clubName: true,
        email: true, isVerified: true,
        eventAttended: {
          where: { userId },
          select: { uniquePassId: true, event: { select: { EventName: true, id: true } } },
        },
        CreatePost: {
          where: { authorId: userId },
          select: { id: true, description: true },
        },
        clubMemberships: {
          select: {
            clubId: true, joinedAt: true,
            club: { select: { id: true, name: true, collegeName: true, profilePicUrl: true } },
          },
        },
      },
    });
    if (!user) return jsonError(c, requestId, 'user not found', 404);
    return c.json({ user }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /getAllUsers ───────────────────────────────────────────

router.get('/getAllUsers', async (c) => {
  const requestId = generateRequestId();
  const page = parseInt(c.req.query('page') ?? '1') || 1;
  const limit = 10;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma');
  try {
    const [users, totalData] = await Promise.all([
      prisma.user.findMany({
        take: limit, skip, orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, profileAvatar: true, collegeName: true, clubName: true, year: true, course: true },
      }),
      prisma.user.count(),
    ]);
    return c.json({ users, totalPages: Math.ceil(totalData / limit) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /SearchUser ───────────────────────────────────────────

router.get('/SearchUser', async (c) => {
  const requestId = generateRequestId();
  const name = c.req.query('name');
  if (!name) return jsonError(c, requestId, "Please enter user's name", 404);
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const rawLimit = parseInt(c.req.query('limit') ?? '20');
  const limit = Math.min(Math.max(rawLimit, 1), 50);
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma');
  const users = await prisma.user.findMany({
    where: { name: { contains: name, mode: 'insensitive' } },
    select: { id: true, name: true, profileAvatar: true, collegeName: true },
    take: limit, skip, orderBy: { name: 'asc' },
  });
  return c.json({ users }, 200);
});

// ── PUT /updateProfile ────────────────────────────────────────

router.put('/updateProfile', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const { bio, tags, course, year, twitter, instagram, linkedin } = body;
  const prisma = c.get('prisma');
  await prisma.user.update({
    where: { id: userId },
    data: { bio, tags, course, year, twitter: twitter || '', instagram: instagram || '', linkedin: linkedin || '' },
    select: { id: true },
  });
  return c.json({ msg: 'Profile updated successfully' }, 200);
});

// ── PUT /updateAvatar ─────────────────────────────────────────

router.put('/updateAvatar', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = updateAvatarSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, parsed.error.errors[0]?.message ?? 'Invalid', 400);
  const prisma = c.get('prisma');
  const updated = await prisma.user.update({
    where: { id: userId }, data: { profileAvatar: parsed.data.profileAvatar },
    select: { id: true, profileAvatar: true },
  });
  return c.json({ msg: 'Avatar updated successfully', user: updated }, 200);
});

// ── PUT /updateCollegeName ────────────────────────────────────

router.put('/updateCollegeName', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = updateCollegeSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, parsed.error.errors[0]?.message ?? 'Invalid', 400);
  const prisma = c.get('prisma');
  const updated = await prisma.user.update({
    where: { id: userId }, data: { collegeName: parsed.data.collegeName },
    select: { id: true, collegeName: true },
  });
  return c.json({ msg: 'College name updated successfully', user: updated }, 200);
});

// ── GET /isFounder ────────────────────────────────────────────

router.get('/isFounder', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const eventId = c.req.query('id') as string;
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return jsonError(c, requestId, 'No user Found', 404);
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true, createdById: true } });
    if (!event) return c.json({ msg: 'you are not a founder' }, 200);
    const isAttender = await prisma.userEvents.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (isAttender) return c.json({ msg: 'identified as attendee' }, 200);
    const club = await prisma.clubs.findUnique({
      where: { id: event.clubId },
      select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
    });
    if (club && [club.founderEmail, club.coremember1, club.coremember2, club.coremember3].includes(user.email)) {
      return c.json({ msg: 'identified as founder' }, 200);
    }
    return c.json({ msg: 'you are not a founder' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /joinClub/:id ────────────────────────────────────────

router.post('/joinClub/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const clubId = c.req.param('id');
  if (!clubId) return jsonError(c, requestId, 'Club ID is required', 400);
  const prisma = c.get('prisma');
  try {
    const [club, user, existing] = await Promise.all([
      prisma.clubs.findUnique({ where: { id: clubId }, select: { name: true, collegeName: true, collegeStudentsOnly: true } }),
      prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } }),
      prisma.userClubMembership.findUnique({ where: { userId_clubId: { userId, clubId } } }),
    ]);
    if (!club) return c.json({ msg: 'no club found' }, 200);
    if (existing) return c.json({ msg: 'you are already a member of this club' }, 200);
    if (club.collegeStudentsOnly && user?.collegeName !== club.collegeName) {
      return jsonError(c, requestId, "Only students from the club founder's college can join", 403);
    }
    await prisma.userClubMembership.create({ data: { userId, clubId }, select: { id: true } });
    return c.json({ msg: 'yay club joined' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /leaveClub/:id ───────────────────────────────────────

router.post('/leaveClub/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const clubId = c.req.param('id');
  if (!clubId) return jsonError(c, requestId, 'Club ID is required', 400);
  const prisma = c.get('prisma');
  const membership = await prisma.userClubMembership.findUnique({ where: { userId_clubId: { userId, clubId } } });
  if (!membership) return jsonError(c, requestId, 'User is not a member of this club', 400);
  await prisma.userClubMembership.delete({ where: { userId_clubId: { userId, clubId } } });
  return c.json({ msg: 'Successfully left the club' }, 200);
});

// ── GET /isClubAdmin/:id ──────────────────────────────────────

// GET /isClubAdmin (no id) — is the caller a founder or core member of any
// club? The mobile app gates event creation on this; 403 means "no".
router.get('/isClubAdmin', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { id: c.get('userId') }, select: { email: true } });
    if (!user) return jsonError(c, requestId, 'Invalid user', 404);
    const email = user.email;
    const club = await prisma.clubs.findFirst({
      where: { OR: [{ founderEmail: email }, { coremember1: email }, { coremember2: email }, { coremember3: email }] },
      select: { id: true, name: true, founderEmail: true },
    });
    if (!club) return jsonError(c, requestId, 'you are not an admin', 403);
    return c.json({
      msg: 'Fetched',
      founder: 'true',
      role: club.founderEmail === email ? 'founder' : 'core',
      clubId: club.id,
      clubName: club.name,
    }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'some error occured in server', 500, err);
  }
});

router.get('/isClubAdmin/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const id = c.get('userId');
  const clubId = c.req.param('id');
  if (!clubId) return jsonError(c, requestId, 'Club ID is required', 400);
  const prisma = c.get('prisma');
  try {
    const userDetails = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (!userDetails) return jsonError(c, requestId, 'Invalid user', 404);
    const membership = await prisma.userClubMembership.findUnique({ where: { userId_clubId: { userId: id, clubId } } });
    if (!membership) return jsonError(c, requestId, 'you are not a member of this club', 403);
    const clubFounder = await prisma.clubs.findUnique({
      where: { id: clubId },
      select: { coremember1: true, coremember2: true, coremember3: true, founderEmail: true },
    });
    const isAdmin = clubFounder && [clubFounder.founderEmail, clubFounder.coremember1, clubFounder.coremember2, clubFounder.coremember3]
      .includes(userDetails.email);
    if (!isAdmin) return jsonError(c, requestId, 'you are not an admin', 403);
    return c.json({ msg: 'Fetched', founder: 'true' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'some error occured in server', 500, err);
  }
});

// ── DELETE /me, POST /deleteAccount ───────────────────────────
// Deletes the user's data and their Clerk account.

const deleteAccount = async (c: Context<HonoEnv>) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { clerkId: true } });
    if (!user) return c.json({ success: true }, 200);

    await prisma.$transaction(async (tx: any) => {
      await tx.team.deleteMany({ where: { createdById: userId } });
      // OfferSave has no onDelete: Cascade, so it would block user.delete
      await tx.offerSave.deleteMany({ where: { userId } });
      await tx.teamMember.deleteMany({ where: { userId } });
      await tx.userEvents.deleteMany({ where: { userId } });
      await tx.registrationAnswer.deleteMany({ where: { userId } });
      await tx.eventQueue.deleteMany({ where: { userId } });
      await tx.postUpvote.deleteMany({ where: { userId } });
      await tx.postDownvote.deleteMany({ where: { userId } });
      await tx.deviceToken.deleteMany({ where: { userId } });
      await tx.notification.deleteMany({ where: { userId } });
      await tx.wave.deleteMany({ where: { OR: [{ senderId: userId }, { receiverId: userId }] } });
      await tx.createPost.deleteMany({ where: { authorId: userId } });
      await tx.user.delete({ where: { id: userId } });
    });

    if (user.clerkId) {
      const res = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(user.clerkId)}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${c.env.CLERK_SECRET_KEY}` },
      });
      // 404 means the Clerk user is already gone
      if (!res.ok && res.status !== 404) {
        logger.error(`[${requestId}] Failed to delete Clerk user`, { userId, status: res.status });
        return c.json({ success: false, msg: 'Failed to delete Clerk account' }, 500);
      }
    }

    return c.json({ success: true }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] deleteUser error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
};

router.delete('/me', authMiddleware, deleteAccount);
router.post('/deleteAccount', authMiddleware, deleteAccount);

// ── Follow routes ─────────────────────────────────────────────

router.get('/feed', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  try {
    const follows = await prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } });
    const followingIds = follows.map((f: any) => f.followingId);
    if (followingIds.length === 0) return c.json({ msg: 'follow some people to see their posts here', posts: [], total: 0, totalPages: 0, page }, 200);
    const [posts, total] = await Promise.all([
      prisma.createPost.findMany({
        where: { authorId: { in: followingIds }, published: true },
        skip, take: limit, orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, description: true, image: true, clubName: true, collegeName: true, authorId: true, createdAt: true, author: { select: { id: true, name: true, profileAvatar: true } }, upvotes: true, downvotes: true },
      }),
      prisma.createPost.count({ where: { authorId: { in: followingIds }, published: true } }),
    ]);
    return c.json({ msg: 'feed fetched', posts, total, totalPages: Math.ceil(total / limit), page }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error fetching feed', 500, err);
  }
});

router.get('/follow/status/:targetId', authMiddleware, async (c) => {
  const followerId = c.get('userId');
  const followingId = c.req.param('targetId');
  const prisma = c.get('prisma') as any;
  const row = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId, followingId } }, select: { createdAt: true } });
  return c.json({ isFollowing: !!row, since: row?.createdAt ?? null }, 200);
});

router.post('/follow/:targetId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const followerId = c.get('userId');
  const followingId = c.req.param('targetId');
  if (followerId === followingId) return jsonError(c, requestId, 'you cannot follow yourself', 400);
  const prisma = c.get('prisma') as any;
  const target = await prisma.user.findUnique({ where: { id: followingId }, select: { id: true } });
  if (!target) return jsonError(c, requestId, 'user not found', 404);
  await prisma.follow.upsert({ where: { followerId_followingId: { followerId, followingId } }, create: { followerId, followingId }, update: {} });
  return c.json({ msg: 'following' }, 200);
});

router.delete('/follow/:targetId', authMiddleware, async (c) => {
  const followerId = c.get('userId');
  const followingId = c.req.param('targetId');
  const prisma = c.get('prisma') as any;
  await prisma.follow.deleteMany({ where: { followerId, followingId } });
  return c.json({ msg: 'unfollowed' }, 200);
});

router.get('/:userId/followers', authMiddleware, async (c) => {
  const userId = c.req.param('userId');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 30;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  const [rows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followingId: userId }, skip, take: limit, orderBy: { createdAt: 'desc' },
      select: { follower: { select: { id: true, name: true, profileAvatar: true, collegeName: true, bio: true } }, createdAt: true },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
  ]);
  return c.json({ msg: 'followers fetched', followers: rows.map((r: any) => ({ ...r.follower, followedAt: r.createdAt })), total, totalPages: Math.ceil(total / limit), page }, 200);
});

router.get('/:userId/following', authMiddleware, async (c) => {
  const userId = c.req.param('userId');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 30;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  const [rows, total] = await Promise.all([
    prisma.follow.findMany({
      where: { followerId: userId }, skip, take: limit, orderBy: { createdAt: 'desc' },
      select: { following: { select: { id: true, name: true, profileAvatar: true, collegeName: true, bio: true } }, createdAt: true },
    }),
    prisma.follow.count({ where: { followerId: userId } }),
  ]);
  return c.json({ msg: 'following fetched', following: rows.map((r: any) => ({ ...r.following, followedAt: r.createdAt })), total, totalPages: Math.ceil(total / limit), page }, 200);
});

// ── GET /suggestions ──────────────────────────────────────────
// People at the caller's college ranked by shared skills (User.tags),
// excluding people they follow or have a block with.

const PLACEHOLDER_COLLEGES = ['not joined', 'not_joined', 'zync college', 'n/a', 'na', 'none', ''];

router.get('/suggestions', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const me = await prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true, tags: true } });
    if (!me) return jsonError(c, requestId, 'User not found', 404);

    const [follows, blocks] = await Promise.all([
      prisma.follow.findMany({ where: { followerId: userId }, select: { followingId: true } }),
      prisma.userBlock.findMany({
        where: { OR: [{ blockerId: userId }, { blockedId: userId }] },
        select: { blockerId: true, blockedId: true },
      }),
    ]);
    const exclude = new Set<string>([userId, ...follows.map((f) => f.followingId)]);
    for (const b of blocks) exclude.add(b.blockerId === userId ? b.blockedId : b.blockerId);

    const myTags = me.tags.map((t) => t.toLowerCase());
    const hasCollege = !PLACEHOLDER_COLLEGES.includes(me.collegeName.trim().toLowerCase());
    if (!hasCollege && myTags.length === 0) return c.json({ suggestions: [] }, 200);

    const candidates = await prisma.user.findMany({
      where: {
        id: { notIn: [...exclude] },
        ...(hasCollege ? { collegeName: me.collegeName } : { tags: { hasSome: me.tags } }),
      },
      take: 200,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, profileAvatar: true, collegeName: true, course: true, year: true, tags: true },
    });

    const suggestions = candidates
      .map((u) => ({ ...u, sharedTags: u.tags.filter((t) => myTags.includes(t.toLowerCase())) }))
      .sort((a, b) => b.sharedTags.length - a.sharedTags.length)
      .slice(0, 20);
    return c.json({ suggestions }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error fetching suggestions', 500, err);
  }
});

// ── GET /:userId/badges ───────────────────────────────────────
// Derived from existing data (tiers from BADGE_ACHIEVEMENT_SYSTEM.md, plus
// attendee tiers). Returns every badge with earned + progress.

const CREATOR_TIERS = [
  { id: 'event_creator', name: 'Event Creator', icon: '⭐', goal: 1, description: 'Created a first event' },
  { id: 'event_master', name: 'Event Master', icon: '🏆', goal: 5, description: 'Created 5 events' },
  { id: 'event_legendary', name: 'Event Legendary', icon: '⚡', goal: 10, description: 'Created 10 events' },
  { id: 'community_champion', name: 'Community Champion', icon: '🌟', goal: 20, description: 'Created 20 events' },
];
const ATTENDEE_TIERS = [
  { id: 'first_event', name: 'First Event', icon: '🎟️', goal: 1, description: 'Registered for a first event' },
  { id: 'regular', name: 'Regular', icon: '🔥', goal: 5, description: 'Registered for 5 events' },
  { id: 'event_explorer', name: 'Event Explorer', icon: '🧭', goal: 10, description: 'Registered for 10 events' },
];

router.get('/:userId/badges', async (c) => {
  const requestId = generateRequestId();
  const userId = c.req.param('userId');
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user) return jsonError(c, requestId, 'User not found', 404);

    const [founded, memberships, created, attended] = await Promise.all([
      prisma.clubs.findMany({ where: { founderEmail: user.email }, select: { id: true, name: true } }),
      prisma.userClubMembership.count({ where: { userId } }),
      prisma.event.count({ where: { createdById: userId } }),
      prisma.userEvents.count({ where: { userId } }),
    ]);

    const tier = (t: (typeof CREATOR_TIERS)[number], count: number) => ({
      id: t.id, name: t.name, icon: t.icon, description: t.description,
      earned: count >= t.goal, progress: Math.min(count, t.goal), goal: t.goal,
    });
    const badges = [
      {
        id: 'club_founder', name: 'Club Founder', icon: '👑',
        description: founded.length ? `Founded ${founded.map((f) => f.name).join(', ')}` : 'Founded a club',
        earned: founded.length > 0, progress: Math.min(founded.length, 1), goal: 1,
      },
      {
        id: 'club_member', name: 'Club Member', icon: '🤝', description: 'Joined a club',
        earned: memberships > 0, progress: Math.min(memberships, 1), goal: 1,
      },
      ...CREATOR_TIERS.map((t) => tier(t, created)),
      ...ATTENDEE_TIERS.map((t) => tier(t, attended)),
    ];
    return c.json({ badges, stats: { clubsFounded: founded.length, clubsJoined: memberships, eventsCreated: created, eventsAttended: attended } }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error fetching badges', 500, err);
  }
});

export default router;
