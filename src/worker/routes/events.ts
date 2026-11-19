import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware, clubHeadAuthMiddleware, adminCoreAuthMiddleware, specificClubHeadAuthMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { cached } from '../cache';
import { logger } from '../logger';
import { sameCollege } from '../utils/college';
import { createNotification, sendToMany } from '../utils/notification';
import { notifyCoreTeamOfEvent, notifyEventChanges, notifyEventDecision } from '../utils/event-notifications';
import type { FcmConfig } from '../fcm';

const router = new Hono<HonoEnv>();

const getFcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

/**
 * Tells an event's organisers (club founder + core members, and the event
 * creator) about a new registration. Every registration lands in their in-app
 * inbox; a push is sent only when it needs action (approval or a payment
 * screenshot to check), so big events don't buzz phones for every sign-up.
 */
async function notifyOrganisersOfRegistration(
  prisma: any,
  fcmCfg: FcmConfig,
  input: { eventId: string; attendeeId: string; needsApproval: boolean; paymentToReview: boolean },
): Promise<void> {
  try {
    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
      select: { EventName: true, clubId: true, createdById: true },
    });
    if (!event) return;
    const [club, attendee] = await Promise.all([
      event.clubId
        ? prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
          })
        : null,
      prisma.user.findUnique({ where: { id: input.attendeeId }, select: { name: true } }),
    ]);
    const emails = club
      ? [club.founderEmail, club.coremember1, club.coremember2, club.coremember3].filter(
          (e: string | null): e is string => !!e && e !== 'none',
        )
      : [];
    const managers = emails.length
      ? await prisma.user.findMany({
          where: { OR: emails.map((e) => ({ email: { equals: e, mode: 'insensitive' as const } })) },
          select: { id: true },
        })
      : [];
    const ids = new Set<string>(managers.map((m: any) => m.id));
    if (event.createdById) ids.add(event.createdById);
    ids.delete(input.attendeeId); // an organiser registering for their own event
    if (ids.size === 0) return;

    const who = attendee?.name || 'Someone';
    const action = input.needsApproval ? ' and is waiting for approval' : input.paymentToReview ? ' and sent a payment screenshot' : '';
    await sendToMany(prisma, fcmCfg, {
      userIds: [...ids],
      type: 'event_registration',
      message: {
        title: input.needsApproval || input.paymentToReview ? `Action needed: ${event.EventName}` : `New registration: ${event.EventName}`,
        body: `${who} registered${action}.`,
        // `route` is the app/inbox navigation contract (resolveNotificationRoute).
        data: { eventId: input.eventId, route: `/events/${input.eventId}?tab=manage` },
      },
      push: input.needsApproval || input.paymentToReview,
    });
  } catch (err: any) {
    logger.error('notifyOrganisersOfRegistration failed', { error: err.message, eventId: input.eventId });
  }
}

const EventSchema = z.object({
  eventName: z.string(), description: z.string().optional(), whatsappLink: z.string().optional(),
  form: z.string().optional(), link1: z.string().optional(), link2: z.string().optional(),
  link3: z.string().optional(), fees: z.string().optional(), paymentAmount: z.union([z.string(), z.number()]).optional(),
  image: z.string().optional(), contactPhone: z.string().optional(),
  isPaid: z.boolean().optional(), isPaidEvent: z.boolean().optional(),
  qrCodeUrl: z.string().optional(), paymentQRCode: z.string().optional(),
  tagline: z.string().optional(), applicationStartDate: z.string().optional(),
  applicationEndDate: z.string().optional(),
  maxParticipants: z.union([z.number(), z.string()]).optional().nullable(),
  coreTeamOnly: z.boolean().optional(),
  customQuestions: z.array(z.object({
    label: z.string().trim().min(1),
    type: z.enum(['text', 'url', 'select']),
    options: z.array(z.string()).optional(),
    required: z.boolean().optional(),
  }).refine((q) => q.type !== 'select' || q.options?.some((option) => option.trim()), {
    message: 'Dropdown questions need an option',
  })).max(10).optional(),
});

const eventSelectBase = {
  id: true, EventName: true, description: true, tagline: true, EventMode: true,
  EventType: true, EventUrl: true, Venue: true, TeamSize: true, clubName: true,
  clubId: true, prizes: true, startDate: true, endDate: true,
  applicationStartDate: true, applicationEndDate: true, university: true,
  collegeStudentsOnly: true, contactEmail: true, contactPhone: true,
  participationFee: true, posterUrl: true, createdAt: true,
  link1: true, link2: true, link3: true, whatsappLink: true,
  isPaid: true, qrCodeUrl: true, Fees: true, maxParticipants: true, acceptanceBased: true, coreTeamOnly: true, desiredSponsors: true,
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
      prisma.event.findMany(cached({
        take: limit, skip, orderBy: { createdAt: 'desc' as const },
        select: { ...eventSelectBase, attendees: { select: { user: { select: { name: true } } } } },
      }, { ttl: 60, tags: ['events'] })),
      prisma.event.count(cached({}, { ttl: 60, tags: ['events'] })),
    ]);
    // An empty page is a normal answer (no events yet / past the last page), not a 404.
    return c.json({ msg: response.length ? 'found' : 'No events found', response, totalPages: Math.ceil(totalData / limit) }, 200);
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
    const response = await prisma.event.findUnique(
      cached({ where: { id: eventId }, select: eventSelectBase }, { ttl: 60, tags: ['events'] }),
    );
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

  const rawCapacity = parsedData.data.maxParticipants;
  const capacity = rawCapacity == null || rawCapacity === '' ? null : Number(rawCapacity);
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) {
    return jsonError(c, requestId, 'Max participants must be a positive whole number', 400);
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
        Fees: String(parsedData.data.paymentAmount || parsedData.data.fees || 'none'),
        maxParticipants: capacity,
        acceptanceBased: !!body.acceptanceBased,
        coreTeamOnly: parsedData.data.coreTeamOnly ?? false,
        customQuestions: parsedData.data.customQuestions ? {
          create: parsedData.data.customQuestions.map((q, index) => ({
            label: q.label, type: q.type,
            options: q.type === 'select' ? (q.options || []).map((option) => option.trim()).filter(Boolean) : [], required: !!q.required, sortOrder: index,
          })),
        } : undefined,
        link1: parsedData.data.link1 ?? null, link2: parsedData.data.link2 ?? null, link3: parsedData.data.link3 ?? null,
        whatsappLink: parsedData.data.whatsappLink || '',
        isPaid: parsedData.data.isPaidEvent ?? parsedData.data.isPaid ?? false,
        qrCodeUrl: parsedData.data.paymentQRCode || parsedData.data.qrCodeUrl || null,
        createdById: userId,
      },
      select: { id: true },
    });
    if (parsedData.data.coreTeamOnly) {
      c.executionCtx.waitUntil(notifyCoreTeamOfEvent(prisma, getFcmCfg(c), { id: response.id, name: parsedData.data.eventName, clubId, creatorId: userId }));
    }
    return c.json({ msg: 'event created', id: response.id }, 201);
  } catch (err: any) {
    logger.error(`[${requestId}] createEvent error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /founder-event-count ──────────────────────────────────
// Number of events created by the caller's club (0 if not a club head/core member).

router.get('/founder-event-count', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { id: c.get('userId') }, select: { email: true } });
    if (!user) return c.json({ count: 0 }, 200);
    const club = await prisma.clubs.findFirst({
      where: {
        OR: [
          { founderEmail: { equals: user.email, mode: 'insensitive' } },
          { coremember1: { equals: user.email, mode: 'insensitive' } },
          { coremember2: { equals: user.email, mode: 'insensitive' } },
          { coremember3: { equals: user.email, mode: 'insensitive' } },
        ],
      },
      select: { id: true },
    });
    const count = club ? await prisma.event.count({ where: { clubId: club.id } }) : 0;
    return c.json({ count }, 200);
  } catch (err: any) {
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
  // No speakers yet is a normal state: 200 with an empty list (callers use `speakers || []`).
  return c.json({ msg: speakers.length ? 'speakers are there' : 'No speakers added for the event', speakers }, 200);
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
      select: { id: true, clubId: true, coreTeamOnly: true, maxParticipants: true, collegeStudentsOnly: true, university: true, customQuestions: true },
    });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);

    if (event.coreTeamOnly && !(await isEventClubCoreMember(prisma, event.clubId, userId))) {
      return jsonError(c, requestId, 'This event is restricted to the hosting club’s core team', 403);
    }

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

// ═══════════════════════════════════════════════════════════════
// Routes ported from the Express EventRouter (Cloud Run retirement)
// ═══════════════════════════════════════════════════════════════

// Surface payment amount under friendlier keys for responses.
const mapEventFees = <T extends { Fees?: string | null }>(event: T) => ({
  ...event,
  paymentAmount: event.Fees,
  fees: event.Fees,
});

const generatePassId = (): string => `Zynvo ${crypto.randomUUID()}`;

const readJson = async (c: any): Promise<any> => {
  try { return await c.req.json(); } catch { return {}; }
};

async function isEventClubCoreMember(prisma: any, clubId: string, userId: string): Promise<boolean> {
  const [user, club] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
    prisma.clubs.findUnique({ where: { id: clubId }, select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true } }),
  ]);
  const email = user?.email?.trim().toLowerCase();
  return !!email && !!club && [club.founderEmail, club.coremember1, club.coremember2, club.coremember3]
    .some((member: string | null) => member?.trim().toLowerCase() === email);
}

// Whether the user is the founder or a core member of the event's club.
const managesEventClub = async (prisma: any, eventId: string, userId: string) => {
  const [user, event] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { email: true } }),
    prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true, EventName: true } }),
  ]);
  if (!user || !event) return { user, event, allowed: false };
  const club = await prisma.clubs.findUnique({
    where: { id: event.clubId },
    select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
  });
  const allowed = !!club && [club.founderEmail, club.coremember1, club.coremember2, club.coremember3]
    .some((e: string | null) => e === user.email);
  return { user, event, allowed };
};

// ── POST /checkEventDates ─────────────────────────────────────

router.post('/checkEventDates', async (c) => {
  const requestId = generateRequestId();
  const { eventStartDate, eventEndDate, applicationStartDate, applicationEndDate } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const result: {
      isValid: boolean; errors: string[]; warnings: string[]; info: string[];
      sameDayEventsAllowed: boolean; existingEvents?: any[];
    } = { isValid: true, errors: [], warnings: [], info: [], sameDayEventsAllowed: true };

    const now = new Date();
    const startDate = eventStartDate ? new Date(eventStartDate) : null;
    const endDate = eventEndDate ? new Date(eventEndDate) : null;
    const appStartDate = applicationStartDate ? new Date(applicationStartDate) : null;
    const appEndDate = applicationEndDate ? new Date(applicationEndDate) : null;

    if (startDate && endDate) {
      if (startDate > endDate) {
        result.isValid = false;
        result.errors.push('Event start date must be before event end date');
      }
      if (startDate < now) result.warnings.push('Event start date is in the past');

      const s = startDate.toISOString();
      const e = endDate.toISOString();
      const existingEvents = await prisma.event.findMany({
        where: {
          OR: [
            { startDate: { lte: s }, endDate: { gte: s } },
            { startDate: { lte: e }, endDate: { gte: e } },
            { startDate: { gte: s }, endDate: { lte: e } },
          ],
        },
        select: { id: true, EventName: true, startDate: true, endDate: true, clubName: true, Venue: true },
        take: 10,
      });
      if (existingEvents.length > 0) {
        // Informational only: same-period events must not block submission.
        result.existingEvents = existingEvents;
        result.info.push(`${existingEvents.length} other event(s) exist during the same period. This does not prevent creating your event.`);
      }
    }

    if (appStartDate && appEndDate) {
      if (appStartDate > appEndDate) {
        result.isValid = false;
        result.errors.push('Application start date must be before application end date');
      }
      if (appEndDate < now) result.warnings.push('Application end date is in the past');
    }
    if (appStartDate && startDate && appStartDate >= startDate) {
      result.warnings.push('Application start date is on or after event start date');
    }
    if (appEndDate && startDate && appEndDate > startDate) {
      result.warnings.push('Application end date is after event start date');
    }

    return c.json({ msg: 'Event dates validated', ...result }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── GET /eventByClub/:id ──────────────────────────────────────

router.get('/eventByClub/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const clubId = c.req.param('id');
  const prisma = c.get('prisma');
  try {
    const events = await prisma.event.findMany({
      where: { clubId }, select: eventSelectBase, orderBy: { createdAt: 'desc' },
    });
    // A club with no events yet: 200 with an empty list.
    return c.json({ msg: events.length ? 'fetched' : 'no events yet', event: events.map(mapEventFees) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal Server error', 500, err);
  }
});

// ── GET /search ───────────────────────────────────────────────

router.get('/search', async (c) => {
  const requestId = generateRequestId();
  const q = (k: string) => c.req.query(k)?.trim();
  const term = (q('q') ?? q('name') ?? '').substring(0, 200);
  const eventType = q('eventType')?.substring(0, 100);
  const eventMode = q('eventMode')?.substring(0, 50);
  const university = (q('university') ?? q('college'))?.substring(0, 200);
  const isPaidRaw = q('isPaid')?.toLowerCase();
  const clubId = q('clubId');
  const upcomingRaw = q('upcoming')?.toLowerCase();

  const rawPage = parseInt(c.req.query('page') ?? '');
  const rawLimit = parseInt(c.req.query('limit') ?? '');
  const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
  const limit = Number.isNaN(rawLimit) ? 10 : Math.min(Math.max(rawLimit, 1), 50);
  const skip = (page - 1) * limit;

  const andFilters: any[] = [];
  if (term) {
    andFilters.push({
      OR: [
        { EventName: { contains: term, mode: 'insensitive' } },
        { tagline: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
        { clubName: { contains: term, mode: 'insensitive' } },
      ],
    });
  }
  if (eventType) andFilters.push({ EventType: { equals: eventType, mode: 'insensitive' } });
  if (eventMode) andFilters.push({ EventMode: { equals: eventMode, mode: 'insensitive' } });
  if (university) andFilters.push({ university: { contains: university, mode: 'insensitive' } });
  if (clubId) andFilters.push({ clubId: { equals: clubId } });
  if (isPaidRaw === 'true' || isPaidRaw === 'false') andFilters.push({ isPaid: isPaidRaw === 'true' });
  if (upcomingRaw === 'true') {
    andFilters.push({ startDate: { gte: new Date().toISOString().substring(0, 10) } });
  }
  const where = andFilters.length > 0 ? { AND: andFilters } : {};

  const prisma = c.get('prisma');
  try {
    const [events, total] = await Promise.all([
      prisma.event.findMany({ where, take: limit, skip, orderBy: { createdAt: 'desc' }, select: eventSelectBase }),
      prisma.event.count({ where }),
    ]);
    return c.json({
      msg: 'search completed', response: events.map(mapEventFees),
      total, page, totalPages: Math.ceil(total / limit),
    }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /registerEvent ───────────────────────────────────────

router.post('/registerEvent', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const { eventId, paymentScreenshotUrl, paymentProofUrl, customAnswers } = await readJson(c);
  const paymentScreenshot = paymentScreenshotUrl ?? paymentProofUrl;
  if (!eventId) return jsonError(c, requestId, 'Event ID is required', 400);
  const prisma = c.get('prisma');

  try {
    const alreadyRegistered = await prisma.userEvents.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (alreadyRegistered) return jsonError(c, requestId, 'already registered bro', 402);

    const event = await prisma.event.findUnique({
      where: { id: eventId },
      select: {
        isPaid: true, clubId: true, coreTeamOnly: true, collegeStudentsOnly: true, university: true, maxParticipants: true,
        _count: { select: { attendees: true } },
        acceptanceBased: true, applicationStatus: true, applicationEndDate: true,
        customQuestions: { where: { required: true }, select: { id: true, label: true } },
      },
    });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);

    if (event.coreTeamOnly && !(await isEventClubCoreMember(prisma, event.clubId, userId))) {
      return jsonError(c, requestId, 'This event is restricted to the hosting club’s core team', 403);
    }

    if (event.applicationStatus && event.applicationStatus.toLowerCase() !== 'open') {
      return jsonError(c, requestId, 'Registration is closed for this event', 400);
    }
    if (event.applicationEndDate) {
      const deadline = new Date(event.applicationEndDate);
      if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) {
        return jsonError(c, requestId, 'Registration is closed for this event', 400);
      }
    }

    const answers: any[] = Array.isArray(customAnswers) ? customAnswers : [];
    if (event.customQuestions.length > 0) {
      const answeredIds = new Set(
        answers
          .filter((a) => a && a.answer !== undefined && a.answer !== null && String(a.answer).trim() !== '')
          .map((a) => a.questionId),
      );
      const missing = event.customQuestions.filter((q) => !answeredIds.has(q.id));
      if (missing.length > 0) {
        return jsonError(c, requestId, `Please answer all required questions: ${missing.map((q) => q.label).join(', ')}`, 400);
      }
    }

    if (event.maxParticipants !== null && event.maxParticipants !== undefined && event._count.attendees >= event.maxParticipants) {
      return jsonError(c, requestId, 'Participation limit reached for this event', 400);
    }

    if (event.collegeStudentsOnly) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } });
      if (!user) return jsonError(c, requestId, 'User not found', 404);
      if (!sameCollege(event.university, user.collegeName)) {
        return jsonError(c, requestId, 'This event is restricted to students of the organizer college', 403);
      }
    }

    if (event.isPaid && !paymentScreenshot) {
      return jsonError(c, requestId, 'Payment screenshot is required for paid events', 400);
    }

    const paymentStatus = event.isPaid ? (paymentScreenshot ? 'CONFIRMED' : 'PENDING') : 'CONFIRMED';
    const saveAnswers = async () => {
      if (answers.length === 0) return;
      await prisma.registrationAnswer.createMany({
        data: answers.map((ans) => ({ questionId: ans.questionId, userId, eventId, answer: ans.answer })),
        skipDuplicates: true,
      });
    };

    // Acceptance-based events: register as pending and queue for organiser approval.
    if (event.acceptanceBased) {
      const response = await prisma.userEvents.create({
        data: {
          userId, eventId, uniquePassId: generatePassId(),
          paymentScreenshotUrl: paymentScreenshot || null, paymentStatus, approvalStatus: 'pending',
        },
        select: { uniquePassId: true, paymentStatus: true },
      });
      await saveAnswers();
      await prisma.eventQueue.create({ data: { eventId, userId } });
      c.executionCtx.waitUntil(notifyOrganisersOfRegistration(prisma, getFcmCfg(c), {
        eventId, attendeeId: userId, needsApproval: true, paymentToReview: Boolean(event.isPaid && paymentScreenshot),
      }));
      return c.json({
        msg: 'registered successfully , waiting for approval',
        ForkedUpId: response.uniquePassId,
        paymentStatus: response.paymentStatus,
        requiresPaymentVerification: event.isPaid,
        approvalStatus: 'pending',
      }, 200);
    }

    // Re-count inside a transaction so concurrent registrations can't exceed maxParticipants.
    let response;
    try {
      response = await prisma.$transaction(async (tx: any) => {
        if (event.maxParticipants !== null && event.maxParticipants !== undefined) {
          const currentCount = await tx.userEvents.count({ where: { eventId } });
          if (currentCount >= event.maxParticipants) throw new Error('PARTICIPATION_LIMIT_REACHED');
        }
        return tx.userEvents.create({
          data: { userId, eventId, uniquePassId: generatePassId(), paymentScreenshotUrl: paymentScreenshot || null, paymentStatus },
          select: { uniquePassId: true, paymentStatus: true },
        });
      });
    } catch (txErr: any) {
      if (txErr.message === 'PARTICIPATION_LIMIT_REACHED') {
        return jsonError(c, requestId, 'Participation limit reached for this event', 400);
      }
      throw txErr;
    }
    await saveAnswers();
    c.executionCtx.waitUntil(notifyOrganisersOfRegistration(prisma, getFcmCfg(c), {
      eventId, attendeeId: userId, needsApproval: false, paymentToReview: Boolean(event.isPaid && paymentScreenshot),
    }));

    return c.json({
      msg: 'registered successfully',
      ForkedUpId: response.uniquePassId,
      paymentStatus: response.paymentStatus,
      requiresPaymentVerification: event.isPaid,
      approvalStatus: 'confirmed',
    }, 200);
  } catch (err: any) {
    if (err?.code === 'P2002') return jsonError(c, requestId, 'you are already registered for this event', 409);
    logger.error(`[${requestId}] registerEvent error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── POST /addSpeakers ─────────────────────────────────────────

router.post('/addSpeakers', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const { profilePic, about, name, email, eventId } = await readJson(c);
  if (!eventId) return jsonError(c, requestId, 'Event ID is required', 400);
  const prisma = c.get('prisma');
  try {
    const speaker = await prisma.speakers.create({
      data: { profilePic: profilePic || '', about, name, email, eventId },
      select: { id: true },
    });
    return c.json({ msg: 'Speaker added', id: speaker.id }, 200);
  } catch (err: any) {
    // speakers.email has a global unique constraint
    if (err.code === 'P2002') return jsonError(c, requestId, 'A speaker with this email already exists', 409);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /ver-event ────────────────────────────────────────────

router.get('/ver-event', async (c) => {
  const requestId = generateRequestId();
  const id = c.req.query('id') ?? '';
  if (!id.startsWith('Z')) return c.json({ status: 'invalid' }, 400);
  const prisma = c.get('prisma');
  try {
    const found = await prisma.userEvents.findFirst({ where: { uniquePassId: id }, select: { uniquePassId: true } });
    return found ? c.json({ status: 'registered' }, 200) : c.json({ status: 'unregistered' }, 404);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /event-details ────────────────────────────────────────

router.get('/event-details', async (c) => {
  const requestId = generateRequestId();
  const id = c.req.query('id') ?? '';
  if (!id.startsWith('Z')) return c.json({ status: 'invalid' }, 400);
  const prisma = c.get('prisma');
  try {
    const found = await prisma.userEvents.findFirst({
      where: { uniquePassId: id },
      select: {
        event: {
          select: {
            EventName: true, clubName: true, club: { select: { collegeName: true } },
            startDate: true, Venue: true, posterUrl: true,
          },
        },
        user: { select: { profileAvatar: true } },
        approvalStatus: true,
      },
    });
    if (!found) return c.json({ data: {} }, 404);
    return c.json({
      data: {
        eventName: found.event.EventName,
        clubName: found.event.clubName,
        collegeName: found.event.club.collegeName,
        startDate: found.event.startDate,
        profilePic: found.user.profileAvatar,
        approvalStatus: found.approvalStatus,
        venue: found.event.Venue,
        posterUrl: found.event.posterUrl,
      },
    }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /user-details ─────────────────────────────────────────

router.get('/user-details', async (c) => {
  const requestId = generateRequestId();
  // c.req.query already URL-decodes; trim whitespace only
  const id = (c.req.query('id') ?? '').trim();
  if (!id) return c.json({ status: 'error', message: 'Pass ID is required', requestId }, 400);
  if (!id.startsWith('Z')) return c.json({ status: 'invalid', message: 'Invalid pass ID format', requestId }, 400);

  const prisma = c.get('prisma');
  try {
    const registration = await prisma.userEvents.findFirst({
      where: { uniquePassId: { equals: id, mode: 'insensitive' } },
      select: {
        uniquePassId: true, joinedAt: true, paymentStatus: true,
        event: { select: { EventName: true } },
        user: {
          select: {
            id: true, name: true, email: true, collegeName: true,
            course: true, year: true, profileAvatar: true,
          },
        },
      },
    });
    if (!registration) {
      return c.json({ status: 'error', message: 'Registration not found', data: {}, requestId }, 404);
    }
    return c.json({
      status: 'success',
      data: {
        passId: registration.uniquePassId,
        eventName: registration.event?.EventName ?? '',
        joinedAt: registration.joinedAt,
        paymentStatus: registration.paymentStatus,
        user: registration.user,
      },
      requestId,
    }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── Announcements ─────────────────────────────────────────────
// The frontend sends the announcement id as ?id=; Express read ?annId=. Accept both.

const annIdFrom = (c: any): string => String(c.req.query('annId') || c.req.query('id') || '');

router.get('/getAnn/:eventId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) return c.json({ msg: 'no event found' }, 404);
    const data = await prisma.eventAnnouncement.findMany({ where: { eventId }, orderBy: { createdAt: 'desc' } });
    return c.json({ msg: 'announcements fetched', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

router.post('/announcement/:eventId', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const { Title, Description } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const data = await prisma.eventAnnouncement.create({ data: { Title, Description, eventId } });
    return c.json({ msg: 'Announcement published', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

router.put('/announcement/:eventId', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const annId = annIdFrom(c);
  if (!annId) return c.json({ msg: 'announcement id (annId) required in query' }, 400);
  const { Title, Description } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const ann = await prisma.eventAnnouncement.findUnique({ where: { id: annId } });
    if (!ann || ann.eventId !== eventId) return c.json({ msg: 'announcement not found for this event' }, 404);
    const data = await prisma.eventAnnouncement.update({
      where: { id: annId },
      data: { Title: Title ?? ann.Title, Description: Description ?? ann.Description },
    });
    return c.json({ msg: 'announcement updated', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

router.delete('/announcement/:eventId', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const annId = annIdFrom(c);
  if (!annId) return c.json({ msg: 'announcement id (annId) required in query' }, 400);
  const prisma = c.get('prisma');
  try {
    const ann = await prisma.eventAnnouncement.findUnique({ where: { id: annId } });
    if (!ann || ann.eventId !== eventId) return c.json({ msg: 'announcement not found for this event' }, 404);
    await prisma.eventAnnouncement.delete({ where: { id: annId } });
    return c.json({ msg: 'announcement deleted' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── Gallery ───────────────────────────────────────────────────

router.get('/:eventId/gallery', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);
    const data = await prisma.eventGallery.findMany({ where: { eventId }, orderBy: { createdAt: 'desc' } });
    return c.json({ msg: 'Gallery fetched successfully', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.post('/:eventId/gallery', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const { imageUrl, caption } = await readJson(c);
  if (!imageUrl) return jsonError(c, requestId, 'Image URL is required', 400);
  const prisma = c.get('prisma');
  try {
    const data = await prisma.eventGallery.create({ data: { imageUrl, caption: caption || '', eventId } });
    return c.json({ msg: 'Image added to gallery', data }, 201);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.put('/:eventId/gallery', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const galleryId = c.req.query('galleryId');
  if (!galleryId) return jsonError(c, requestId, 'Gallery ID is required in query parameters', 400);
  const { imageUrl, caption } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.eventGallery.findFirst({ where: { id: galleryId, eventId } });
    if (!existing) return jsonError(c, requestId, 'Gallery item not found for this event', 404);
    const data = await prisma.eventGallery.update({
      where: { id: galleryId },
      data: {
        imageUrl: imageUrl ?? existing.imageUrl,
        caption: caption !== undefined ? caption : existing.caption,
      },
    });
    return c.json({ msg: 'Gallery item updated', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.delete('/:eventId/gallery', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const galleryId = c.req.query('galleryId');
  if (!galleryId) return jsonError(c, requestId, 'Gallery ID is required in query parameters', 400);
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.eventGallery.findFirst({ where: { id: galleryId, eventId } });
    if (!existing) return jsonError(c, requestId, 'Gallery item not found for this event', 404);
    await prisma.eventGallery.delete({ where: { id: galleryId } });
    return c.json({ msg: 'Gallery item deleted successfully' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── Judges ────────────────────────────────────────────────────

router.get('/:eventId/judges', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true } });
    if (!event) return jsonError(c, requestId, 'Event not found', 404);
    const data = await prisma.judges.findMany({ where: { eventId }, orderBy: { createdAt: 'desc' } });
    return c.json({ msg: 'Judges fetched successfully', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.post('/:eventId/judges', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const { name, description, achievement } = await readJson(c);
  if (!name || !description || !achievement) {
    return jsonError(c, requestId, 'Name, description, and achievement are required', 400);
  }
  const prisma = c.get('prisma');
  try {
    const data = await prisma.judges.create({ data: { name, description, achievement, eventId } });
    return c.json({ msg: 'Judge added successfully', data }, 201);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.put('/:eventId/judges/:judgeId', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const judgeId = c.req.param('judgeId');
  const { name, description, achievement } = await readJson(c);
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.judges.findFirst({ where: { id: judgeId, eventId } });
    if (!existing) return jsonError(c, requestId, 'Judge not found for this event', 404);
    const data = await prisma.judges.update({
      where: { id: judgeId },
      data: {
        name: name ?? existing.name,
        description: description ?? existing.description,
        achievement: achievement ?? existing.achievement,
      },
    });
    return c.json({ msg: 'Judge updated successfully', data }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

router.delete('/:eventId/judges/:judgeId', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const judgeId = c.req.param('judgeId');
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.judges.findFirst({ where: { id: judgeId, eventId } });
    if (!existing) return jsonError(c, requestId, 'Judge not found for this event', 404);
    await prisma.judges.delete({ where: { id: judgeId } });
    return c.json({ msg: 'Judge deleted successfully' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error', 500, err);
  }
});

// ── PUT /event/:id ────────────────────────────────────────────

const UPDATABLE_EVENT_FIELDS = [
  'EventName', 'description', 'tagline', 'EventMode', 'EventType',
  'EventUrl', 'Venue', 'TeamSize', 'prizes', 'startDate', 'endDate',
  'applicationStartDate', 'applicationEndDate', 'collegeStudentsOnly',
  'contactEmail', 'contactPhone', 'participationFee', 'posterUrl',
  'link1', 'link2', 'link3', 'whatsappLink', 'qrCodeUrl', 'maxParticipants',
  'eventHeaderImage', 'Form', 'Fees', 'desiredSponsors', 'acceptanceBased', 'isPaid', 'coreTeamOnly',
];

router.put('/event/:id', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const body = await readJson(c);
  if ('coreTeamOnly' in body && typeof body.coreTeamOnly !== 'boolean') {
    return jsonError(c, requestId, 'coreTeamOnly must be a boolean', 400);
  }
  const updateData: Record<string, any> = {};
  for (const field of UPDATABLE_EVENT_FIELDS) {
    if (field in body) updateData[field] = body[field];
  }
  // The website edit form sends the same date names used for creation.
  if ('eventStartDate' in body && !('startDate' in body)) updateData.startDate = body.eventStartDate;
  if ('eventEndDate' in body && !('endDate' in body)) updateData.endDate = body.eventEndDate;
  if (Object.keys(updateData).length === 0 && !('customQuestions' in body)) {
    return c.json({ msg: 'No valid fields provided for update' }, 400);
  }
  if (Array.isArray(body.customQuestions)) {
    updateData.customQuestions = {
      deleteMany: {},
      create: body.customQuestions.map((q: any) => ({
        label: q.label, type: q.type || 'text', options: q.options || [],
        required: q.required || false, sortOrder: q.sortOrder || 0,
      })),
    };
  }
  const prisma = c.get('prisma');
  try {
    const previous = await prisma.event.findUnique({ where: { id: eventId }, select: { startDate: true, endDate: true, Venue: true, EventMode: true, coreTeamOnly: true, collegeStudentsOnly: true, acceptanceBased: true } });
    if (!previous) return c.json({ msg: 'Event not found' }, 404);
    const updated = await prisma.event.update({ where: { id: eventId }, data: updateData, select: eventSelectBase });
    const changed = [
      (previous.startDate !== updated.startDate || previous.endDate !== updated.endDate) && 'date',
      (previous.Venue !== updated.Venue || previous.EventMode !== updated.EventMode) && 'venue or mode',
      (previous.coreTeamOnly !== updated.coreTeamOnly || previous.collegeStudentsOnly !== updated.collegeStudentsOnly || previous.acceptanceBased !== updated.acceptanceBased) && 'registration access',
    ].filter((value): value is string => !!value);
    if (changed.length) c.executionCtx.waitUntil(notifyEventChanges(prisma, getFcmCfg(c), eventId, updated.EventName, changed));
    return c.json({ msg: 'Event updated successfully', response: mapEventFees(updated) }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] updateEvent error`, { error: err.message });
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

// ── DELETE /event/:id ─────────────────────────────────────────

router.delete('/event/:id', authMiddleware, specificClubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');
  const prisma = c.get('prisma');
  try {
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
    return c.json({ msg: 'Event deleted successfully' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] deleteEvent error`, { error: err.message });
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

// ── Event queue (acceptance-based registrations) ──────────────

router.get('/eventQueue/:eventId', authMiddleware, async (c) => {
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const { user, event, allowed } = await managesEventClub(prisma, eventId, c.get('userId'));
    if (!user) return c.json({ msg: 'User not found' }, 404);
    if (!event) return c.json({ msg: 'Event not found' }, 404);
    if (!allowed) {
      return c.json({ msg: 'Access denied. Only club heads or core members can view the event queue' }, 403);
    }

    const queueEntries = await prisma.eventQueue.findMany({ where: { eventId }, orderBy: { createdAt: 'asc' } });
    const userIds = queueEntries.map((q) => q.userId);
    const [registrationAnswers, registrationInfo] = await Promise.all([
      prisma.registrationAnswer.findMany({
        where: { eventId, userId: { in: userIds } },
        select: { question: true, answer: true, userId: true },
      }),
      prisma.userEvents.findMany({
        where: { eventId, userId: { in: userIds } },
        select: {
          userId: true, uniquePassId: true, paymentStatus: true, paymentScreenshotUrl: true,
          paymentVerifiedAt: true, joinedAt: true,
          user: { select: { name: true, email: true, collegeName: true } },
        },
      }),
    ]);

    const queue = queueEntries.map((entry) => ({
      ...entry,
      registration: registrationInfo.find((r) => r.userId === entry.userId),
      registrationAnswers: registrationAnswers.filter((a) => a.userId === entry.userId),
    }));
    return c.json({ msg: 'Event queue fetched successfully', total: queueEntries.length, queue }, 200);
  } catch (err: any) {
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

router.put('/eventQueue/:eventId/approve', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const { userId, accepted } = await readJson(c);
  if (!userId) return c.json({ msg: 'User ID is required' }, 400);
  if (typeof accepted !== 'boolean') return c.json({ msg: 'A valid approval decision is required' }, 400);
  const prisma = c.get('prisma');
  try {
    // Express had no ownership check here; only the event's club managers may approve.
    const { event, allowed } = await managesEventClub(prisma, eventId, c.get('userId'));
    if (!event) return c.json({ msg: 'Event not found' }, 404);
    if (!allowed) return c.json({ msg: 'Access denied. Only club heads or core members can approve registrations' }, 403);

    const decision = await prisma.userEvents.updateMany({
      where: { eventId, userId, approvalStatus: 'pending' },
      data: { approvalStatus: accepted ? 'approved' : 'rejected' },
    });
    if (!decision.count) return c.json({ msg: 'No pending registration found' }, 404);
    await prisma.eventQueue.deleteMany({ where: { eventId, userId } });
    c.executionCtx.waitUntil(notifyEventDecision(prisma, getFcmCfg(c), eventId, event.EventName, userId, accepted));
    return c.json({ msg: 'User accepted successfully' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] approve queue error`, { error: err.message });
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

// ── GET /participants/:eventId — attendee list (JSON or ?format=csv) ──
// Ported from Express eventAttendees; same response shapes.

const csvCell = (v: unknown): string => {
  if (v == null) return '';
  const s = String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

// Filters shared by the attendee list, its CSV and its email export:
//   q=         name, email, college, course, pass ID or any registration answer
//   checkedIn= yes | no
//   payment=   CONFIRMED | PENDING | REJECTED   (rows with no status count as CONFIRMED)
//   approval=  pending | approved | rejected    (acceptance-based events)
type AttendeeFilters = { where: any; filtered: boolean; key: string };

const PAYMENT_FILTERS = ['CONFIRMED', 'PENDING', 'REJECTED'];
const APPROVAL_FILTERS = ['pending', 'approved', 'rejected'];

async function attendeeFilters(prisma: any, eventId: string, query: (k: string) => string | undefined): Promise<AttendeeFilters> {
  const q = (query('q') ?? '').trim().slice(0, 100);
  const checkedIn = (query('checkedIn') ?? '').toLowerCase();
  const payment = (query('payment') ?? '').toUpperCase();
  const approval = (query('approval') ?? '').toLowerCase();

  const and: any[] = [];
  if (q) {
    const contains = { contains: q, mode: 'insensitive' as const };
    const answerMatches = await prisma.registrationAnswer.findMany({
      where: { eventId, answer: contains },
      select: { userId: true },
      distinct: ['userId'],
      take: 1000,
    });
    and.push({
      OR: [
        { user: { name: contains } },
        { user: { email: contains } },
        { user: { collegeName: contains } },
        { user: { course: contains } },
        { uniquePassId: contains },
        ...(answerMatches.length ? [{ userId: { in: answerMatches.map((a: any) => a.userId) } }] : []),
      ],
    });
  }
  if (checkedIn === 'yes') and.push({ checkedInAt: { not: null } });
  if (checkedIn === 'no') and.push({ checkedInAt: null });
  if (PAYMENT_FILTERS.includes(payment)) {
    and.push(payment === 'CONFIRMED'
      ? { OR: [{ paymentStatus: 'CONFIRMED' }, { paymentStatus: null }] }
      : { paymentStatus: payment });
  }
  if (APPROVAL_FILTERS.includes(approval)) and.push({ approvalStatus: approval });

  const key = [q, checkedIn === 'yes' || checkedIn === 'no' ? checkedIn : '', PAYMENT_FILTERS.includes(payment) ? payment : '', APPROVAL_FILTERS.includes(approval) ? approval : ''].join('|');
  return { where: and.length ? { eventId, AND: and } : { eventId }, filtered: and.length > 0, key };
}

router.get('/participants/:eventId', authMiddleware, adminCoreAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { id: true, isPaid: true } });
    if (!event) return c.json({ message: 'Event not found' }, 404);
    // Payment columns/fields only mean something for paid events.
    const isPaid = Boolean(event.isPaid);
    const { where, filtered, key } = await attendeeFilters(prisma, eventId, (k) => c.req.query(k));
    const format = c.req.query('format');

    if (format === 'emails') {
      // For "Email all": every matching attendee's address, not one page.
      const rows = await prisma.userEvents.findMany({
        where, orderBy: { joinedAt: 'desc' }, take: 5000,
        select: { user: { select: { email: true } } },
      });
      const emails = [...new Set(rows.map((r: any) => r.user?.email).filter(Boolean))];
      return c.json({ emails, total: emails.length }, 200);
    }

    const customQuestions = await prisma.eventCustomQuestion.findMany({
      where: { eventId },
      orderBy: { sortOrder: 'asc' },
    });

    if (format === 'csv') {
      const sinceParam = c.req.query('since');
      let since: Date | null = null;
      if (sinceParam) {
        since = new Date(sinceParam);
        if (Number.isNaN(since.getTime())) return c.json({ message: 'Invalid since timestamp' }, 400);
      }

      const [latest, total] = await Promise.all([
        prisma.userEvents.findFirst({ where, orderBy: { joinedAt: 'desc' }, select: { joinedAt: true } }),
        prisma.userEvents.count({ where }),
      ]);
      // Columns depend on isPaid and rows on the filters, so both are part of
      // the ETag: a cached CSV with other columns/rows must not be served.
      const etag = `${latest ? `${total}-${latest.joinedAt.getTime()}` : `0-${total}`}-${isPaid ? 'p' : 'f'}${filtered ? `-${key}` : ''}`;
      if (c.req.header('if-none-match') === etag) {
        return new Response(null, { status: 304, headers: { ETag: etag, 'Cache-Control': 'no-cache' } });
      }

      const rows = await prisma.userEvents.findMany({
        where: since ? { AND: [where, { joinedAt: { gt: since } }] } : where,
        orderBy: { joinedAt: 'desc' },
        select: {
          joinedAt: true, uniquePassId: true, paymentStatus: true, paymentScreenshotUrl: true, checkedInAt: true,
          user: { select: { id: true, name: true, email: true, collegeName: true } },
        },
      });
      const answers = await prisma.registrationAnswer.findMany({
        where: { eventId, userId: { in: rows.map((r: any) => r.user.id).filter(Boolean) } },
      });
      const byUser: Record<string, Record<string, string>> = {};
      for (const a of answers) (byUser[a.userId] ??= {})[a.questionId] = a.answer;

      const header = [
        'User ID', 'Name', 'Email', 'College', 'Joined At', 'Pass ID',
        ...(isPaid ? ['Payment Status', 'Payment Screenshot URL'] : []),
        'Checked In At',
        ...customQuestions.map((q: any) => q.label),
      ];
      const lines = [header.map(csvCell).join(',')];
      for (const r of rows as any[]) {
        const u = r.user;
        const ua = (u.id && byUser[u.id]) || {};
        lines.push([
          u.id ?? '', u.name ?? '', u.email ?? '', u.collegeName ?? '', r.joinedAt.toISOString(),
          r.uniquePassId ?? '',
          ...(isPaid ? [r.paymentStatus ?? 'CONFIRMED', r.paymentScreenshotUrl ?? ''] : []),
          r.checkedInAt ? r.checkedInAt.toISOString() : '',
          ...customQuestions.map((q: any) => ua[q.id] || ''),
        ].map(csvCell).join(','));
      }
      return new Response('﻿' + lines.join('\n') + '\n', {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="participants_${eventId}.csv"`,
          ETag: etag,
          'Cache-Control': 'no-cache',
        },
      });
    }

    const page = Math.max(parseInt(c.req.query('page') ?? '1') || 1, 1);
    const limit = Math.min(Math.max(parseInt(c.req.query('limit') ?? '50') || 50, 1), 100);

    const [participants, total, totalAll] = await Promise.all([
      prisma.userEvents.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { joinedAt: 'desc' },
        select: {
          joinedAt: true, uniquePassId: true, checkedInAt: true, approvalStatus: true,
          ...(isPaid ? { paymentStatus: true, paymentScreenshotUrl: true } : {}),
          user: { select: { id: true, name: true, email: true, collegeName: true, course: true, year: true } },
        },
      }),
      prisma.userEvents.count({ where }),
      filtered ? prisma.userEvents.count({ where: { eventId } }) : Promise.resolve(null),
    ]);
    const answers = await prisma.registrationAnswer.findMany({
      where: { eventId, userId: { in: participants.map((p: any) => p.user?.id).filter(Boolean) } },
      include: { question: { select: { label: true } } },
    });
    const answersByUser: Record<string, { label: string; answer: string }[]> = {};
    for (const a of answers as any[]) (answersByUser[a.userId] ??= []).push({ label: a.question.label, answer: a.answer });

    return c.json({
      msg: 'participants fetched',
      data: participants.map((p: any) => ({
        joinedAt: p.joinedAt,
        passId: p.uniquePassId,
        checkedInAt: p.checkedInAt,
        approvalStatus: p.approvalStatus ?? null,
        ...(isPaid ? { paymentStatus: p.paymentStatus ?? 'CONFIRMED', paymentScreenshotUrl: p.paymentScreenshotUrl ?? null } : {}),
        user: p.user,
        customAnswers: (p.user?.id && answersByUser[p.user.id]) || [],
      })),
      // Event-level info so clients can match the CSV's columns on every
      // page: payment columns only for paid events, and every custom
      // question in its configured order.
      isPaid,
      questions: customQuestions.map((qq: any) => qq.label),
      pagination: {
        page, limit, total, totalPages: Math.ceil(total / limit),
        totalAll: totalAll ?? total,
      },
    }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] participants error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── Schedule ──────────────────────────────────────────────────
// Ported from Express. Managing sessions is open to the club's founder/core
// members and the event's creator.

const canManageSchedule = async (prisma: any, eventId: string, userId: string) => {
  const { event, allowed } = await managesEventClub(prisma, eventId, userId);
  if (!event) return { status: 404 as const, msg: 'Event not found' };
  if (allowed) return null;
  const creator = await prisma.event.findUnique({ where: { id: eventId }, select: { createdById: true } });
  if (creator?.createdById === userId) return null;
  return { status: 403 as const, msg: 'Access denied. Only club heads, core members, or event creators can manage this event.' };
};

router.get('/schedule/:eventId', async (c) => {
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const days = await prisma.scheduleDay.findMany(cached({
      where: { eventId },
      include: { sessions: true },
      orderBy: { day: 'asc' as const },
    }, { ttl: 60, tags: ['events'] }));
    if (days.length === 0) {
      return c.json({ response: [{ id: 'default-day-1', day: 1, date: 'Day 1', name: 'Day 1', sessions: [] }] }, 200);
    }
    return c.json({ response: days }, 200);
  } catch {
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

router.post('/schedule/:eventId/session', authMiddleware, async (c) => {
  const eventId = c.req.param('eventId');
  const body = await readJson(c);
  const { day, time, title, description, location, speakers } = body ?? {};

  const dayNum = Number(day);
  if (!Number.isInteger(dayNum) || dayNum < 1) return c.json({ msg: 'day must be a positive integer' }, 400);
  if (!time || !title || !location) return c.json({ msg: 'time, title and location are required' }, 400);

  const prisma = c.get('prisma');
  try {
    const denied = await canManageSchedule(prisma, eventId, c.get('userId'));
    if (denied) return c.json({ msg: denied.msg }, denied.status);

    const scheduleDay = await prisma.scheduleDay.upsert({
      where: { eventId_day: { eventId, day: dayNum } },
      create: { eventId, day: dayNum, date: `Day ${dayNum}`, name: `Day ${dayNum}` },
      update: {},
    });
    const session = await prisma.scheduleSession.create({
      data: {
        scheduleDayId: scheduleDay.id,
        time, title, location,
        description: description || '',
        speakers: speakers || [],
      },
    });
    return c.json({ msg: 'Session added', response: session }, 201);
  } catch {
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

router.delete('/schedule/:eventId/session/:sessionId', authMiddleware, async (c) => {
  const eventId = c.req.param('eventId');
  const sessionId = c.req.param('sessionId');
  const prisma = c.get('prisma');
  try {
    const denied = await canManageSchedule(prisma, eventId, c.get('userId'));
    if (denied) return c.json({ msg: denied.msg }, denied.status);

    // Only delete sessions that belong to this event's schedule.
    const { count } = await prisma.scheduleSession.deleteMany({
      where: { id: sessionId, scheduleDay: { eventId } },
    });
    if (count === 0) return c.json({ msg: 'Session not found' }, 404);
    return c.json({ msg: 'Session deleted' }, 200);
  } catch {
    return c.json({ msg: 'Internal server error' }, 500);
  }
});

// ── GET /friends-going?ids=a,b,c ──────────────────────────────
// Per event: total registrations plus up to 5 people the caller follows who
// registered. Batched so event lists need one request.

router.get('/friends-going', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const ids = [...new Set((c.req.query('ids') ?? '').split(',').map((s) => s.trim()).filter(Boolean))].slice(0, 50);
  if (ids.length === 0) return c.json({ events: {} }, 200);

  const prisma = c.get('prisma');
  try {
    const follows = await prisma.follow.findMany({ where: { followerId: c.get('userId') }, select: { followingId: true } });
    const followingIds = follows.map((f) => f.followingId);
    const [friendRows, totals] = await Promise.all([
      followingIds.length === 0
        ? Promise.resolve([])
        : prisma.userEvents.findMany({
          where: { eventId: { in: ids }, userId: { in: followingIds } },
          orderBy: { joinedAt: 'desc' },
          select: { eventId: true, user: { select: { id: true, name: true, profileAvatar: true } } },
        }),
      prisma.userEvents.groupBy({ by: ['eventId'], where: { eventId: { in: ids } }, _count: { _all: true } }),
    ]);

    type Friend = { id: string; name: string | null; profileAvatar: string | null };
    const events: Record<string, { total: number; friendsCount: number; friends: Friend[] }> = {};
    for (const id of ids) events[id] = { total: 0, friendsCount: 0, friends: [] };
    for (const t of totals) events[t.eventId].total = t._count._all;
    for (const r of friendRows as { eventId: string; user: Friend }[]) {
      const e = events[r.eventId];
      e.friendsCount++;
      if (e.friends.length < 5) e.friends.push(r.user);
    }
    return c.json({ events }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] friends-going error`, { error: err.message });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── QR check-in ───────────────────────────────────────────────
// Organisers (club founder/core members, event creator) scan a pass QR.
// QRs encode .../verify-event/<passId> (app) or .../verify-pass/<passId>
// (web); a bare pass id is accepted too.

const passIdFromScan = (raw: string): string => {
  const value = raw.trim();
  const last = value.includes('/') ? value.split('?')[0].replace(/\/+$/, '').split('/').pop() ?? '' : value;
  try { return decodeURIComponent(last); } catch { return last; }
};

type CheckInResult = {
  httpStatus: 200 | 400 | 404 | 409;
  body: { status: string; msg: string; checkedInAt?: Date | null; attendee?: unknown };
};

/**
 * One pass, the same rules for a live scan, a manual check-in from the
 * attendee list, and an offline scan synced later. `at` is when the scan
 * happened (offline scans); it defaults to now.
 */
async function checkInPass(prisma: any, eventId: string, passId: string, byUserId: string, at?: Date): Promise<CheckInResult> {
  const reg = await prisma.userEvents.findFirst({
    where: { eventId, uniquePassId: passId },
    select: {
      userId: true, checkedInAt: true, approvalStatus: true, paymentStatus: true,
      user: { select: { id: true, name: true, profileAvatar: true, collegeName: true } },
    },
  });
  if (!reg) return { httpStatus: 404, body: { status: 'invalid', msg: 'This pass is not for this event.' } };
  if (reg.approvalStatus !== 'approved') {
    return { httpStatus: 409, body: { status: 'not_approved', msg: 'This registration has not been approved.', attendee: reg.user } };
  }
  if (['PENDING', 'REJECTED'].includes(String(reg.paymentStatus).toUpperCase())) {
    return { httpStatus: 409, body: { status: 'payment_pending', msg: 'Payment for this pass is not confirmed.', attendee: reg.user } };
  }
  if (reg.checkedInAt) {
    return { httpStatus: 200, body: { status: 'already', msg: 'Already checked in.', checkedInAt: reg.checkedInAt, attendee: reg.user } };
  }
  const updated = await prisma.userEvents.update({
    where: { userId_eventId: { userId: reg.userId, eventId } },
    data: { checkedInAt: at ?? new Date(), checkedInById: byUserId },
    select: { checkedInAt: true },
  });
  return { httpStatus: 200, body: { status: 'checked_in', msg: 'Checked in.', checkedInAt: updated.checkedInAt, attendee: reg.user } };
}

router.post('/:eventId/check-in', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const body = await readJson(c);
  const passId = typeof body?.passId === 'string' ? passIdFromScan(body.passId) : '';
  if (!passId) return c.json({ status: 'invalid', msg: 'No pass found in this QR code.' }, 400);

  const prisma = c.get('prisma');
  const userId = c.get('userId');
  try {
    const denied = await canManageSchedule(prisma, eventId, userId);
    if (denied) return c.json({ msg: denied.msg }, denied.status);
    const result = await checkInPass(prisma, eventId, passId, userId);
    return c.json(result.body, result.httpStatus);
  } catch (err: any) {
    logger.error(`[${requestId}] check-in error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── Offline check-in ──────────────────────────────────────────
// Before doors open the scanner downloads the roster, validates scans on the
// device without network, and posts the queued scans when back online.

router.get('/:eventId/check-in/roster', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const denied = await canManageSchedule(prisma, eventId, c.get('userId'));
    if (denied) return c.json({ msg: denied.msg }, denied.status);
    const rows = await prisma.userEvents.findMany({
      where: { eventId },
      take: 10000,
      select: {
        uniquePassId: true, approvalStatus: true, paymentStatus: true, checkedInAt: true,
        user: { select: { name: true, collegeName: true } },
      },
    });
    return c.json({
      generatedAt: new Date().toISOString(),
      roster: rows.map((r: any) => ({
        passId: r.uniquePassId,
        name: r.user?.name ?? null,
        collegeName: r.user?.collegeName ?? null,
        approvalStatus: r.approvalStatus ?? null,
        paymentStatus: r.paymentStatus ?? null,
        checkedInAt: r.checkedInAt,
      })),
    }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] check-in roster error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

const MAX_OFFLINE_SKEW_MS = 3 * 24 * 60 * 60 * 1000;

router.post('/:eventId/check-in/batch', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const body = await readJson(c);
  const items: any[] = Array.isArray(body?.items) ? body.items.slice(0, 500) : [];
  if (items.length === 0) return c.json({ msg: 'items is required' }, 400);

  const prisma = c.get('prisma');
  const userId = c.get('userId');
  try {
    const denied = await canManageSchedule(prisma, eventId, userId);
    if (denied) return c.json({ msg: denied.msg }, denied.status);

    const now = Date.now();
    const results = [];
    for (const item of items) {
      const passId = typeof item?.passId === 'string' ? passIdFromScan(item.passId) : '';
      if (!passId) {
        results.push({ passId: item?.passId ?? null, status: 'invalid', msg: 'No pass id.' });
        continue;
      }
      // Keep the real scan time, but never a future or implausibly old one.
      const scanned = item?.scannedAt ? new Date(item.scannedAt) : null;
      const at = scanned && !Number.isNaN(scanned.getTime()) && scanned.getTime() <= now && now - scanned.getTime() < MAX_OFFLINE_SKEW_MS
        ? scanned
        : undefined;
      const result = await checkInPass(prisma, eventId, passId, userId, at);
      results.push({ passId, ...result.body });
    }
    return c.json({ results }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] check-in batch error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

router.get('/:eventId/check-in/stats', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const prisma = c.get('prisma');
  try {
    const denied = await canManageSchedule(prisma, eventId, c.get('userId'));
    if (denied) return c.json({ msg: denied.msg }, denied.status);
    const [registered, checkedIn] = await Promise.all([
      prisma.userEvents.count({ where: { eventId } }),
      prisma.userEvents.count({ where: { eventId, checkedInAt: { not: null } } }),
    ]);
    return c.json({ registered, checkedIn }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] check-in stats error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

// ── PUT /:eventId/payment — organiser confirms or rejects a payment ──
// Registrations with a screenshot are stored as CONFIRMED immediately; this
// lets organisers reject a bad screenshot (or confirm a pending one) from the
// attendee list. The attendee gets an in-app + push notification.

router.put('/:eventId/payment', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('eventId');
  const body = await readJson(c);
  const attendeeId = typeof body?.userId === 'string' ? body.userId : '';
  const status = typeof body?.status === 'string' ? body.status.toUpperCase() : '';
  if (!attendeeId) return c.json({ msg: 'userId is required' }, 400);
  if (!['CONFIRMED', 'REJECTED'].includes(status)) return c.json({ msg: 'status must be CONFIRMED or REJECTED' }, 400);

  const prisma = c.get('prisma');
  try {
    const denied = await canManageSchedule(prisma, eventId, c.get('userId'));
    if (denied) return c.json({ msg: denied.msg }, denied.status);
    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { isPaid: true, EventName: true } });
    if (!event?.isPaid) return c.json({ msg: 'This event is free.' }, 400);

    const updated = await prisma.userEvents.updateMany({
      where: { eventId, userId: attendeeId },
      data: { paymentStatus: status, paymentVerifiedAt: new Date() },
    });
    if (updated.count === 0) return c.json({ msg: 'This person is not registered for this event.' }, 404);

    c.executionCtx.waitUntil(createNotification(prisma as any, getFcmCfg(c), {
      userId: attendeeId,
      type: 'event_payment',
      title: status === 'CONFIRMED' ? 'Payment confirmed' : 'Payment not accepted',
      body: status === 'CONFIRMED'
        ? `Your payment for ${event.EventName} is confirmed. See you there!`
        : `The organisers couldn't verify your payment for ${event.EventName}. Please contact them.`,
      data: { eventId, route: `/events/${eventId}` },
      push: true,
    }));
    return c.json({ msg: status === 'CONFIRMED' ? 'Payment confirmed' : 'Payment rejected', paymentStatus: status }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] payment decision error`, { error: err.message, eventId });
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

export default router;
