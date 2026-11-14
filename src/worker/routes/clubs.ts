import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

const clubSelectBase = {
  id: true, name: true, collegeName: true, collegeStudentsOnly: true,
  description: true, type: true, profilePicUrl: true,
} as const;

const publicClubSelect = {
  id: true, name: true, collegeName: true, description: true, type: true,
  profilePicUrl: true, clubContact: true, wings: true, instagram: true,
  twitter: true, linkedin: true, createdAt: true,
} as const;

const clubSelectWithMembers = {
  ...clubSelectBase, founderEmail: true, facultyEmail: true,
  members: { select: { id: true, name: true, email: true } },
} as const;

// ── GET /getAll ───────────────────────────────────────────────

router.get('/getAll', async (c) => {
  const requestId = generateRequestId();
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const rawLimit = parseInt(c.req.query('limit') ?? '10');
  const limit = Math.min(Math.max(rawLimit, 1), 100);
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma');
  try {
    const [resp, totalData] = await Promise.all([
      prisma.clubs.findMany({ skip, take: limit, select: clubSelectWithMembers, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] }),
      prisma.clubs.count(),
    ]);
    return c.json({ resp, totalPages: Math.ceil(totalData / limit) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Error fetching clubs', 500, err);
  }
});

// ── GET /public ───────────────────────────────────────────────

router.get('/public', async (c) => {
  const requestId = generateRequestId();
  const collegeName = c.req.query('collegeName');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const rawLimit = parseInt(c.req.query('limit') ?? '20');
  const limit = Math.min(Math.max(rawLimit, 1), 100);
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma');
  const where = collegeName ? { collegeName: { contains: collegeName, mode: 'insensitive' as const } } : undefined;
  try {
    const [clubs, totalData] = await Promise.all([
      prisma.clubs.findMany({ where, skip, take: limit, select: publicClubSelect, orderBy: [{ createdAt: 'desc' }, { id: 'asc' }] }),
      prisma.clubs.count({ where }),
    ]);
    return c.json({ clubs, totalPages: Math.ceil(totalData / limit), page, requestId }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Error fetching clubs', 500, err);
  }
});

// ── GET /getClub ──────────────────────────────────────────────

router.get('/getClub', async (c) => {
  const requestId = generateRequestId();
  const { id, name, collegeName } = c.req.query() as Record<string, string>;
  const prisma = c.get('prisma');
  try {
    if (id) {
      const response = await prisma.clubs.findUnique({
        where: { id },
        select: { id: true, name: true, collegeName: true, description: true, founderEmail: true, facultyEmail: true, members: true },
      });
      if (!response) return jsonError(c, requestId, 'no such club', 404);
      return c.json({ msg: 'club found', response, requestId }, 200);
    }
    if (name && collegeName) {
      const response = await prisma.clubs.findFirst({ where: { name, collegeName }, select: clubSelectBase });
      if (!response) return jsonError(c, requestId, 'no such club', 404);
      return c.json({ msg: 'club found', response, requestId }, 200);
    }
    if (collegeName) {
      const response = await prisma.clubs.findMany({ where: { collegeName }, select: clubSelectWithMembers, orderBy: { createdAt: 'desc' } });
      if (!response || response.length === 0) return c.json({ msg: 'no clubs found for this college', requestId }, 200);
      return c.json({ msg: 'clubs found', response, count: response.length, requestId }, 200);
    }
    if (name) {
      const response = await prisma.clubs.findMany({ where: { name }, select: clubSelectBase, orderBy: { createdAt: 'desc' } });
      if (!response || response.length === 0) return jsonError(c, requestId, 'no such club', 404);
      return c.json({ msg: 'clubs found', response, requestId }, 200);
    }
    return jsonError(c, requestId, 'Please provide at least one parameter: id, name, or collegeName', 400);
  } catch (err: any) {
    return jsonError(c, requestId, 'server error', 500, err);
  }
});

// ── GET /getClubs/:college ────────────────────────────────────

router.get('/getClubs/:college', async (c) => {
  const requestId = generateRequestId();
  const collegeName = decodeURIComponent(c.req.param('college') ?? '');
  if (!collegeName.trim()) return jsonError(c, requestId, 'College name is required', 400);
  const prisma = c.get('prisma');
  const clubs = await prisma.clubs.findMany({
    where: { collegeName: { contains: collegeName, mode: 'insensitive' } },
    select: clubSelectWithMembers, orderBy: { createdAt: 'desc' },
  });
  return c.json({ msg: `Clubs for ${collegeName} found`, clubs, count: clubs.length, requestId }, 200);
});

// ── GET /:id ──────────────────────────────────────────────────

router.get('/:id', async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('id');
  if (!clubId?.trim()) return jsonError(c, requestId, 'Club ID is required', 400);
  const prisma = c.get('prisma');
  try {
    const club = await prisma.clubs.findUnique({
      where: { id: clubId },
      select: {
        ...clubSelectBase, founderEmail: true, clubContact: true, requirements: true,
        facultyEmail: true, wings: true, coremember1: true, coremember2: true, coremember3: true,
        instagram: true, twitter: true, linkedin: true,
        announcements: { select: { id: true, Title: true, Description: true } },
        events: {
          select: {
            id: true, EventName: true, Venue: true, startDate: true, endDate: true, posterUrl: true,
            announcements: { select: { id: true, Title: true, Description: true } },
          },
        },
        members: { select: { id: true, name: true, email: true, profileAvatar: true, course: true, year: true } },
      },
    });
    if (!club) return jsonError(c, requestId, 'Club not found', 404);
    return c.json({ msg: 'Club details retrieved successfully', club, requestId }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Error retrieving club details', 500, err);
  }
});

// ── POST /club ────────────────────────────────────────────────

router.post('/club', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { name, description, type, FounderEmail, clubContact, requirements, facultyEmail, logo, wings, instagram, twitter, linkedin, collegeStudentsOnly } = body;
  if (!name || !description || !FounderEmail || !facultyEmail) {
    return jsonError(c, requestId, 'Missing required fields: name, description, FounderEmail, facultyEmail', 400);
  }

  const prisma = c.get('prisma');
  try {
    const [college, founder, alrFounder] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } }),
      prisma.user.findUnique({ where: { email: FounderEmail }, select: { id: true, name: true, collegeName: true } }),
      prisma.clubs.findFirst({ where: { founderEmail: FounderEmail }, select: { id: true } }),
    ]);

    if (!college?.collegeName) return jsonError(c, requestId, 'User college information not found', 400);
    if (!founder) return jsonError(c, requestId, 'founder not found, ask him to register', 404);
    if (collegeStudentsOnly && founder.collegeName !== college.collegeName) {
      return jsonError(c, requestId, 'Founder must belong to the same college', 400);
    }

    const duplicateClub = await prisma.clubs.findFirst({ where: { collegeName: college.collegeName, name }, select: { id: true } });
    if (duplicateClub) return c.json({ msg: 'club of this name already exists in your college', existingClubId: duplicateClub.id, requestId }, 409);
    if (alrFounder) return c.json({ msg: 'President is already a president of one club', existingClubId: alrFounder.id, requestId }, 400);

    const result = await prisma.$transaction(async (tx: any) => {
      const newClub = await tx.clubs.create({
        data: {
          name, collegeName: college.collegeName, description, type,
          founderEmail: FounderEmail, collegeStudentsOnly: Boolean(collegeStudentsOnly ?? true),
          clubContact, requirements, facultyEmail, profilePicUrl: logo,
          wings: wings || [], instagram: instagram || 'none', twitter: twitter || 'none', linkedin: linkedin || 'none',
        },
        select: { id: true, name: true },
      });
      await tx.user.update({ where: { email: FounderEmail }, data: { clubId: newClub.id, clubName: newClub.name } });
      return newClub;
    });

    return c.json({ msg: 'club formed!', clubId: result.id, requestId }, 201);
  } catch (err: any) {
    if (err?.code === 'P2002') return jsonError(c, requestId, 'a club with these details already exists', 409, err);
    logger.error(`[${requestId}] createClub error`, { error: err.message });
    return jsonError(c, requestId, 'error creating club', 500, err);
  }
});

export default router;
