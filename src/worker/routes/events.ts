import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware, clubHeadAuthMiddleware, adminCoreAuthMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

const EventSchema = z.object({
  eventName: z.string(), description: z.string().optional(), whatsappLink: z.string().optional(),
  form: z.string().optional(), link1: z.string().optional(), link2: z.string().optional(),
  link3: z.string().optional(), fees: z.string().optional(), paymentAmount: z.string().optional(),
  image: z.string().optional(), contactPhone: z.string().optional(),
  isPaid: z.boolean().optional(), isPaidEvent: z.boolean().optional(),
  qrCodeUrl: z.string().optional(), paymentQRCode: z.string().optional(),
  tagline: z.string().optional(), applicationStartDate: z.string().optional(),
  applicationEndDate: z.string().optional(),
  maxParticipants: z.union([z.number(), z.string()]).optional().nullable(),
});

const eventSelectBase = {
  id: true, EventName: true, description: true, tagline: true, EventMode: true,
  EventType: true, EventUrl: true, Venue: true, TeamSize: true, clubName: true,
  clubId: true, prizes: true, startDate: true, endDate: true,
  applicationStartDate: true, applicationEndDate: true, university: true,
  collegeStudentsOnly: true, contactEmail: true, contactPhone: true,
  participationFee: true, posterUrl: true, createdAt: true,
  link1: true, link2: true, link3: true, whatsappLink: true,
  isPaid: true, qrCodeUrl: true, Fees: true, maxParticipants: true, desiredSponsors: true,
  _count: { select: { attendees: true } },
  customQuestions: { orderBy: { sortOrder: 'asc' as const } },
} as const;

// ── GET /all ──────────────────────────────────────────────────

router.get('/all', async (c) => {
  const requestId = generateRequestId();
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 10;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma');
  try {
    const [response, totalData] = await Promise.all([
      prisma.event.findMany({
        take: limit, skip, orderBy: { createdAt: 'desc' },
        select: { ...eventSelectBase, attendees: { select: { user: { select: { name: true } } } } },
      }),
      prisma.event.count(),
    ]);
    if (!response || response.length === 0) return jsonError(c, requestId, 'No events found', 404);
    return c.json({ msg: 'found', response, totalPages: Math.ceil(totalData / limit) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /event/:id ────────────────────────────────────────────

router.get('/event/:id', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const prisma = c.get('prisma');
  try {
    const response = await prisma.event.findUnique({ where: { id: eventId }, select: eventSelectBase });
    if (!response) return jsonError(c, requestId, 'no such event', 404);
    return c.json({ msg: 'event found', response }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal Server error', 500, err);
  }
});

// ── POST /event ───────────────────────────────────────────────

router.post('/event', authMiddleware, clubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON payload', 400); }

  const parsedData = EventSchema.safeParse(body);
  if (!parsedData.success) return jsonError(c, requestId, 'incorrect format', 400);

  const userId = c.get('userId');
  const clubId = c.get('clubId')!;
  const clubName = c.get('clubName')!;
  const clubCollege = c.get('clubCollege')!;

  if (body.university !== clubCollege) {
    return jsonError(c, requestId, 'College mismatch, select your correct college', 400);
  }

  const prisma = c.get('prisma');
  try {
    const response = await prisma.event.create({
      data: {
        EventName: parsedData.data.eventName, description: parsedData.data.description || '',
        tagline: parsedData.data.tagline || '', EventMode: body.eventMode, EventType: body.eventType,
        EventUrl: body.eventWebsite || '', Venue: body.venue,
        TeamSize: parseInt(String(body.maxTeamSize), 10),
        clubName, clubId, prizes: body.prizes || '',
        startDate: body.eventStartDate, endDate: body.eventEndDate,
        applicationStartDate: parsedData.data.applicationStartDate || '',
        applicationEndDate: parsedData.data.applicationEndDate || '',
        university: clubCollege, collegeStudentsOnly: body.collegeStudentsOnly,
        contactEmail: body.contactEmail, contactPhone: parsedData.data.contactPhone || body.contactPhone || '',
        participationFee: body.noParticipationFee,
        posterUrl: parsedData.data.image, eventHeaderImage: parsedData.data.image,
        Form: parsedData.data.form || 'none',
        Fees: parsedData.data.paymentAmount || parsedData.data.fees || 'none',
        link1: parsedData.data.link1 ?? null, link2: parsedData.data.link2 ?? null, link3: parsedData.data.link3 ?? null,
        whatsappLink: parsedData.data.whatsappLink || '',
        isPaid: parsedData.data.isPaidEvent ?? parsedData.data.isPaid ?? false,
        qrCodeUrl: parsedData.data.paymentQRCode || parsedData.data.qrCodeUrl || null,
        createdById: userId,
      },
      select: { id: true },
    });
    return c.json({ msg: 'event created', id: response.id }, 201);
  } catch (err: any) {
    logger.error(`[${requestId}] createEvent error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /getSpeakers ──────────────────────────────────────────

router.get('/getSpeakers', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.query('id') ?? '';
  if (!eventId) return jsonError(c, requestId, 'Event ID is required', 400);
  const prisma = c.get('prisma');
  const speakers = await prisma.speakers.findMany({
    where: { eventId },
    select: { id: true, profilePic: true, about: true, name: true, email: true, eventId: true },
  });
  if (!speakers || speakers.length === 0) return jsonError(c, requestId, 'No speakers added for the event', 404);
  return c.json({ msg: 'speakers are there', speakers }, 200);
});

// ── GET /attendees/:id ────────────────────────────────────────

router.get('/attendees/:id', authMiddleware, adminCoreAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        EventName: true,
        attendees: {
          select: {
            userId: true, joinedAt: true, uniquePassId: true,
            paymentStatus: true, approvalStatus: true, paymentScreenshotUrl: true,
            user: { select: { id: true, name: true, email: true, profileAvatar: true, collegeName: true } },
          },
        },
      },
    });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);

    // registrationAnswers hangs off event/User, not userEvents — fetch once and group per attendee
    const answers = await prisma.registrationAnswer.findMany({
      where: { eventId },
      select: { userId: true, answer: true, question: { select: { label: true, type: true } } },
    });
    const attendees = event.attendees.map((a) => ({
      ...a,
      registrationAnswers: answers
        .filter((ans) => ans.userId === a.userId)
        .map(({ answer, question }) => ({ answer, question })),
    }));

    return c.json({ msg: 'attendees fetched', event: { ...event, attendees } }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /register/:id ────────────────────────────────────────

router.post('/register/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { body = {}; }
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: { id: true, maxParticipants: true, collegeStudentsOnly: true, university: true, customQuestions: true },
    });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);

    const existing = await prisma.userEvents.findUnique({ where: { userId_eventId: { userId, eventId } } });
    if (existing) return jsonError(c, requestId, 'You are already registered', 409);

    if (event.maxParticipants) {
      const count = await prisma.userEvents.count({ where: { eventId } });
      if (count >= event.maxParticipants) return jsonError(c, requestId, 'Event is full', 409);
    }

    const registration = await prisma.userEvents.create({
      data: { userId, eventId, uniquePassId: `pass-${userId}-${eventId}` },
      select: { userId: true, eventId: true, uniquePassId: true },
    });

    // Save custom question answers if provided
    if (Array.isArray(body.answers) && body.answers.length > 0) {
      const answersData = body.answers
        .filter((a: any) => a.questionId && a.answer)
        .map((a: any) => ({ questionId: a.questionId, userId, eventId, answer: String(a.answer) }));
      if (answersData.length > 0) {
        await prisma.registrationAnswer.createMany({ data: answersData, skipDuplicates: true });
      }
    }

    return c.json({ msg: 'registered successfully', registration }, 201);
  } catch (err: any) {
    if (err.code === 'P2002') return jsonError(c, requestId, 'You are already registered', 409);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── DELETE /unregister/:id ────────────────────────────────────

router.delete('/unregister/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    await prisma.userEvents.delete({ where: { userId_eventId: { userId, eventId } } });
    return c.json({ msg: 'unregistered successfully' }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return jsonError(c, requestId, 'Registration not found', 404);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

export default router;
