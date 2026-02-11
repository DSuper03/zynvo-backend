import { Hono } from 'hono';
import { prisma } from '../../db/db';
import { logger } from '../../utils/logger';
import { EventSchema } from '../../types/formtypes';
import { clubHeadAuthMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import jwt from 'jsonwebtoken';
import type { HonoEnv } from '../types';

const events = new Hono<HonoEnv>();

const eventSelectBase = {
  id: true,
  EventName: true,
  description: true,
  tagline: true,
  EventMode: true,
  EventType: true,
  EventUrl: true,
  Venue: true,
  TeamSize: true,
  clubName: true,
  clubId: true,
  prizes: true,
  startDate: true,
  endDate: true,
  applicationStartDate: true,
  applicationEndDate: true,
  university: true,
  collegeStudentsOnly: true,
  contactEmail: true,
  contactPhone: true,
  participationFee: true,
  posterUrl: true,
  createdAt: true,
  link1: true,
  link2: true,
  link3: true,
  whatsappLink: true,
  isPaid: true,
  qrCodeUrl: true,
} as const;

const resolveUserId = (authorizationHeader: string | undefined): string | null => {
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authorizationHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && decoded && 'id' in decoded) {
      return (decoded as jwt.JwtPayload).id as string;
    }
  } catch {
    return null;
  }

  return null;
};

events.get('/all', async (c) => {
  const requestId = generateRequestId();
  const pageValue = c.req.query('page');
  const pageParsed = pageValue ? Number.parseInt(pageValue, 10) : 1;
  const page = Number.isNaN(pageParsed) || pageParsed < 1 ? 1 : pageParsed;
  const limit = 10;
  const skip = (page - 1) * limit;

  logger.info(`[${requestId}] Hono GET /api/v1/events/all - Starting request`, {
    page,
    limit,
    skip,
  });

  try {
    const [response, totalData] = await Promise.all([
      prisma.event.findMany({
        take: limit,
        skip,
        orderBy: { createdAt: 'desc' },
        select: {
          ...eventSelectBase,
          attendees: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.event.count(),
    ]);

    if (!response || response.length === 0) {
      logger.warn(`[${requestId}] No events found`);
      return jsonError(c, requestId, 'No events found', 404);
    }

    logger.info(`[${requestId}] Events fetched successfully`, {
      eventsCount: response.length,
      totalData,
      totalPages: Math.ceil(totalData / limit),
    });

    return c.json(
      {
        msg: 'found',
        response,
        totalPages: Math.ceil(totalData / limit),
      },
      200,
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${requestId}] Error fetching all events`, {
      error: err.message,
      stack: err.stack,
    });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

events.post('/event', clubHeadAuthMiddleware, async (c) => {
  const requestId = generateRequestId();

  let body: Record<string, unknown> | null = null;
  try {
    body = (await c.req.json()) as Record<string, unknown>;
  } catch {
    return jsonError(c, requestId, 'Invalid JSON payload', 400);
  }

  if (!body || typeof body !== 'object') {
    return jsonError(c, requestId, 'Invalid request body', 400);
  }

  const {
    eventName,
    description,
    eventStartDate,
    eventEndDate,
    eventMode,
    eventType,
    maxTeamSize,
    venue,
    eventWebsite,
    university,
    collegeStudentsOnly,
    contactEmail,
    contactPhone,
    noParticipationFee,
    prizes,
    image,
    form,
    fees,
    link1,
    link2,
    link3,
    whatsappLink,
    isPaid,
    qrCodeUrl,
    isPaidEvent,
    paymentAmount,
    paymentQRCode,
    tagline,
    applicationStartDate,
    applicationEndDate,
    coreTeamOnly,
  } = body as Record<string, any>;

  const userId =
    (c.get('userId') as string | undefined) ??
    resolveUserId(
      c.req.header('authorization') ?? c.req.header('Authorization'),
    );

  logger.info(
    `[${requestId}] Hono POST /api/v1/events/event - Starting event creation`,
    {
      userId,
      description,
      eventName,
      university,
      isPaid,
      qrCodeUrl,
      fees,
      bodyIsPaid: isPaid,
      bodyQrCode: qrCodeUrl,
      bodyFees: fees,
      fullBody: JSON.stringify(body),
      coreTeamOnly,
    },
  );

  const parsedData = EventSchema.safeParse(body);
  if (!parsedData.success) {
    logger.warn(`[${requestId}] Invalid request format`, {
      userId,
      errors: parsedData.error.errors,
    });
    return jsonError(c, requestId, 'incorrect format', 400);
  }

  if (!userId) {
    return jsonError(c, requestId, 'Please login', 401);
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user) {
      logger.warn(`[${requestId}] User not found`, { userId });
      return jsonError(c, requestId, 'No user Found', 404);
    }

    const club = await prisma.clubs.findUnique({
      where: { founderEmail: user.email },
      select: {
        name: true,
        id: true,
        collegeName: true,
      },
    });

    if (!club) {
      logger.warn(`[${requestId}] User is not a club president`, {
        userId,
        userEmail: user.email,
      });
      return jsonError(c, requestId, 'invalid president identification', 403);
    }

    const clubId = club.id;
    const clubName = club.name;
    const clubCollege = club.collegeName;

    if (university !== clubCollege) {
      logger.warn(`[${requestId}] College mismatch`, {
        userId,
        providedUniversity: university,
        clubCollege,
      });
      return jsonError(
        c,
        requestId,
        'College mismatch, select your correct college',
        400,
      );
    }

    logger.info(`[${requestId}] Creating event`, {
      eventName,
      clubId,
      clubName,
    });

    const response = await prisma.event.create({
      data: {
        EventName: parsedData.data.eventName,
        description: parsedData.data.description || '',
        tagline: parsedData.data.tagline || '',
        EventMode: eventMode,
        EventType: eventType,
        EventUrl: eventWebsite || '',
        Venue: venue,
        TeamSize: Number.parseInt(String(maxTeamSize), 10),
        clubName: clubName,
        clubId: clubId,
        prizes: prizes || '',
        startDate: eventStartDate,
        endDate: eventEndDate,
        applicationStartDate: parsedData.data.applicationStartDate || '',
        applicationEndDate: parsedData.data.applicationEndDate || '',
        university: clubCollege,
        collegeStudentsOnly: collegeStudentsOnly,
        contactEmail: contactEmail,
        contactPhone: parsedData.data.contactPhone || contactPhone || '',
        participationFee: noParticipationFee,
        posterUrl: parsedData.data.image,
        eventHeaderImage: parsedData.data.image,
        Form: parsedData.data.form ? parsedData.data.form : 'none',
        Fees: parsedData.data.paymentAmount || parsedData.data.fees || 'none',
        link1: parsedData.data.link1 ? parsedData.data.link1 : null,
        link2: parsedData.data.link2 ? parsedData.data.link2 : null,
        link3: parsedData.data.link3 ? parsedData.data.link3 : null,
        whatsappLink: parsedData.data.whatsappLink || '',
        isPaid: parsedData.data.isPaidEvent ?? parsedData.data.isPaid ?? false,
        qrCodeUrl:
          parsedData.data.paymentQRCode || parsedData.data.qrCodeUrl || null,
      },
      select: { id: true },
    });

    logger.info(`[${requestId}] Event created successfully`, {
      eventId: response.id,
      clubId,
    });

    return c.json(
      {
        msg: 'event created',
        id: response.id,
      },
      201,
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${requestId}] Error creating event`, {
      error: err.message,
      stack: err.stack,
      userId,
    });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

events.get('/event/:id', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.param('id');

  logger.info(
    `[${requestId}] Hono GET /api/v1/events/event/:id - Starting request`,
    { eventId },
  );

  if (!eventId) {
    logger.warn(`[${requestId}] No event ID provided`);
    return jsonError(c, requestId, 'Event ID is required', 400);
  }

  try {
    const response = await prisma.event.findUnique({
      where: { id: eventId },
      select: eventSelectBase,
    });

    if (!response) {
      logger.warn(`[${requestId}] Event not found`, { eventId });
      return jsonError(c, requestId, 'no such event', 404);
    }

    logger.info(`[${requestId}] Event found`, {
      eventId: response.id,
      eventName: response.EventName,
    });

    return c.json(
      {
        msg: 'event found',
        response,
      },
      200,
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${requestId}] Error fetching event`, {
      error: err.message,
      stack: err.stack,
      eventId,
    });
    return jsonError(c, requestId, 'Internal Server error', 500, err);
  }
});

events.get('/getSpeakers', async (c) => {
  const requestId = generateRequestId();
  const eventId = c.req.query('id') ?? '';

  logger.info(`[${requestId}] Hono GET /api/v1/events/getSpeakers`, {
    eventId,
  });

  if (!eventId) {
    logger.warn(`[${requestId}] No event ID provided`);
    return jsonError(c, requestId, 'Event ID is required', 400);
  }

  try {
    const speakers = await prisma.speakers.findMany({
      where: { eventId },
      select: {
        id: true,
        profilePic: true,
        about: true,
        name: true,
        email: true,
        eventId: true,
      },
    });

    if (!speakers || speakers.length === 0) {
      logger.warn(`[${requestId}] No speakers found for event`, { eventId });
      return jsonError(c, requestId, 'No speakers added for the event', 404);
    }

    logger.info(`[${requestId}] Speakers found`, {
      eventId,
      speakersCount: speakers.length,
    });

    return c.json(
      {
        msg: 'speakers are there',
        speakers,
      },
      200,
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error(`[${requestId}] Error fetching speakers`, {
      error: err.message,
      stack: err.stack,
      eventId,
    });
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

export default events;
