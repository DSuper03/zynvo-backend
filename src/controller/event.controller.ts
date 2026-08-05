import e, { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { EventSchema } from '../types/formtypes';
import { generateRequestId, generateUUID, sendErrorResponse } from '../utils/helper';
import { Prisma, PrismaClient } from '@prisma/client';
import app from '..';



 // Temporary workaround for the Prisma type issue in eventAttendees function
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
    Fees: true,
    qrCodeUrl: true,
    maxParticipants: true,
    _count: {
        select: { attendees: true }
    },
    customQuestions: {
        orderBy: { sortOrder: 'asc' }
    }
} as const;

// Surface payment amount under friendlier keys for responses.
const mapEventFees = <T extends { Fees?: string | null }>(event: T) => ({
    ...event,
    paymentAmount: event.Fees,
    fees: event.Fees,
});

// Normalize query/param values that might be arrays into a single string
const normalizeParam = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

// Parse a user-supplied date string; returns a Date or null if unparseable.
// Used to reject garbage like "tomorrow" with a clean 400 instead of storing it.
const parseDate = (value: unknown): Date | null => {
    if (value === undefined || value === null || value === '') return null;
    const d = new Date(value as string);
    return Number.isNaN(d.getTime()) ? null : d;
};

// Minimal email shape check. contactEmail is NOT NULL in the DB, so validating
// here turns a missing/garbage value into a 400 instead of a Prisma 500.
const isValidEmail = (value: unknown): value is string =>
    typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const createEvent = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

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
        customQuestions,
        acceptanceBased,
    } = req.body;

    const userId = req.id;

    logger.info(`[${requestId}] POST /event - Starting event creation`, {
        userId,
        eventName,
        university,
        isPaid: isPaid,
        qrCodeUrl: qrCodeUrl,
        fees: fees,
        bodyIsPaid: req.body.isPaid,
        bodyQrCode: req.body.qrCodeUrl,
        bodyFees: req.body.fees,
        fullBody: JSON.stringify(req.body)
    });

    const parsedData = EventSchema.safeParse(req.body);
    if (!parsedData.success) {
        logger.warn(`[${requestId}] Invalid request format`, {
            userId,
            errors: parsedData.error.errors
        });
        sendErrorResponse(res, requestId, 'incorrect format', 400);
        return;
    }

    // Event name must be present and not just whitespace (z.string() alone allows "   ").
    if (typeof eventName !== 'string' || eventName.trim() === '') {
        logger.warn(`[${requestId}] Missing or empty event name`, { userId });
        sendErrorResponse(res, requestId, 'Event name is required', 400);
        return;
    }

    // contactEmail is NOT NULL in the DB; validate here so a bad/missing value
    // returns a 400 rather than surfacing as a generic Prisma 500 during create.
    if (!isValidEmail(contactEmail)) {
        logger.warn(`[${requestId}] Missing or invalid contact email`, { userId });
        sendErrorResponse(res, requestId, 'A valid contact email is required', 400);
        return;
    }

    // startDate is required (non-null) in the schema, and must be a real date.
    if (!eventStartDate) {
        logger.warn(`[${requestId}] Missing event start date`, { userId });
        sendErrorResponse(res, requestId, 'Event start date is required', 400);
        return;
    }
    const startDate = parseDate(eventStartDate);
    if (!startDate) {
        logger.warn(`[${requestId}] Unparseable event start date`, { userId, eventStartDate });
        sendErrorResponse(res, requestId, 'Event start date is not a valid date', 400);
        return;
    }

    // If an end date is provided it must be a real date and not precede the start date.
    if (eventEndDate) {
        const end = parseDate(eventEndDate);
        if (!end) {
            logger.warn(`[${requestId}] Unparseable event end date`, { userId, eventEndDate });
            sendErrorResponse(res, requestId, 'Event end date is not a valid date', 400);
            return;
        }
        if (startDate > end) {
            logger.warn(`[${requestId}] Event start date is after end date`, { userId });
            sendErrorResponse(res, requestId, 'Event start date must be on or before the end date', 400);
            return;
        }
    }

    // Application window: each provided date must be real, and start must not follow end.
    const appStart = applicationStartDate ? parseDate(applicationStartDate) : null;
    if (applicationStartDate && !appStart) {
        logger.warn(`[${requestId}] Unparseable application start date`, { userId });
        sendErrorResponse(res, requestId, 'Application start date is not a valid date', 400);
        return;
    }
    const appEnd = applicationEndDate ? parseDate(applicationEndDate) : null;
    if (applicationEndDate && !appEnd) {
        logger.warn(`[${requestId}] Unparseable application end date`, { userId });
        sendErrorResponse(res, requestId, 'Application end date is not a valid date', 400);
        return;
    }
    if (appStart && appEnd && appStart > appEnd) {
        logger.warn(`[${requestId}] Application start date is after end date`, { userId });
        sendErrorResponse(res, requestId, 'Application start date must be on or before the application end date', 400);
        return;
    }

    // Resolve the paid flag and fee exactly the way the payload does, so we can
    // reject a paid event that carries no fee amount instead of silently storing "none".
    const resolvedIsPaid = parsedData.data.isPaidEvent ?? parsedData.data.isPaid ?? false;
    const resolvedFee = parsedData.data.paymentAmount ?? parsedData.data.fees ?? null;
    if (resolvedIsPaid && (resolvedFee === null || resolvedFee === '' || resolvedFee === 'none')) {
        logger.warn(`[${requestId}] Paid event missing fee amount`, { userId });
        sendErrorResponse(res, requestId, 'A paid event must include a fee amount', 400);
        return;
    }

    // Guard against NaN team size (parseInt of undefined/garbage) — default to a solo team.
    const parsedTeamSize = parseInt(maxTeamSize, 10);
    const teamSize = Number.isNaN(parsedTeamSize) || parsedTeamSize < 1 ? 1 : parsedTeamSize;

    // maxParticipants, when provided, must be a positive integer (treat '' as "no limit").
    const rawMax = parsedData.data.maxParticipants;
    let maxParticipants: number | null = null;
    if (rawMax !== undefined && rawMax !== null && rawMax !== '') {
        const parsedMax = parseInt(rawMax.toString(), 10);
        if (Number.isNaN(parsedMax) || parsedMax < 1) {
            logger.warn(`[${requestId}] Invalid maxParticipants`, { userId, rawMax });
            sendErrorResponse(res, requestId, 'Max participants must be a positive number', 400);
            return;
        }
        maxParticipants = parsedMax;
    }

    try {
        logger.info(`[${requestId}] Fetching user and club information`, { userId });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            sendErrorResponse(res, requestId, 'No user Found', 404);
            return;
        }

        const club = await prisma.clubs.findFirst({
            where: {
                OR: [
                    { founderEmail: { equals: user.email, mode: 'insensitive' } },
                    { coremember1: { equals: user.email, mode: 'insensitive' } },
                    { coremember2: { equals: user.email, mode: 'insensitive' } },
                    { coremember3: { equals: user.email, mode: 'insensitive' } }
                ]
            },
            select: {
                name: true,
                id: true,
                collegeName: true,
            },
        });

        if (!club) {
            logger.warn(`[${requestId}] User is not a club head or core member`, {
                userId,
                userEmail: user.email
            });
            sendErrorResponse(res, requestId, 'invalid club member identification', 403);
            return;
        }

        if ((university ?? '').trim().toLowerCase() !== (club.collegeName ?? '').trim().toLowerCase()) {
            logger.warn(`[${requestId}] College mismatch`, {
                userId,
                providedUniversity: university,
                clubCollege: club.collegeName
            });
            sendErrorResponse(res, requestId, 'College mismatch, select your correct college', 400);
            return;
        }

        logger.info(`[${requestId}] Creating event`, {
            eventName,
            clubId: club.id,
            clubName: club.name
        });

        const eventDataPayload: any = {
            EventName: parsedData.data.eventName,
            description: parsedData.data.description || '',
            tagline: parsedData.data.tagline || '',
            EventMode: eventMode,
            EventType: eventType,
            EventUrl: eventWebsite || '',
            Venue: venue,
            TeamSize: teamSize,
            clubName: club.name,
            clubId: club.id,
            prizes: prizes || '',
            startDate: eventStartDate,
            endDate: eventEndDate,
            applicationStartDate: parsedData.data.applicationStartDate || '',
            applicationEndDate: parsedData.data.applicationEndDate || '',
            university: club.collegeName,
            collegeStudentsOnly: collegeStudentsOnly,
            contactEmail: contactEmail,
            contactPhone: parsedData.data.contactPhone || contactPhone || '',
            participationFee: noParticipationFee,
            posterUrl: parsedData.data.image,
            eventHeaderImage : parsedData.data.image,
            Form : parsedData.data.form ? parsedData.data.form : "none",
            Fees : resolvedFee ?? "none",
            link1 : parsedData.data.link1 ? parsedData.data.link1 : null,
            link2 : parsedData.data.link2 ? parsedData.data.link2 : null,
            link3 : parsedData.data.link3 ? parsedData.data.link3 : null,
            whatsappLink: parsedData.data.whatsappLink || "",
            isPaid: resolvedIsPaid,
            qrCodeUrl: parsedData.data.paymentQRCode || parsedData.data.qrCodeUrl || null,
            maxParticipants: maxParticipants,
            createdById: userId,
            acceptanceBased: acceptanceBased ?? false,
        };

        if (customQuestions && Array.isArray(customQuestions) && customQuestions.length > 0) {
            const ALLOWED_QUESTION_TYPES = ['text', 'textarea', 'number', 'email', 'select', 'radio', 'checkbox', 'date'];

            // Reject a question with no label instead of persisting a blank/NULL one.
            const invalidQuestion = customQuestions.find(
                (q: any) => !q || typeof q.label !== 'string' || q.label.trim() === ''
            );
            if (invalidQuestion) {
                logger.warn(`[${requestId}] Custom question missing label`, { userId });
                sendErrorResponse(res, requestId, 'Each custom question must have a label', 400);
                return;
            }

            eventDataPayload.customQuestions = {
                create: customQuestions.map((q: any) => ({
                    label: q.label.trim(),
                    type: ALLOWED_QUESTION_TYPES.includes(q.type) ? q.type : 'text',
                    options: Array.isArray(q.options) ? q.options : [],
                    required: q.required === true,
                    sortOrder: Number.isInteger(q.sortOrder) ? q.sortOrder : 0
                }))
            };
        }

        const response = await prisma.event.create({
            data: eventDataPayload,
            select: { id: true }
        });



        logger.info(`[${requestId}] Event created successfully`, {
            eventId: response.id,
            clubId: club.id
        });

        res.status(201).json({
            msg: 'event created',
            id: response.id,
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error creating event`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            userId
        });
        console.log(error);

        // EventName has a global unique constraint; surface a clean 409 instead of a generic 500.
        if (error.code === 'P2002') {
            sendErrorResponse(res, requestId, 'An event with this name already exists. Please choose a different name.', 409);
            return;
        }

        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = normalizeParam(req.params.id);

    logger.info(`[${requestId}] GET /event/:id - Starting request`, { eventId });

    try {
        if (!eventId) {
            logger.warn(`[${requestId}] No event ID provided`);
            sendErrorResponse(res, requestId, 'Event ID is required', 400);
            return;
        }

        const response = await prisma.event.findUnique({
            where: { id: eventId },
            select: eventSelectBase,
        });

        if (!response) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            sendErrorResponse(res, requestId, 'no such event', 404);
            return;
        }

        logger.info(`[${requestId}] Event found`, {
            eventId: response.id,
            eventName: response.EventName
        });

        const mappedEvent = mapEventFees(response);

        res.status(200).json({
            msg: 'event found',
            response: mappedEvent,
        });
        return;

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching event`, {
            error: error.message,
            stack: error.stack,
            eventId
        });
        sendErrorResponse(res, requestId, 'Internal Server error', 500);
    }
};

export const getEventsByClub = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const clubId = normalizeParam(req.params.id);

    logger.info(`[${requestId}] GET /eventByClub/:id - Starting request`, {
        clubId,
        userId: req.id
    });

    try {
        const events = await prisma.event.findMany({
            where: { clubId: clubId },
            select: eventSelectBase,
            orderBy: { createdAt: 'desc' }
        });

        if (!events || events.length === 0) {
            logger.warn(`[${requestId}] No events found for club`, { clubId });
            sendErrorResponse(res, requestId, 'no club found', 404);
            return;
        }

        logger.info(`[${requestId}] Events found for club`, {
            clubId,
            eventsCount: events.length
        });

        const mappedEvents = events.map(mapEventFees);

        res.status(200).json({
            msg: 'fetched',
            event: mappedEvents,
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching club events`, {
            error: error.message,
            stack: error.stack,
            clubId
        });
        console.log(error);
        sendErrorResponse(res, requestId, 'Internal Server error', 500);
    }
};

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    logger.info(`[${requestId}] GET /all - Starting request`, {
        query: req.query
    });

    try {
        const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
        const limit = 10;
        const skip = (page - 1) * limit;

        logger.info(`[${requestId}] Fetching events with pagination`, {
            page,
            limit,
            skip
        });

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
            sendErrorResponse(res, requestId, 'No events found', 404);
            return;
        }


        logger.info(`[${requestId}] Events fetched successfully`, {
            eventsCount: response.length,
            totalData,
            totalPages: Math.ceil(totalData / limit)
        });

        const mappedResponse = response.map(mapEventFees);

        res.status(200).json({
            msg: 'found',
            response: mappedResponse,
            totalPages: Math.ceil(totalData / limit)
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching all events`, {
            error: error.message,
            stack: error.stack
        });
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const searchEvents = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();

    // Accept both `q` and `name` for the free-text term, and `college` as an alias for `university`.
    // Cap query length at 200 chars to prevent abuse.
    const rawTerm = (normalizeParam(req.query.q as any) ?? normalizeParam(req.query.name as any) ?? '').trim();
    const term = rawTerm.substring(0, 200);

    const eventType = normalizeParam(req.query.eventType as any)?.trim().substring(0, 100);
    const eventMode = normalizeParam(req.query.eventMode as any)?.trim().substring(0, 50);
    const university = (normalizeParam(req.query.university as any) ?? normalizeParam(req.query.college as any))?.trim().substring(0, 200);
    const isPaidRaw = normalizeParam(req.query.isPaid as any)?.trim().toLowerCase();
    const clubId = normalizeParam(req.query.clubId as any)?.trim();
    const upcomingRaw = normalizeParam(req.query.upcoming as any)?.trim().toLowerCase();

    logger.info(`[${requestId}] GET /search - Starting event search`, {
        term,
        eventType,
        eventMode,
        university,
        isPaid: isPaidRaw,
        clubId,
        upcoming: upcomingRaw
    });

    try {
        // Clamp page and limit to sane values
        const rawPage = parseInt(req.query.page as string);
        const rawLimit = parseInt(req.query.limit as string);
        const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
        const limit = Number.isNaN(rawLimit) ? 10 : Math.min(Math.max(rawLimit, 1), 50);
        const skip = (page - 1) * limit;

        // Build an AND of filters; each clause is only added when the caller supplied it.
        const andFilters: Prisma.eventWhereInput[] = [];

        if (term) {
            andFilters.push({
                OR: [
                    { EventName: { contains: term, mode: 'insensitive' } },
                    { tagline: { contains: term, mode: 'insensitive' } },
                    { description: { contains: term, mode: 'insensitive' } },
                    { clubName: { contains: term, mode: 'insensitive' } },
                ]
            });
        }

        if (eventType) {
            andFilters.push({ EventType: { equals: eventType, mode: 'insensitive' } });
        }

        if (eventMode) {
            andFilters.push({ EventMode: { equals: eventMode, mode: 'insensitive' } });
        }

        if (university) {
            andFilters.push({ university: { contains: university, mode: 'insensitive' } });
        }

        if (clubId) {
            andFilters.push({ clubId: { equals: clubId } });
        }

        if (isPaidRaw === 'true' || isPaidRaw === 'false') {
            andFilters.push({ isPaid: isPaidRaw === 'true' });
        }

        // upcoming=true → only return events whose startDate is today or in the future
        if (upcomingRaw === 'true') {
            const todayPrefix = new Date().toISOString().substring(0, 10); // YYYY-MM-DD
            andFilters.push({ startDate: { gte: todayPrefix } });
        }

        const where: Prisma.eventWhereInput = andFilters.length > 0 ? { AND: andFilters } : {};

        const [events, total] = await Promise.all([
            prisma.event.findMany({
                where,
                take: limit,
                skip,
                orderBy: { createdAt: 'desc' },
                select: eventSelectBase
            }),
            prisma.event.count({ where })
        ]);

        logger.info(`[${requestId}] Event search completed`, {
            resultsCount: events.length,
            total,
            page
        });

        // Search returns an empty list (200) rather than 404 when nothing matches.
        res.status(200).json({
            msg: 'search completed',
            response: events.map(mapEventFees),
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error searching events`, {
            error: error.message,
            stack: error.stack
        });
        console.log(error);
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { eventId, paymentScreenshotUrl, paymentProofUrl, customAnswers } = req.body;
    const paymentScreenshot = paymentScreenshotUrl ?? paymentProofUrl;

    logger.info(`[${requestId}] POST /registerEvent - Starting registration`, {
        userId,
        eventId
    });

    if (!userId) {
        logger.warn(`[${requestId}] Invalid user ID`);
        sendErrorResponse(res, requestId, 'invalid user', 402);
        return;
    }

    try {
        // Check if user is already registered
        const alreadyRegistered = await prisma.userEvents.findUnique({
            where: {
                userId_eventId: {
                    userId: userId,
                    eventId: eventId,
                },
            },
        });

        if (alreadyRegistered) {
            logger.warn(`[${requestId}] User already registered for event`, {
                userId,
                eventId
            });
            sendErrorResponse(res, requestId, 'already registered bro', 402);
            return;
        }

        // Fetch event first so we can fail early for missing events.
        // This single fetch backs every downstream check (limit, college, paid,
        // registration window, required questions) — no re-querying.
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: {
                isPaid: true,
                collegeStudentsOnly: true,
                university: true,
                maxParticipants: true,
                _count: {
                    select: { attendees: true }
                },
                acceptanceBased: true,
                applicationStatus: true,
                applicationEndDate: true,
                customQuestions: {
                    where: { required: true },
                    select: { id: true, label: true }
                }
            }
        });

        if (!event) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        // Enforce the registration window: closed status or a past application end date blocks new sign-ups.
        if (event.applicationStatus && event.applicationStatus.toLowerCase() !== 'open') {
            logger.warn(`[${requestId}] Registration closed (applicationStatus)`, { eventId, applicationStatus: event.applicationStatus });
            sendErrorResponse(res, requestId, 'Registration is closed for this event', 400);
            return;
        }

        if (event.applicationEndDate) {
            const deadline = new Date(event.applicationEndDate);
            if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) {
                logger.warn(`[${requestId}] Registration deadline passed`, { eventId, applicationEndDate: event.applicationEndDate });
                sendErrorResponse(res, requestId, 'Registration is closed for this event', 400);
                return;
            }
        }

        // Ensure every required custom question has been answered.
        if (event.customQuestions.length > 0) {
            const answeredIds = new Set(
                (Array.isArray(customAnswers) ? customAnswers : [])
                    .filter((a: any) => a && a.answer !== undefined && a.answer !== null && String(a.answer).trim() !== '')
                    .map((a: any) => a.questionId)
            );
            const missing = event.customQuestions.filter(q => !answeredIds.has(q.id));
            if (missing.length > 0) {
                logger.warn(`[${requestId}] Missing required custom question answers`, {
                    eventId,
                    missing: missing.map(q => q.label)
                });
                sendErrorResponse(res, requestId, `Please answer all required questions: ${missing.map(q => q.label).join(', ')}`, 400);
                return;
            }
        }

        // Check if participation limit is reached
        if (event.maxParticipants !== null && event.maxParticipants !== undefined && event._count.attendees >= event.maxParticipants) {
            logger.warn(`[${requestId}] Event participation limit reached`, {
                eventId,
                maxParticipants: event.maxParticipants,
                currentAttendees: event._count.attendees
            });
            sendErrorResponse(res, requestId, 'Participation limit reached for this event', 400);
            return;
        }

        if (event.collegeStudentsOnly) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    collegeName: true
                }
            });

            if (!user) {
                logger.warn(`[${requestId}] User not found`, { userId });
                sendErrorResponse(res, requestId, 'User not found', 404);
                return;
            }

            const eventCollegeRaw = event.university || '';
            const eventCollege = eventCollegeRaw.trim().toLowerCase();
            const userCollege = (user.collegeName || '').trim().toLowerCase();

            if (!eventCollege || !userCollege || eventCollege !== userCollege) {
                logger.warn(`[${requestId}] College restriction failed`, {
                    userId,
                    eventId,
                    userCollege: user.collegeName,
                    eventCollege: eventCollegeRaw
                });
                sendErrorResponse(
                    res,
                    requestId,
                    'This event is restricted to students of the organizer college',
                    403
                );
                return;
            }
        }

        // If event is paid, payment screenshot is required
        if (event.isPaid && !paymentScreenshot) {
            logger.warn(`[${requestId}] Payment screenshot missing for paid event`, {
                userId,
                eventId
            });
            sendErrorResponse(res, requestId, 'Payment screenshot is required for paid events', 400);
            return;
        }

        logger.info(`[${requestId}] Registering user for event`, {
            userId,
            eventId,
            isPaid: event.isPaid
        });


        // acceptance based event registration flow

        if(event.acceptanceBased) {

    
        const response = await prisma.userEvents.create({
            data: {
                userId: userId,
                eventId: eventId,
                uniquePassId: generateUUID(),
                paymentScreenshotUrl: paymentScreenshot || null,
                paymentStatus: event.isPaid
                    ? (paymentScreenshot ? 'CONFIRMED' : 'PENDING')
                    : 'CONFIRMED',
                approvalStatus: 'pending'
            },
            select: {
                uniquePassId: true,
                paymentStatus: true
            }
        });

        if (customAnswers && Array.isArray(customAnswers) && customAnswers.length > 0) {
         await prisma.registrationAnswer.createMany({
                data: customAnswers.map((ans: any) => ({
                    questionId: ans.questionId,
                    userId: userId,
                    eventId: eventId,
                    answer: ans.answer
                })),
                skipDuplicates: true ,
                
            }, );
        }


        logger.info(`[${requestId}] User registered successfully`, {
            userId,
            eventId,
            passId: response.uniquePassId,
            paymentStatus: response.paymentStatus
        });

            const registred : boolean = await addToEventQueue(req , res, eventId); 
            if(registred === false){
                res.status(500).json({ msg: 'Failed to add registration to event queue' });
                return;
            } else {
                logger.info(`[${requestId}] User added to event queue for acceptance-based event`, {
                    userId,
                    eventId
                });
                res.status(200).json({
            msg: 'registered successfully , waiting for approval',
            ForkedUpId: response.uniquePassId,
            paymentStatus: response.paymentStatus,
            requiresPaymentVerification: event.isPaid ,
            approvalStatus: 'pending'
                });
            return;
            }
        }

        // Re-count inside a transaction so concurrent registrations can't blow past
        // maxParticipants (the earlier check is best-effort; this closes most of the race).
        let response;
        try {
            response = await prisma.$transaction(async (tx) => {
                if (event.maxParticipants !== null && event.maxParticipants !== undefined) {
                    const currentCount = await tx.userEvents.count({ where: { eventId } });
                    if (currentCount >= event.maxParticipants) {
                        throw new Error('PARTICIPATION_LIMIT_REACHED');
                    }
                }

                return tx.userEvents.create({
                    data: {
                        userId: userId,
                        eventId: eventId,
                        uniquePassId: generateUUID(),
                        paymentScreenshotUrl: paymentScreenshot || null,
                        paymentStatus: event.isPaid
                            ? (paymentScreenshot ? 'CONFIRMED' : 'PENDING')
                            : 'CONFIRMED'
                    },
                    select: {
                        uniquePassId: true,
                        paymentStatus: true
                    }
                });
            });
        } catch (txError: any) {
            if (txError.message === 'PARTICIPATION_LIMIT_REACHED') {
                logger.warn(`[${requestId}] Event participation limit reached (transaction)`, {
                    eventId,
                    maxParticipants: event.maxParticipants
                });
                sendErrorResponse(res, requestId, 'Participation limit reached for this event', 400);
                return;
            }
            throw txError;
        }

        if (customAnswers && Array.isArray(customAnswers) && customAnswers.length > 0) {
            await prisma.registrationAnswer.createMany({
                data: customAnswers.map((ans: any) => ({
                    questionId: ans.questionId,
                    userId: userId,
                    eventId: eventId,
                    answer: ans.answer
                })),
                skipDuplicates: true
            });
        }

        logger.info(`[${requestId}] User registered successfully`, {
            userId,
            eventId,
            passId: response.uniquePassId,
            paymentStatus: response.paymentStatus
        });

        res.status(200).json({
            msg: 'registered successfully',
            ForkedUpId: response.uniquePassId,
            paymentStatus: response.paymentStatus,
            requiresPaymentVerification: event.isPaid,
            approvalStatus : "confirmed"
        });

    } catch (error: any) {
        if (error?.code === 'P2002') {
            sendErrorResponse(res, requestId, 'you are already registered for this event', 409);
            return;
        }
        logger.error(`[${requestId}] Error registering for event`, {
            error: error.message,
            stack: error.stack,
            userId,
            eventId
        });
        console.log(error);
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const addSpeaker = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { profilePic, about, name, email, eventId } = req.body;

    logger.info(`[${requestId}] POST /addSpeakers - Starting request`, {
        userId,
        eventId,
        speakerEmail: email
    });

    if (!eventId) {
        sendErrorResponse(res, requestId, 'Event ID is required', 400);
        return;
    }

    try {
        logger.info(`[${requestId}] Validating user as club president`, { userId });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true },
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            sendErrorResponse(res, requestId, 'No user Found', 404);
            return;
        }

        // The speaker must attach to a real event, and the requester must belong to
        // that event's club (founder or core member) — not merely be *a* club founder.
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true }
        });

        if (!event) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        const club = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                OR: [
                    { founderEmail: { equals: user.email, mode: 'insensitive' } },
                    { coremember1: { equals: user.email, mode: 'insensitive' } },
                    { coremember2: { equals: user.email, mode: 'insensitive' } },
                    { coremember3: { equals: user.email, mode: 'insensitive' } }
                ]
            },
            select: {
                name: true,
                id: true,
            },
        });

        if (!club) {
            logger.warn(`[${requestId}] User is not authorized for this event's club`, {
                userId,
                userEmail: user.email,
                eventId
            });
            sendErrorResponse(res, requestId, 'Only club heads or core members can add speakers to this event', 403);
            return;
        }

        logger.info(`[${requestId}] Adding speaker to event`, {
            eventId,
            speakerName: name,
            speakerEmail: email
        });

        const addSpeakerResult = await prisma.speakers.create({
            data: {
                profilePic: profilePic || '',
                about: about,
                name: name,
                email: email,
                eventId: eventId,
            },
            select: { id: true }
        });

        logger.info(`[${requestId}] Speaker added successfully`, {
            speakerId: addSpeakerResult.id,
            eventId
        });

        res.status(200).json({
            msg: 'Speaker added',
            id: addSpeakerResult.id,
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error adding speaker`, {
            error: error.message,
            stack: error.stack,
            userId,
            eventId
        });
        console.log(error);

        // speakers.email has a global unique constraint; return a clean 409 instead of a 500.
        if (error.code === 'P2002') {
            sendErrorResponse(res, requestId, 'A speaker with this email already exists', 409);
            return;
        }

        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const getSpeakers = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.query.id as string;

    logger.info(`[${requestId}] GET /getSpeakers - Starting request`, { eventId });

    try {
        const speakers = await prisma.speakers.findMany({
            where: { eventId: eventId },
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
            sendErrorResponse(res, requestId, 'No speakers added for the event', 404);
            return;
        }

        logger.info(`[${requestId}] Speakers found`, {
            eventId,
            speakersCount: speakers.length
        });

        res.status(200).json({
            msg: 'speakers are there',
            speakers
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching speakers`, {
            error: error.message,
            stack: error.stack,
            eventId
        });
        console.log(error);
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const verifyEventRegistration = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const id = req.query.id as string;

    logger.info(`[${requestId}] GET /ver-event - Verifying registration`, { passId: id });

    if (!id?.startsWith('Z')) {
        logger.warn(`[${requestId}] Invalid pass ID format`, { passId: id });
        res.status(502).json({
            status: 'invalid'
        });
        return;
    }

    try {
        const findUser = await prisma.userEvents.findFirst({
            where: { uniquePassId: id },
            select: { uniquePassId: true }
        });

        if (findUser) {
            logger.info(`[${requestId}] Registration verified`, { passId: id });
            res.status(200).json({
                status: 'registered'
            });
        } else {
            logger.warn(`[${requestId}] Registration not found`, { passId: id });
            res.status(404).json({
                status: 'unregistered'
            });
        }

    } catch (error: any) {
        logger.error(`[${requestId}] Error verifying registration`, {
            error: error.message,
            stack: error.stack,
            passId: id
        });
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const getEventDetails = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const id = req.query.id as string;

    logger.info(`[${requestId}] GET /event-details - Starting request`, { passId: id });

    if (!id?.startsWith('Z')) {
        logger.warn(`[${requestId}] Invalid pass ID format`, { passId: id });
        res.status(502).json({
            status: 'invalid'
        });
        return;
    }

    try {
        const findUser = await prisma.userEvents.findFirst({
            where: { uniquePassId: id },
            select: {
                event: {
                    select: {
                        EventName: true,
                        clubName: true,
                        club: {
                            select: {
                                collegeName: true
                            }
                        },
                        startDate: true,
                        Venue: true,
                        posterUrl: true
                    }
                },
                user: {
                    select: {
                        profileAvatar: true
                    }
                },
                approvalStatus : true
            }
        });

        if (findUser) {
            logger.info(`[${requestId}] Event details found`, {
                passId: id,
                eventName: findUser.event.EventName
            });

            res.status(200).json({
                data: {
                    eventName: findUser.event.EventName,
                    clubName: findUser.event.clubName,
                    collegeName: findUser.event.club.collegeName,
                    startDate: findUser.event.startDate,
                    profilePic: findUser.user.profileAvatar,
                    approvalStatus : findUser.approvalStatus,
                    venue: findUser.event.Venue,
                    posterUrl: findUser.event.posterUrl
                }
            });
        } else {
            logger.warn(`[${requestId}] Event details not found`, { passId: id });
            res.status(404).json({
                data: {}
            });
        }

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching event details`, {
            error: error.message,
            stack: error.stack,
            passId: id
        });
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const getUserDetailsByPassId = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const rawId = req.query.id as string;
    const requesterId = req.id;

    // Normalize the pass ID: safely decode URL encoding and trim whitespace
    let id = '';
    if (rawId) {
        try {
            id = decodeURIComponent(rawId).trim();
        } catch (e) {
            // If decoding fails (malformed URI), use raw value trimmed
            id = rawId.trim();
            logger.warn(`[${requestId}] Failed to decode pass ID, using raw value`, {
                rawPassId: rawId,
                error: (e as Error).message
            });
        }
    }

    logger.info(`[${requestId}] GET /user-details - Request initiated`, {
        rawPassId: rawId,
        normalizedPassId: id,
        passIdLength: id?.length,
        requesterId,
        timestamp: new Date().toISOString()
    });

    // Validate pass ID format
    if (!id) {
        logger.warn(`[${requestId}] Bad request - Missing pass ID`, { requesterId });
        res.status(400).json({
            status: 'error',
            message: 'Pass ID is required',
            requestId
        });
        return;
    }

    // Pass IDs should start with "Z" (various formats in DB: Zynvo, Zbnvo, etc.)
    if (!id.startsWith('Z')) {
        logger.warn(`[${requestId}] Invalid pass ID format - Must start with 'Z'`, {
            passId: id,
            firstChars: id.substring(0, 10),
            requesterId
        });
        res.status(400).json({
            status: 'invalid',
            message: 'Invalid pass ID format',
            requestId
        });
        return;
    }

    try {
        // Fetch registration details
        logger.debug(`[${requestId}] Querying registration for pass ID`, { 
            passId: id,
            rawId: rawId,
            passIdLength: id.length,
            passIdEncoded: encodeURIComponent(id)
        });

        // Build list of ID variations to try
        const idsToTry = [id];
        if (rawId && rawId !== id) {
            idsToTry.push(rawId.trim());
        }
        // Also try replacing %XX sequences with actual characters using a more lenient approach
        const lenientDecoded = rawId?.replace(/%([0-9A-Fa-f]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
        if (lenientDecoded && !idsToTry.includes(lenientDecoded.trim())) {
            idsToTry.push(lenientDecoded.trim());
        }

        logger.debug(`[${requestId}] Trying pass ID variations`, { idsToTry });

        let registration = null;
        let matchedId = '';
        
        for (const passIdVariation of idsToTry) {
            registration = await prisma.userEvents.findFirst({
                where: { uniquePassId: passIdVariation },
                select: {
                    userId: true,
                    uniquePassId: true,
                    joinedAt: true,
                    paymentStatus: true,
                    event: {
                        select: {
                            EventName: true,
                            clubId: true
                        }
                    },
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            collegeName: true,
                            course: true,
                            year: true,
                            profileAvatar: true
                        }
                    }
                }
            });
            
            if (registration) {
                matchedId = passIdVariation;
                logger.info(`[${requestId}] Found registration with pass ID variation`, { 
                    matchedId, 
                    originalId: id 
                });
                break;
            }
        }

        if (!registration) {
            // Try case-insensitive search as fallback
            const caseInsensitiveRegistration = await prisma.userEvents.findFirst({
                where: {
                    uniquePassId: {
                        equals: id,
                        mode: 'insensitive'
                    }
                },
                select: { uniquePassId: true }
            });

            // Also try a "contains" search to find similar IDs for debugging
            const uuidPart = id.replace(/^[A-Za-z]+\s?/, ''); // Extract UUID part
            const similarRegistrations = uuidPart.length > 10 ? await prisma.userEvents.findMany({
                where: {
                    uniquePassId: {
                        contains: uuidPart.substring(0, 8)
                    }
                },
                select: { uniquePassId: true },
                take: 5
            }) : [];

            if (caseInsensitiveRegistration) {
                logger.warn(`[${requestId}] Pass ID found with different case`, {
                    searchedPassId: id,
                    foundPassId: caseInsensitiveRegistration.uniquePassId,
                    requesterId
                });
            }

            logger.warn(`[${requestId}] Registration not found for pass ID`, {
                passId: id,
                rawId: rawId,
                idsTried: idsToTry,
                passIdHex: Buffer.from(id).toString('hex'),
                requesterId,
                duration: `${Date.now() - startTime}ms`,
                caseInsensitiveMatch: !!caseInsensitiveRegistration,
                similarPassIds: similarRegistrations.map(r => r.uniquePassId)
            });
            res.status(404).json({
                status: 'error',
                message: 'Registration not found',
                data: {},
                requestId
            });
            return;
        }

        logger.debug(`[${requestId}] Registration found`, {
            passId: matchedId || id,
            userId: registration.userId,
            eventName: registration.event?.EventName
        });

        const duration = Date.now() - startTime;
        logger.info(`[${requestId}] User details retrieved successfully`, {
            passId: id,
            userId: registration.user.id,
            eventName: registration.event?.EventName,
            accessType: 'public',
            duration: `${duration}ms`
        });

        res.status(200).json({
            status: 'success',
            data: {
                passId: registration.uniquePassId,
                eventName: registration.event?.EventName ?? '',
                joinedAt: registration.joinedAt,
                paymentStatus: registration.paymentStatus,
                user: registration.user
            },
            requestId
        });
    } catch (error: any) {
        const duration = Date.now() - startTime;
        logger.error(`[${requestId}] Unhandled error in getUserDetailsByPassId`, {
            error: error.message,
            stack: error.stack,
            code: error.code,
            passId: id,
            requesterId,
            duration: `${duration}ms`
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};


export const eventAttendees = async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  const eventId = normalizeParam(req.params.eventId);
  if (!eventId) {
    res.status(400).json({ message: "Event id required" });
    return;
  }

  try {
    const format = req.query.format as string | undefined;
    
    // Fetch custom questions for this event to know the headers/fields
    const customQuestions = await prisma.eventCustomQuestion.findMany({
        where: { eventId },
        orderBy: { sortOrder: 'asc' }
    });

    if (format === "csv") {
        const sinceParam = req.query.since as string | undefined;
        let sinceDate: Date | null = null;

        if (sinceParam) {
            const parsedSince = new Date(sinceParam);
            if (Number.isNaN(parsedSince.getTime())) {
                res.status(400).json({ message: "Invalid since timestamp" });
                return;
            }
            sinceDate = parsedSince;
        }
        
        const eventExists = await prisma.event.findUnique({
            where: { id: eventId },
            select: { id: true }
        });

        if (!eventExists) {
            res.status(404).json({ message: "Event not found" });
            return;
        }

        const [latestRegistration, totalRegistrations] = await prisma.$transaction([
            prisma.userEvents.findFirst({
                where: { eventId },
                orderBy: { joinedAt: "desc" },
                select: { joinedAt: true }
            }),
            prisma.userEvents.count({ where: { eventId } })
        ]);

        const etag = latestRegistration
            ? `${totalRegistrations}-${latestRegistration.joinedAt.getTime()}`
            : `0-${totalRegistrations}`;

        res.setHeader("ETag", etag);
        res.setHeader("Cache-Control", "no-cache");

        if (req.headers["if-none-match"] === etag) {
            res.status(304).end();
            return;
        }

        res.setHeader("Content-Type", "text/csv; charset=utf-8");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="participants_${eventId}.csv"`
        );

        try {
            res.write("\uFEFF");

            const headers = [
                "User ID", "Name", "Email", "College", "Joined At", "Pass ID", "Payment Status", "Payment Screenshot URL",
                ...customQuestions.map(q => q.label)
            ];

            const escapeCsv = (v: any) => {
                if (v == null) return "";
                const s = String(v);
                return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
            };

            res.write(headers.map(escapeCsv).join(",") + "\n");

            const batchSize = 500;
            let lastJoinedAt: Date | null = null;
            const joinedAtFilter = sinceDate ? { gt: sinceDate } : undefined;

            while (true) {
                const batch: Array<{
                    joinedAt: Date;
                    uniquePassId: string | null;
                    paymentStatus: string | null;
                    paymentScreenshotUrl: string | null;
                    user: {
                        id: string | null;
                        name: string | null;
                        email: string | null;
                        collegeName: string | null;
                    };
                }> = await prisma.userEvents.findMany({
                    where: {
                        eventId,
                        ...(joinedAtFilter || lastJoinedAt ? {
                            joinedAt: {
                                ...(joinedAtFilter ?? {}),
                                ...(lastJoinedAt ? { lt: lastJoinedAt } : {})
                            }
                        } : {})
                    },
                    take: batchSize,
                    orderBy: { joinedAt: "desc" },
                    select: {
                        joinedAt: true,
                        uniquePassId: true,
                        paymentStatus: true,
                        paymentScreenshotUrl: true,
                        user: {
                            select: { id: true, name: true, email: true, collegeName: true }
                        }
                    }
                });

                if (batch.length === 0) break;

                // Fetch answers for this batch
                const userIds = batch.map((p: typeof batch[0]) => p.user.id).filter((id: string | null) => id) as string[];
                const answers = await prisma.registrationAnswer.findMany({
                    where: { eventId, userId: { in: userIds } }
                });
                const answersMap = answers.reduce((acc: any, ans) => {
                    if (!acc[ans.userId]) acc[ans.userId] = {};
                    acc[ans.userId][ans.questionId] = ans.answer;
                    return acc;
                }, {});

                for (const p of batch) {
                    const u = p.user;
                    const userAnswers = u.id ? answersMap[u.id] || {} : {};
                    
                    const row = [
                        u.id ?? "",
                        u.name ?? "",
                        u.email ?? "",
                        u.collegeName ?? "",
                        p.joinedAt.toISOString(),
                        p.uniquePassId ?? "",
                        p.paymentStatus ?? "CONFIRMED",
                        p.paymentScreenshotUrl ?? "",
                        ...customQuestions.map(q => userAnswers[q.id] || "")
                    ];

                    res.write(row.map(escapeCsv).join(",") + "\n");
                }

                lastJoinedAt = batch[batch.length - 1].joinedAt;
            }

            res.end();
        } catch (streamError: any) {
            logger.error(`[${requestId}] Error during CSV streaming`, {
                requestId, eventId, error: streamError.message, stack: streamError.stack
            });
            if (!res.writableEnded) res.end();
        }
        return;
    }

    // NORMAL PAGINATED JSON
    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);
    const skip = (page - 1) * limit;

    const [participants, total] = await Promise.all([
        prisma.userEvents.findMany({
            where: { eventId },
            take: limit,
            skip,
            orderBy: { joinedAt: "desc" },
            select: {
                joinedAt: true,
                uniquePassId: true,
                user: {
                    select: { id: true, name: true, email: true, collegeName: true, course: true, year: true }
                }
            },
        }),
        prisma.userEvents.count({ where: { eventId } })
    ]);

    // Fetch answers
    const userIds = participants.map(p => p.user?.id).filter(id => id) as string[];
    const answers = await prisma.registrationAnswer.findMany({
        where: { eventId, userId: { in: userIds } },
        include: { question: { select: { label: true } } }
    });
    
    const answersMap = answers.reduce((acc: any, ans) => {
        if (!acc[ans.userId]) acc[ans.userId] = [];
        acc[ans.userId].push({ label: ans.question.label, answer: ans.answer });
        return acc;
    }, {});

    res.status(200).json({
        msg: "participants fetched",
        data: participants.map(p => ({
            joinedAt: p.joinedAt,
            passId: p.uniquePassId,
            user: p.user,
            customAnswers: p.user?.id ? answersMap[p.user.id] || [] : []
        })),
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    });

  } catch (error: any) {
      logger.error(`[${requestId}] Error fetching event attendees`, {
          error: error.message, stack: error.stack, eventId
      });
      sendErrorResponse(res, requestId, 'Internal server error', 500);
  }
};

export const addToGallery = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const userId = req.id;

    try {
        const { imageUrl, caption } = req.body;

        if (!imageUrl) {
            sendErrorResponse(res, requestId, 'Image URL is required', 400);
            return;
        }

        // Verify event exists
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        // Verify user is the club head
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            sendErrorResponse(res, requestId, 'User not found', 404);
            return;
        }

        const club = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                founderEmail: user.email
            }
        });

        if (!club) {
            sendErrorResponse(res, requestId, 'Access denied. Only club heads can add gallery images', 403);
            return;
        }

        const galleryItem = await prisma.eventGallery.create({
            data: {
                imageUrl,
                caption: caption || '',
                eventId
            }
        });

        logger.info(`[${requestId}] Gallery item added successfully`, {
            galleryId: galleryItem.id,
            eventId,
            userId
        });

        res.status(201).json({
            msg: 'Image added to gallery',
            data: galleryItem
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error adding to gallery`, {
            error: error.message,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const getEventGallery = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        const galleryItems = await prisma.eventGallery.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            msg: 'Gallery fetched successfully',
            data: galleryItems
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching gallery`, {
            error: error.message,
            eventId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const updateGalleryItem = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const galleryId = req.query.galleryId as string;
    const userId = req.id;

    try {
        if (!galleryId) {
            sendErrorResponse(res, requestId, 'Gallery ID is required in query parameters', 400);
            return;
        }

        const { imageUrl, caption } = req.body;

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        // Verify user is the club head
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            sendErrorResponse(res, requestId, 'User not found', 404);
            return;
        }

        const club = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                founderEmail: user.email
            }
        });

        if (!club) {
            sendErrorResponse(res, requestId, 'Access denied. Only club heads can update gallery images', 403);
            return;
        }

        const existingItem = await prisma.eventGallery.findFirst({
            where: {
                id: galleryId,
                eventId
            }
        });

        if (!existingItem) {
            sendErrorResponse(res, requestId, 'Gallery item not found for this event', 404);
            return;
        }

        const updatedItem = await prisma.eventGallery.update({
            where: { id: galleryId },
            data: {
                imageUrl: imageUrl ?? existingItem.imageUrl,
                caption: caption !== undefined ? caption : existingItem.caption
            }
        });

        logger.info(`[${requestId}] Gallery item updated successfully`, {
            galleryId,
            eventId,
            userId
        });

        res.status(200).json({
            msg: 'Gallery item updated',
            data: updatedItem
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error updating gallery item`, {
            error: error.message,
            galleryId,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const deleteGalleryItem = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const galleryId = req.query.galleryId as string;
    const userId = req.id;

    try {
        if (!galleryId) {
            sendErrorResponse(res, requestId, 'Gallery ID is required in query parameters', 400);
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        // Verify user is the club head
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            sendErrorResponse(res, requestId, 'User not found', 404);
            return;
        }

        const club = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                founderEmail: user.email
            }
        });

        if (!club) {
            sendErrorResponse(res, requestId, 'Access denied. Only club heads can delete gallery images', 403);
            return;
        }

        const existingItem = await prisma.eventGallery.findFirst({
            where: {
                id: galleryId,
                eventId
            }
        });

        if (!existingItem) {
            sendErrorResponse(res, requestId, 'Gallery item not found for this event', 404);
            return;
        }

        await prisma.eventGallery.delete({
            where: { id: galleryId }
        });

        logger.info(`[${requestId}] Gallery item deleted successfully`, {
            galleryId,
            eventId,
            userId
        });

        res.status(200).json({
            msg: 'Gallery item deleted successfully'
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error deleting gallery item`, {
            error: error.message,
            galleryId,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const verifierUserId = req.id; // club head userId
    const { eventId, registrationId, approvalStatus } = req.body;

    logger.info(`[${requestId}] POST /verifyPayment - Start`, {
        verifierUserId,
        eventId,
        registrationId,
        approvalStatus
    });

    // 1️⃣ Auth check
    if (!verifierUserId) {
        logger.warn(`[${requestId}] Unauthorized user`);
        sendErrorResponse(res, requestId, 'Unauthorized', 401);
        return;
    }

    try {
        // 2️⃣ Fetch verifier (club head)
        const verifier = await prisma.user.findUnique({
            where: { id: verifierUserId },
            select: { email: true }
        });

        if (!verifier) {
            sendErrorResponse(res, requestId, 'User not found', 404);
            return;
        }

        // 3️⃣ Fetch event
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, isPaid: true }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        if (!event.isPaid) {
            sendErrorResponse(res, requestId, 'This is not a paid event', 400);
            return;
        }

        // 4️⃣ Verify club head permission
        const club = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { founderEmail: true }
        });

        if (!club || club.founderEmail !== verifier.email) {
            sendErrorResponse(res, requestId, 'Only club head can verify payments', 403);
            return;
        }

        // 5️⃣ Validate approval status
        const status = approvalStatus?.toUpperCase();
        const validStatuses = ['APPROVED', 'REJECTED'];

        if (!validStatuses.includes(status)) {
            sendErrorResponse(
                res,
                requestId,
                'Invalid approval status. Must be APPROVED or REJECTED',
                400
            );
            return;
        }

        // 6️⃣ Fetch registration using uniquePassId
        const registration = await prisma.userEvents.findFirst({
            where: { uniquePassId: registrationId }
        });

        if (!registration || registration.eventId !== eventId) {
            sendErrorResponse(res, requestId, 'Registration not found for this event', 404);
            return;
        }

        // 7️⃣ Prevent double verification — a payment that's already been decided
        // (approved OR rejected) must not be silently overwritten.
        if (registration.paymentStatus === 'APPROVED' || registration.paymentStatus === 'REJECTED') {
            sendErrorResponse(res, requestId, `Payment already ${registration.paymentStatus.toLowerCase()}`, 409);
            return;
        }

        // 8️⃣ Update payment status
        await prisma.userEvents.update({
            where: {
                userId_eventId: {
                    userId: registration.userId,
                    eventId: eventId
                }
            },
            data: {
                paymentStatus: status,
                paymentVerifiedAt: new Date()
            }
        });

        logger.info(`[${requestId}] Payment ${status}`, {
            eventId,
            registrationId
        });

        res.status(200).json({
            message: `Payment ${status.toLowerCase()} successfully`,
            status
        });

    } catch (error: any) {
        logger.error(`[${requestId}] verifyPayment failed`, {
            error: error.message,
            stack: error.stack
        });

        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const checkEventDates = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { eventStartDate, eventEndDate, applicationStartDate, applicationEndDate } = req.body;

    logger.info(`[${requestId}] POST /checkEventDates - Validating event dates`, {
        eventStartDate,
        eventEndDate,
        applicationStartDate,
        applicationEndDate
    });

    try {
        const validationResults: {
            isValid: boolean;
            errors: string[];
            warnings: string[];
            info: string[];
            sameDayEventsAllowed: boolean;
            existingEvents?: any[];
        } = {
            isValid: true,
            errors: [],
            warnings: [],
            info: [],
            // Multiple events on the same day are explicitly allowed; overlap is informational only.
            sameDayEventsAllowed: true
        };

        const now = new Date();
        
        // Parse dates
        const startDate = eventStartDate ? new Date(eventStartDate) : null;
        const endDate = eventEndDate ? new Date(eventEndDate) : null;
        const appStartDate = applicationStartDate ? new Date(applicationStartDate) : null;
        const appEndDate = applicationEndDate ? new Date(applicationEndDate) : null;

        // Validate event dates
        if (startDate && endDate) {
            if (startDate >= endDate) {
                validationResults.isValid = false;
                validationResults.errors.push('Event start date must be before event end date');
            }

            if (startDate < now) {
                validationResults.warnings.push('Event start date is in the past');
            }

            // Check for existing events on the same date range
            const existingEvents = await prisma.event.findMany({
                where: {
                    OR: [
                        {
                            startDate: { lte: startDate.toISOString() },
                            endDate: { gte: startDate.toISOString() }
                        },
                        {
                            startDate: { lte: endDate.toISOString() },
                            endDate: { gte: endDate.toISOString() }
                        },
                        {
                            startDate: { gte: startDate.toISOString() },
                            endDate: { lte: endDate.toISOString() }
                        }
                    ]
                },
                select: {
                    id: true,
                    EventName: true,
                    startDate: true,
                    endDate: true,
                    clubName: true,
                    Venue: true
                },
                take: 10
            });

            if (existingEvents.length > 0) {
                // Purely informational: creating another event on the same day/period is allowed
                // and must not block submission. Do NOT flip isValid or add a blocking warning.
                validationResults.existingEvents = existingEvents;
                validationResults.info.push(`${existingEvents.length} other event(s) exist during the same period. This does not prevent creating your event.`);
            }
        }

        // Validate application dates
        if (appStartDate && appEndDate) {
            if (appStartDate >= appEndDate) {
                validationResults.isValid = false;
                validationResults.errors.push('Application start date must be before application end date');
            }

            if (appEndDate < now) {
                validationResults.warnings.push('Application end date is in the past');
            }
        }

        // Check application dates vs event dates
        if (appStartDate && startDate && appStartDate >= startDate) {
            validationResults.warnings.push('Application start date is on or after event start date');
        }

        if (appEndDate && startDate && appEndDate > startDate) {
            validationResults.warnings.push('Application end date is after event start date');
        }

        logger.info(`[${requestId}] Event date validation completed`, {
            isValid: validationResults.isValid,
            errorsCount: validationResults.errors.length,
            warningsCount: validationResults.warnings.length,
            existingEventsCount: validationResults.existingEvents?.length || 0
        });

        res.status(200).json({
            msg: 'Event dates validated',
            ...validationResults
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error validating event dates`, {
            error: error.message,
            stack: error.stack
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const getPaidEventPayments = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const eventId = normalizeParam(req.params.eventId);

    logger.info(`[${requestId}] GET /paidEventPayments/:eventId - Fetching payments`, {
        userId,
        eventId
    });

    if (!userId) {
        logger.warn(`[${requestId}] Invalid user ID`);
        sendErrorResponse(res, requestId, 'Invalid user', 402);
        return;
    }

    try {
        // Verify user is club head
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            sendErrorResponse(res, requestId, 'User not found', 404);
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, isPaid: true }
        });

        if (!event) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        if (!event.isPaid) {
            logger.warn(`[${requestId}] Event is not a paid event`, { eventId });
            sendErrorResponse(res, requestId, 'This is not a paid event', 400);
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { founderEmail: true }
        });

        if (!club || club.founderEmail !== user.email) {
            logger.warn(`[${requestId}] Unauthorized - user is not club head`, {
                userId,
                clubId: event.clubId
            });
            sendErrorResponse(res, requestId, 'Only club head can view payments', 403);
            return;
        }

        // Fetch all registrations for event with payment screenshots
        const registrations = await prisma.userEvents.findMany({
            where: { eventId: eventId },
            select: {
                userId: true,
                uniquePassId: true,
                paymentStatus: true,
                paymentScreenshotUrl: true,
                paymentVerifiedAt: true,
                joinedAt: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        collegeName: true
                    }
                }
            },
            orderBy: { joinedAt: 'desc' }
        });

        logger.info(`[${requestId}] Fetched ${registrations.length} payment records`, {
            eventId,
            userId
        });

        res.status(200).json({
            msg: 'Payments fetched successfully',
            total: registrations.length,
            payments: registrations
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching payments`, {
            error: error.message,
            stack: error.stack,
            userId,
            eventId
        });
        console.log(error);
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

// JUDGE ROUTES HANDLERS
export const addJudge = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const userId = req.id;
    const { name, description, achievement } = req.body;

    try {
        if (!name || !description || !achievement) {
            sendErrorResponse(res, requestId, 'Name, description, and achievement are required', 400);
            return;
        }

        const judge = await prisma.judges.create({
            data: {
                name,
                description,
                achievement,
                eventId
            }
        });

        logger.info(`[${requestId}] Judge added successfully`, {
            judgeId: judge.id,
            eventId,
            userId
        });

        res.status(201).json({
            msg: 'Judge added successfully',
            data: judge
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error adding judge`, {
            error: error.message,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const getJudges = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        const judges = await prisma.judges.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            msg: 'Judges fetched successfully',
            data: judges
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching judges`, {
            error: error.message,
            eventId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const updateJudge = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const judgeId = req.params.judgeId as string;
    const userId = req.id;
    const { name, description, achievement } = req.body;

    try {
        if (!judgeId) {
            sendErrorResponse(res, requestId, 'Judge ID is required', 400);
            return;
        }

        const existingJudge = await prisma.judges.findFirst({
            where: {
                id: judgeId,
                eventId
            }
        });

        if (!existingJudge) {
            sendErrorResponse(res, requestId, 'Judge not found for this event', 404);
            return;
        }

        const updatedJudge = await prisma.judges.update({
            where: { id: judgeId },
            data: {
                name: name ?? existingJudge.name,
                description: description ?? existingJudge.description,
                achievement: achievement ?? existingJudge.achievement
            }
        });

        logger.info(`[${requestId}] Judge updated successfully`, {
            judgeId,
            eventId,
            userId
        });

        res.status(200).json({
            msg: 'Judge updated successfully',
            data: updatedJudge
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error updating judge`, {
            error: error.message,
            judgeId,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const deleteJudge = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.eventId as string;
    const judgeId = req.params.judgeId as string;
    const userId = req.id;

    try {
        if (!judgeId) {
            sendErrorResponse(res, requestId, 'Judge ID is required', 400);
            return;
        }

        const existingJudge = await prisma.judges.findFirst({
            where: {
                id: judgeId,
                eventId
            }
        });

        if (!existingJudge) {
            sendErrorResponse(res, requestId, 'Judge not found for this event', 404);
            return;
        }

        await prisma.judges.delete({
            where: { id: judgeId }
        });

        logger.info(`[${requestId}] Judge deleted successfully`, {
            judgeId,
            eventId,
            userId
        });

        res.status(200).json({
            msg: 'Judge deleted successfully'
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Error deleting judge`, {
            error: error.message,
            judgeId,
            eventId,
            userId
        });
        sendErrorResponse(res, requestId, 'Internal server error', 500);
    }
};

export const getEventSchedule = async (req: Request, res: Response): Promise<void> => {
    const eventId = normalizeParam(req.params.eventId);

    if (!eventId) {
        res.status(400).json({ msg: 'Event id required' });
        return;
    }

    try {
        const days = await prisma.scheduleDay.findMany({
            where: { eventId },
            include: {
                sessions: true
            },
            orderBy: {
                day: 'asc'
            }
        });

        if (days.length === 0) {
            res.status(200).json({
                response: [
                    {
                        id: 'default-day-1',
                        day: 1,
                        date: 'Day 1',
                        name: 'Day 1',
                        sessions: []
                    }
                ]
            });
            return;
        }

        res.status(200).json({
            response: days
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const addEventSession = async (req: Request, res: Response): Promise<void> => {
    const eventId = normalizeParam(req.params.eventId);
    const { day, time, title, description, location, speakers } = req.body;
    const userId = req.id;

    if (!eventId) {
        res.status(400).json({ msg: 'Event id required' });
        return;
    }

    const dayNum = Number(day);
    if (!Number.isInteger(dayNum) || dayNum < 1) {
        res.status(400).json({ msg: 'day must be a positive integer' });
        return;
    }
    if (!time || !title || !location) {
        res.status(400).json({ msg: 'time, title and location are required' });
        return;
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, createdById: true }
        });

        if (!event) {
            res.status(404).json({ msg: 'Event not found' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const eventClub = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { 
                id: true,
                founderEmail: true,
                coremember1: true,
                coremember2: true,
                coremember3: true
            }
        });

        const isClubHead = eventClub && eventClub.founderEmail === user.email;
        const isCoreMember = eventClub && (
            eventClub.coremember1 === user.email || 
            eventClub.coremember2 === user.email || 
            eventClub.coremember3 === user.email
        );
        const isEventCreator = event.createdById === userId;

        const isAuthorized = isClubHead || isCoreMember || isEventCreator;

        if (!isAuthorized) {
            res.status(403).json({ msg: 'Access denied. Only club heads, core members, or event creators can manage this event.' });
            return;
        }

        let scheduleDay = await prisma.scheduleDay.findUnique({
            where: {
                eventId_day: {
                    eventId,
                    day: dayNum
                }
            }
        });

        if (!scheduleDay) {
            scheduleDay = await prisma.scheduleDay.create({
                data: {
                    eventId,
                    day: dayNum,
                    date: `Day ${dayNum}`,
                    name: `Day ${dayNum}`
                }
            });
        }

        const session = await prisma.scheduleSession.create({
            data: {
                scheduleDayId: scheduleDay.id,
                time,
                title,
                description: description || '',
                location,
                speakers: speakers || []
            }
        });

        res.status(201).json({
            msg: 'Session added',
            response: session
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const deleteEventSession = async (req: Request, res: Response): Promise<void> => {
    const eventId = normalizeParam(req.params.eventId);
    const sessionId = normalizeParam(req.params.sessionId);
    const userId = req.id;

    if (!eventId || !sessionId) {
        res.status(400).json({ msg: 'Event id and session id are required' });
        return;
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, createdById: true }
        });

        if (!event) {
            res.status(404).json({ msg: 'Event not found' });
            return;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const eventClub = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { 
                id: true,
                founderEmail: true,
                coremember1: true,
                coremember2: true,
                coremember3: true
            }
        });

        const isClubHead = eventClub && eventClub.founderEmail === user.email;
        const isCoreMember = eventClub && (
            eventClub.coremember1 === user.email || 
            eventClub.coremember2 === user.email || 
            eventClub.coremember3 === user.email
        );
        const isEventCreator = event.createdById === userId;

        const isAuthorized = isClubHead || isCoreMember || isEventCreator;

        if (!isAuthorized) {
            res.status(403).json({ msg: 'Access denied. Only club heads, core members, or event creators can manage this event.' });
            return;
        }

        await prisma.scheduleSession.delete({
            where: { id: sessionId }
        });

        res.status(200).json({ msg: 'Session deleted' });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const updateEvent = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    try {
        // Use only req.params.id (route is /event/:id, not /:eventId)
        const eventId = normalizeParam(req.params.id);
        if (!eventId) {
            res.status(400).json({ msg: 'Event ID is required' });
            return;
        }

        const userId = req.id;
        
        const event = await prisma.event.findUnique({ 
            where: { id: eventId },
            select: { id: true, clubId: true, createdById: true }
        });
        if (!event) {
            res.status(404).json({ msg: 'Event not found' });
            return;
        }

        // Verify ownership: only club head, core member or event creator can update
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const eventClub = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: {
                founderEmail: true,
                coremember1: true,
                coremember2: true,
                coremember3: true
            }
        });

        const isClubHead = eventClub && eventClub.founderEmail === user.email;
        const isCoreMember = eventClub && (
            eventClub.coremember1 === user.email ||
            eventClub.coremember2 === user.email ||
            eventClub.coremember3 === user.email
        );
        const isEventCreator = event.createdById === userId;

        if (!isClubHead && !isCoreMember && !isEventCreator) {
            res.status(403).json({ msg: 'Access denied. Only club heads, core members, or event creators can update this event.' });
            return;
        }
        
        // Explicitly define which fields can be updated (allowlist approach)
        const allowedFields = [
            'EventName', 'description', 'tagline', 'EventMode', 'EventType',
            'EventUrl', 'Venue', 'TeamSize', 'prizes', 'startDate', 'endDate',
            'applicationStartDate', 'applicationEndDate', 'collegeStudentsOnly',
            'contactEmail', 'contactPhone', 'participationFee', 'posterUrl',
            'link1', 'link2', 'link3', 'whatsappLink', 'qrCodeUrl', 'maxParticipants',
            'eventHeaderImage', 'Form', 'Fees'
        ];

        // Extract only allowed fields from request body
        const updateData: Record<string, any> = {};
        for (const field of allowedFields) {
            if (field in req.body) {
                updateData[field] = req.body[field];
            }
        }

        // Reject if no valid fields provided
        if (Object.keys(updateData).length === 0 && !('customQuestions' in req.body)) {
            res.status(400).json({ msg: 'No valid fields provided for update' });
            return;
        }

        if ('customQuestions' in req.body && Array.isArray(req.body.customQuestions)) {
            updateData.customQuestions = {
                deleteMany: {},
                create: req.body.customQuestions.map((q: any) => ({
                    label: q.label,
                    type: q.type || 'text',
                    options: q.options || [],
                    required: q.required || false,
                    sortOrder: q.sortOrder || 0
                }))
            };
        }
        
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData,
            select: eventSelectBase
        });

        logger.info(`[${requestId}] Event updated successfully`, { eventId, userId });
        // Return the fresh event (incl. application start/end dates) so the edit form
        // can repopulate without a second fetch.
        res.status(200).json({
            msg: 'Event updated successfully',
            response: mapEventFees(updatedEvent)
        });
    } catch (error: any) {
        logger.error(`[${requestId}] Error updating event`, { error: error.message, stack: error.stack });
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    try {
        // Use only req.params.id (route is /event/:id, not /:eventId)
        const eventId = normalizeParam(req.params.id);
        if (!eventId) {
            res.status(400).json({ msg: 'Event ID is required' });
            return;
        }
        
        const userId = req.id;
        
        const event = await prisma.event.findUnique({ 
            where: { id: eventId },
            select: { id: true, clubId: true, createdById: true }
        });
        if (!event) {
            res.status(404).json({ msg: 'Event not found' });
            return;
        }

        // Verify ownership: only club head, core member or event creator can delete
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const eventClub = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: {
                founderEmail: true,
                coremember1: true,
                coremember2: true,
                coremember3: true
            }
        });

        const isClubHead = eventClub && eventClub.founderEmail === user.email;
        const isCoreMember = eventClub && (
            eventClub.coremember1 === user.email ||
            eventClub.coremember2 === user.email ||
            eventClub.coremember3 === user.email
        );
        const isEventCreator = event.createdById === userId;

        if (!isClubHead && !isCoreMember && !isEventCreator) {
            res.status(403).json({ msg: 'Access denied. Only club heads, core members, or event creators can delete this event.' });
            return;
        }

        logger.info(`[${requestId}] Deleting event`, { eventId, userId });

        // Delete dependent records first to avoid foreign key constraints
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
            prisma.event.delete({ where: { id: eventId } })
        ]);

        logger.info(`[${requestId}] Event deleted successfully`, { eventId, userId });
        res.status(200).json({ msg: 'Event deleted successfully' });
    } catch (error: any) {
        logger.error(`[${requestId}] Error deleting event`, { error: error.message, stack: error.stack });
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }
};


// event queue for accepting or rejecting event registrations in bulk (for large events with many registrations)


export const getEventQueue = async (req: Request, res: Response): Promise<void> => {

    const userId = req.id;
    const eventId = req.params.eventId as string;

    if (!userId) {
        res.status(401).json({ msg: 'Unauthorized' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true }
        });

        if (!event) {
            res.status(404).json({ msg: 'Event not found' });
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: {
                id: event.clubId,
            },
            select: {
                founderEmail: true,
                coremember1: true,
                coremember2: true,
                coremember3: true
            }
        });

        if (!club) {
            res.status(404).json({ msg: 'Club not found' });
            return;
        }

        if (club.founderEmail !== user.email && club.coremember1 !== user.email && club.coremember2 !== user.email && club.coremember3 !== user.email) {
            res.status(403).json({ msg: 'Access denied. Only club heads or core members can view the event queue' });
            return;
        }

        const queueEntries = await prisma.eventQueue.findMany({
            where: { eventId },
            orderBy: { createdAt: 'asc' }
        });

        const registrationAnswers = await prisma.registrationAnswer.findMany({
            where : {
                eventId : eventId,
                userId: { in: queueEntries.map(q => q.userId) }
            }, 
            select : {
                question : true,
                answer : true,
                userId : true
            }
        })

        const registrationInfo = await prisma.userEvents.findMany({
            where: {
                eventId,
                userId: { in: queueEntries.map(q => q.userId) }
            },
            select: {
                userId: true,
                uniquePassId: true,
                paymentStatus: true,
                paymentScreenshotUrl: true,
                paymentVerifiedAt: true,
                joinedAt: true,
                user: {
                    select: {
                        name: true,
                        email: true,
                        collegeName: true
                    }
                }
            }
        });
        
        const queueEntriesWithDetails = queueEntries.map(entry => {
            const registration = registrationInfo.find(r => r.userId === entry.userId);
            return {
                ...entry,
                registration,
                registrationAnswers: registrationAnswers.filter(a => a.userId === entry.userId) 
            };
        });

        res.status(200).json({
            msg: 'Event queue fetched successfully',
            total: queueEntries.length,
            queue: queueEntriesWithDetails
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ msg: 'Internal server error' });
    }   

}

export const addToEventQueue = async (req: Request, res: Response, eventId: string): Promise<boolean> => { 

    const requestId = generateRequestId();
    const userId = req.id;

    logger.info(`[${requestId}] Adding registration to event queue`, {
        userId,
        eventId
    });
    
    if (!userId) {
        res.status(401).json({ msg: 'Unauthorized' });
        return false;
    }

    const addToEventQueue = await prisma.eventQueue.create({
        data: {
            eventId,
            userId
        }
    });

    logger.info(`[${requestId}] Registration added to event queue`, {
        userId,
        eventId,
        queueEntryId: addToEventQueue.id
    });

    if (!addToEventQueue) {
        logger.error(`[${requestId}] Failed to add registration to event queue`, {
            userId,
            eventId
        });
        res.status(500).json({ msg: 'Failed to add registration to event queue' });
        return false;
    } else {
        logger.info(`[${requestId}] Registration successfully added to event queue`, {
            userId,
            eventId,
            queueEntryId: addToEventQueue.id
        });
        return true;
    }
}

export const acceptUserfromEventQueue = async (req: Request, res: Response): Promise<void> => { 
    const requestId = generateRequestId();
    const { userId , accepted } = req.body;
    const eventId = req.params.eventId as string;

    logger.info(`[${requestId}] Accepting user from event queue`, {
        userId,
        eventId
    });

    if (!userId) {
        res.status(400).json({ msg: 'User ID is required' });
        return;
    }

    try {
        // Update registration status to approved
        await prisma.userEvents.updateMany({
            where: {
                eventId,
                userId
            },
            data: {
                approvalStatus: accepted ? 'approved' : 'rejected'
            }
        });

        // Remove from event queue
        await prisma.eventQueue.deleteMany({
            where: {
                eventId,
                userId
            }
        });

        logger.info(`[${requestId}] User accepted from event queue`, {
            userId,
            eventId
        });

        res.status(200).json({ msg: 'User accepted successfully' });
    } catch (error: any) {
        console.error(error);
        logger.error(`[${requestId}] Error accepting user from event queue`, {
            error: error.message,
            stack: error.stack,
            userId,
            eventId
        });
        res.status(500).json({ msg: 'Internal server error' });
    }
}