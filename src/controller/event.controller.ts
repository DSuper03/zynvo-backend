import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { EventSchema } from '../types/formtypes';
import { generateRequestId, generateUUID, sendErrorResponse } from '../utils/helper';
import { Prisma } from '../generated/prisma/client';

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
    link1 : true,
    link2 : true,
    link3 : true,
    whatsappLink: true,
    isPaid: true,
    qrCodeUrl: true
} as const;

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
        coreTeamOnly
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
                userEmail: user.email
            });
            sendErrorResponse(res, requestId, 'invalid president identification', 403);
            return;
        }

        if (university !== club.collegeName) {
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

        const response = await prisma.event.create({
            data: {
                EventName: parsedData.data.eventName,
                description: parsedData.data.description || '',
                tagline: parsedData.data.tagline || '',
                EventMode: eventMode,
                EventType: eventType,
                EventUrl: eventWebsite || '',
                Venue: venue,
                TeamSize: parseInt(maxTeamSize),
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
                Fees : parsedData.data.paymentAmount || parsedData.data.fees || "none",
                link1 : parsedData.data.link1 ? parsedData.data.link1 : null,
                link2 : parsedData.data.link2 ? parsedData.data.link2 : null,
                link3 : parsedData.data.link3 ? parsedData.data.link3 : null,
                whatsappLink: parsedData.data.whatsappLink || "",
                isPaid: parsedData.data.isPaidEvent ?? parsedData.data.isPaid ?? false,
                qrCodeUrl: parsedData.data.paymentQRCode || parsedData.data.qrCodeUrl || null
            },
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
        sendErrorResponse(res, requestId, 'internal server error', 500);
    }
};

export const getEventById = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const eventId = req.params.id;

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

        res.status(200).json({
            msg: 'event found',
            response,
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
    const clubId = req.params.id;

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

        res.status(200).json({
            msg: 'fetched',
            event: events,
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
        const page = parseInt(req.query.page as string) || 1;
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

        res.status(200).json({
            msg: 'found',
            response: response,
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

export const registerForEvent = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { eventId, paymentScreenshotUrl } = req.body;

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

        // Check if event is paid
        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { isPaid: true }
        });

        if (!event) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            sendErrorResponse(res, requestId, 'Event not found', 404);
            return;
        }

        // If event is paid, payment screenshot is required
        if (event.isPaid && !paymentScreenshotUrl) {
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

        const response = await prisma.userEvents.create({
            data: {
                userId: userId,
                eventId: eventId,
                uniquePassId: generateUUID(),
                paymentScreenshotUrl: paymentScreenshotUrl || null,
                paymentStatus: event.isPaid ? 'PENDING' : 'CONFIRMED'
            },
            select: {
                uniquePassId: true,
                paymentStatus: true
            }
        });

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
            requiresPaymentVerification: event.isPaid
        });

    } catch (error: any) {
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

        const club = await prisma.clubs.findUnique({
            where: { founderEmail: user.email },
            select: {
                name: true,
                id: true,
            },
        });

        if (!club) {
            logger.warn(`[${requestId}] User is not a club president`, {
                userId,
                userEmail: user.email
            });
            sendErrorResponse(res, requestId, 'invalid president identification', 402);
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
                    }
                },
                user: {
                    select: {
                        profileAvatar: true
                    }
                }
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
                    profilePic: findUser.user.profileAvatar
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


export const eventAttendees = async (req: Request, res: Response) => {
  const requestId = generateRequestId();
  const eventId = req.params.eventId;
  if (!eventId) {
    res.status(400).json({ message: "Event id required" });
    return;
  }

  try {
    const format = req.query.format as string | undefined;
    if (format === "csv") {
      // Pre-validate that the event exists before starting the stream
      const eventExists = await prisma.event.findUnique({
        where: { id: eventId },
        select: { id: true }
      });

      if (!eventExists) {
        res.status(404).json({ message: "Event not found" });
        return;
      }

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="participants_${eventId}.csv"`
      );

      try {
        // UTF-8 BOM (Excel compatibility)
        res.write("\uFEFF");

      const headers = [
        "User ID",
        "Name",
        "Email",
        "College",
        "Course",
        "Year",
        "Joined At",
        "Pass ID",
        "Payment Status",
        "Payment Screenshot URL"
      ];

        const escapeCsv = (v: any) => {
          if (v == null) return "";
          const s = String(v);
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        };

        // write header
        res.write(headers.map(escapeCsv).join(",") + "\n");

        const batchSize = 500;
        let lastJoinedAt: Date | null = null;

      while (true) {
        const batch: Prisma.userEventsGetPayload<{
          select: {
            joinedAt: true;
            uniquePassId: true;
            paymentStatus: true;
            paymentScreenshotUrl: true;
            user: {
              select: {
                id: true;
                name: true;
                email: true;
                collegeName: true;
                course: true;
                year: true;
              };
            };
          };
        }>[] = await prisma.userEvents.findMany({
          where: {
            eventId,
            ...(lastJoinedAt && { joinedAt: { lt: lastJoinedAt } })
          },
          take: batchSize,
          orderBy: { joinedAt: "desc" },
          select: {
            joinedAt: true,
            uniquePassId: true,
            paymentStatus: true,
            paymentScreenshotUrl: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                collegeName: true,
                course: true,
                year: true
              }
            }
          }
        });


          if (batch.length === 0) break;

        for (const p of batch) {
          const u = p.user;

          const row = [
            u.id ?? "",
            u.name ?? "",
            u.email ?? "",
            u.collegeName ?? "",
            u.course ?? "",
            u.year ?? "",
            p.joinedAt.toISOString(),
            p.uniquePassId ?? "",
            p.paymentStatus ?? "CONFIRMED",
            p.paymentScreenshotUrl ?? ""
          ];

            res.write(row.map(escapeCsv).join(",") + "\n");
          }

          lastJoinedAt = batch[batch.length - 1].joinedAt;
        }

        res.end();
      } catch (streamError: any) {
        // Error during streaming - headers already sent, log the error
        logger.error(`[${requestId}] Error during CSV streaming`, {
          requestId,
          eventId,
          error: streamError.message,
          stack: streamError.stack
        });
        // Attempt to end the response if possible
        if (!res.writableEnded) {
          res.end();
        }
      }
      return;
    }

      // NORMAL PAGINATED JSON

    const page = Math.max(parseInt(req.query.page as string) || 1, 1);
    const rawLimit = parseInt(req.query.limit as string);
    const MAX_LIMIT = 100;
    const limit = Math.min(Math.max(rawLimit || 50, 1), MAX_LIMIT);
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
            select: {
              id: true,
              name: true,
              email: true,
              
              collegeName: true,
              course: true,
              year: true,
              
            }
          }
        }
      }),
      prisma.userEvents.count({ where: { eventId } })
    ]);

    res.status(200).json({
      msg: "participants fetched",
      data: participants.map(p => ({
        joinedAt: p.joinedAt,
        passId: p.uniquePassId,
        user: p.user
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "internal server error" });
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

        // 7️⃣ Prevent double verification
        if (registration.paymentStatus === 'APPROVED') {
            sendErrorResponse(res, requestId, 'Payment already approved', 409);
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

export const getPaidEventPayments = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const eventId = req.params.eventId;

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

        // Fetch all registrations for the event with payment screenshots
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