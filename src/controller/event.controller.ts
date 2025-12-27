import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { EventSchema } from '../types/formtypes';
import { generateRequestId, generateUUID, sendErrorResponse } from '../utils/helper';

const eventSelectBase = {
    id: true,
    EventName: true,
    description: true,
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
    university: true,
    collegeStudentsOnly: true,
    contactEmail: true,
    contactPhone: true,
    participationFee: true,
    posterUrl: true,
    createdAt: true,
    link1 : true,
    link2 : true,
    link3 : true
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
        link3
    } = req.body;

    const userId = req.id;

    logger.info(`[${requestId}] POST /event - Starting event creation`, {
        userId,
        eventName,
        university
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
                university: club.collegeName,
                collegeStudentsOnly: collegeStudentsOnly,
                contactEmail: contactEmail,
                contactPhone: contactPhone ,
                participationFee: noParticipationFee,
                posterUrl: image,
                eventHeaderImage : image,
                Form : form ? form : "none",
                Fees : fees ? fees : "none",
                link1 : link1 ? link1 : null,
                link2 : link2 ? link2 : null,
                link3 : link3 ? link3 : null
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
    const { eventId } = req.body;

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

        logger.info(`[${requestId}] Registering user for event`, {
            userId,
            eventId
        });

        const response = await prisma.userEvents.create({
            data: {
                userId: userId,
                eventId: eventId,
                uniquePassId: generateUUID(),
            },
            select: {
                uniquePassId: true
            }
        });

       

        logger.info(`[${requestId}] User registered successfully`, {
            userId,
            eventId,
            passId: response.uniquePassId
        });

        res.status(200).json({
            msg: 'registered successfully',
            ForkedUpId: response.uniquePassId,
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

export const eventAttendees = async (req : Request, res : Response) => {
    const eventId = req.params.id
    if(!eventId) {
        res.status(404).json({
            msg : "no event id mentioned"
        })
        return;
    }
    try {
        const event = await prisma.userEvents.findMany({
            where : {
               eventId : eventId
            }, 
            select : {
                user : {
                    select : {
                        profileAvatar : true, 
                        name : true
                    }
                }
            }
        })

        if(!event) {
            res.status(404).json({
                msg : "no event found"
            })
            return;
        }

        res.status(200).json({
            msg : "users fetched",
            event
        })
        return
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "internal server error"
        })
        return;
    }
}


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