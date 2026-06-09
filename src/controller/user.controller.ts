import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { generateRequestId } from '../utils/helper';
import { z } from 'zod';

// Normalize query/param values that might be arrays into a single string
const normalizeParam = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

const updateAvatarSchema = z.object({
    profileAvatar: z.string().url('profileAvatar must be a valid URL')
});

const updateCollegeNameSchema = z.object({
    collegeName: z.string().trim().min(2, 'collegeName must be at least 2 characters')
});


export const getUser = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    logger.info(`[${requestId}] GET /getUser - Starting request`, { userId });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                collegeName: true,
                twitter: true,
                instagram: true,
                linkedin: true,
                createdAt: true,
                id: true,
                bio: true,
                year: true,
                tags: true,
                course: true,
                profileAvatar: true,
                name: true,
                clubName: true,
                clubId: true,
                email: true,
                isVerified: true,
                eventAttended: {
                    where: { userId: userId },
                    select: {
                        uniquePassId: true,
                        event: {
                            select: {
                                EventName: true,
                                id: true,
                            },
                        },
                    },
                },
                CreatePost: {
                    where: { authorId: userId },
                    select: {
                        id: true,
                        description: true
                    }
                }
            },
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            res.status(404).json({ msg: 'User not found' });
            return;
        }

        logger.info(`[${requestId}] User fetched successfully`, { userId });
        res.status(200).json({ user });
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching user`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        console.log(error);
        res.status(500).json({ msg: "error fetching details" });
    }
};

export const joinClub = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const clubId = normalizeParam(req.params.id);
    const userId = req.id;

    logger.info(`[${requestId}] POST /joinClub - Starting request`, { userId, clubId });

    try {
        const [club, userClub] = await Promise.all([
            prisma.clubs.findUnique({
                where: { id: clubId },
                select: { name: true, collegeName: true, collegeStudentsOnly: true }
            }),
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    clubName: true,
                    clubId: true,
                    collegeName: true
                }
            })
        ]);

        if (!club) {
            logger.warn(`[${requestId}] Club not found`, { clubId });
            res.json({ msg: 'no club found' });
            return;
        }

        if (userClub?.clubId && userClub.clubName) {
            logger.warn(`[${requestId}] User already in a club`, {
                userId,
                currentClub: userClub.clubId
            });
            res.json({ msg: "you are already a part of club, leave that first to join this." });
            return;
        }

        // If the club restricts membership to same-college students, enforce the check
        if (club.collegeStudentsOnly && userClub?.collegeName !== club.collegeName) {
            logger.warn(`[${requestId}] User college mismatch for restricted club`, {
                userId,
                userCollege: userClub?.collegeName,
                clubCollege: club.collegeName
            });

            res.status(403).json({ msg: 'Only students from the club founder\'s college can join this club' });
            return;
        }

        const joinClubResult = await prisma.user.update({
            where: { id: userId },
            data: {
                clubName: club.name,
                clubId: clubId,
            },
            select: { id: true }
        });

        logger.info(`[${requestId}] User joined club successfully`, {
            userId: joinClubResult.id,
            clubId
        });

        res.status(200).json({ msg: 'yay club joined' });
        return;
    } catch (error: any) {
        logger.error(`[${requestId}] Error joining club`, {
            error: error.message,
            stack: error.stack,
            userId,
            clubId
        });
        res.status(500).json({ msg: 'internal server error' });
    }
};

export const isFounder = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const eventId = req.query.id as string;

    logger.info(`[${requestId}] GET /isFounder - Starting request`, { userId, eventId });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { email: true }
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            res.status(404).json({ msg: 'No user Found' });
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, createdById: true }
        });

        if (!event) {
            logger.warn(`[${requestId}] Event not found`, { eventId });
            res.json({ msg: "you are not a founder" });
            return;
        }

        // If user is an event attender (registered for the event), identify them as authorized
        const isAttender = await prisma.userEvents.findUnique({
            where: {
                userId_eventId: {
                    userId,
                    eventId
                }
            }
        });

        if (isAttender) {
            logger.info(`[${requestId}] User is an attender of the event`, { userId, eventId });
            res.status(200).json({ msg: "identified" });
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: { founderEmail: user.email },
            select: {
                name: true,
                id: true,
            }
        });

        if (club && club.id === event.clubId) {
            logger.info(`[${requestId}] User is founder of event's club`, {
                userId,
                clubId: club.id,
                eventId
            });
            res.status(200).json({ msg: "identified" });
            return;
        }

        logger.warn(`[${requestId}] User is not authorized as founder or creator`, {
            userId,
            eventId
        });
        res.json({ msg: 'you are not a founder' });
        return;
    } catch (error: any) {
        logger.error(`[${requestId}] Error checking founder status`, {
            error: error.message,
            stack: error.stack,
            userId,
            eventId
        });
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;
    const { bio, tags, course, year, twitter, instagram, linkedin } = req.body;

    logger.info(`[${requestId}] PUT /updateProfile - Starting request`, { userId });

    try {
        const update = await prisma.user.update({
            where: { id: userId },
            data: {
                bio: bio,
                tags: tags,
                course: course,
                year: year,
                twitter: twitter ? twitter : "",
                instagram: instagram ? instagram : "",
                linkedin: linkedin ? linkedin : ""
            },
            select: { id: true }
        });

        

        logger.info(`[${requestId}] Profile updated successfully`, { userId: update.id });

        res.status(200).json({ msg: "Profile updated successfully" });
    } catch (error: any) {
        logger.error(`[${requestId}] Error updating profile`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        console.log(error);
        res.status(500).json({ msg: "Internal server error" });
    }
};

export const updateAvatar = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;

    logger.info(`[${requestId}] PUT /updateAvatar - Starting request`, { userId });

    try {
        const parsed = updateAvatarSchema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.errors[0]?.message || 'Invalid request body';
            res.status(400).json({ msg: message });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { profileAvatar: parsed.data.profileAvatar },
            select: {
                id: true,
                profileAvatar: true
            }
        });

        logger.info(`[${requestId}] Avatar updated successfully`, { userId: updatedUser.id });
        res.status(200).json({
            msg: 'Avatar updated successfully',
            user: updatedUser
        });
        return;
    } catch (error: any) {
        logger.error(`[${requestId}] Error updating avatar`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        res.status(500).json({ msg: 'Internal server error' });
        return;
    }
};

export const updateCollegeName = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;

    logger.info(`[${requestId}] PUT /updateCollegeName - Starting request`, { userId });

    try {
        const parsed = updateCollegeNameSchema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.errors[0]?.message || 'Invalid request body';
            res.status(400).json({ msg: message });
            return;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { collegeName: parsed.data.collegeName },
            select: {
                id: true,
                collegeName: true
            }
        });

        logger.info(`[${requestId}] College name updated successfully`, { userId: updatedUser.id });
        res.status(200).json({
            msg: 'College name updated successfully',
            user: updatedUser
        });
        return;
    } catch (error: any) {
        logger.error(`[${requestId}] Error updating college name`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        res.status(500).json({ msg: 'Internal server error' });
        return;
    }
};

export const getSidebarUser = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.id;

    logger.info(`[${requestId}] GET /getSidebarUser - Starting request`, { userId });

    try {
        const data = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                name: true,
                profileAvatar: true
            }
        });

        if (data) {
            logger.info(`[${requestId}] Sidebar user data fetched`, { userId });
            res.status(200).json({ data });
            return;
        } else {
            logger.warn(`[${requestId}] User not found`, { userId });
            res.status(404).json({ msg: "no user found" });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching sidebar user`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const searchUser = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const name = req.query.name as string;

    logger.info(`[${requestId}] GET /SearchUser - Starting request`, { searchName: name });

    if (!name || name === "") {
        logger.warn(`[${requestId}] No name provided for search`);
        res.status(404).json({ msg: "Please enter user's name" });
        return;
    }

    try {
        const users = await prisma.user.findMany({
            where: {
                name: {
                    contains: name,
                    mode: "insensitive"
                }
            },
            select: {
                id: true,
                name: true,
                profileAvatar: true,
                collegeName: true
            }
        });

        if (users) {
            logger.info(`[${requestId}] Users search completed`, {
                searchName: name,
                resultsCount: users.length
            });
            res.status(200).json({ users });
            return;
        } else {
            logger.info(`[${requestId}] No users found`, { searchName: name });
            res.status(404).json({
                msg: "no users found",
                users: []
            });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error searching users`, {
            error: error.message,
            stack: error.stack,
            searchName: name
        });
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const getPublicUser = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userId = req.query.id as string;

    logger.info(`[${requestId}] GET /getPublicUser - Starting request`, { userId });

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                collegeName: true,
                twitter: true,
                instagram: true,
                linkedin: true,
                createdAt: true,
                id: true,
                bio: true,
                year: true,
                tags: true,
                course: true,
                profileAvatar: true,
                name: true,
                clubName: true,
                email: true,
                isVerified: true,
                eventAttended: {
                    where: { userId: userId },
                    select: {
                        uniquePassId: true,
                        event: {
                            select: {
                                EventName: true,
                                id: true,
                            },
                        },
                    },
                },
                CreatePost: {
                    where: { authorId: userId },
                    select: {
                        id: true,
                        description: true
                    }
                }
            },
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId });
            res.status(404).json({ msg: "user not found" });
            return;
        }

        logger.info(`[${requestId}] Public user profile fetched`, { userId });
        res.status(200).json({ user });
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching public user`, {
            error: error.message,
            stack: error.stack,
            userId
        });
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const page = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    logger.info(`[${requestId}] GET /getAllUsers - Starting request`, { page, limit });

    try {
        const [users, totalData] = await Promise.all([
            prisma.user.findMany({
                take: limit,
                skip,
                orderBy: { createdAt: "desc" },
                select: {
                    id: true,
                    name: true,
                    profileAvatar: true,
                    collegeName: true,
                    clubName: true,
                    year: true,
                    course: true
                }
            }),
            prisma.user.count()
        ]);

        if (users) {
            logger.info(`[${requestId}] Users fetched successfully`, {
                page,
                usersCount: users.length,
                totalPages: Math.ceil(totalData / limit)
            });

            res.status(200).json({
                users,
                totalPages: Math.ceil(totalData / limit)
            });
            return;
        } else {
            logger.warn(`[${requestId}] No users found`, { page });
            res.status(404).json({ msg: "users not found" });
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error fetching all users`, {
            error: error.message,
            stack: error.stack,
            page
        });
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const leaveClub = async (req: Request, res: Response): Promise<void> => {
  try {
    const  userId  = req.id;

    if (!userId) {
     res.status(400).json({ msg: "User ID is required" });
     return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });


    if (!user) {
     res.status(404).json({ msg: "User not found" });
     return
    }

    if (!user.clubId || user.clubId === "none") {
      res.status(400).json({ msg: "User is not part of any club" });
      return
    }


    const leave = await prisma.user.update({
      where: { id: userId },
      data: {
        clubId: null,
        clubName: null,
      },
    });

    if (!leave) {
     res.status(400).json({ msg: "Failed to leave the club" });
     return
    }
    res.status(200).json(
        { 
            msg: "Successfully left the club" 
        }
    );
    return;
  } catch (error) {
    console.error("Error leaving club:", error);
   res.status(500).json({ message: "Internal server error" });
   return
  }
}

export const isClubAdmin = async(req : Request, res: Response) : Promise<void> => {
    const id = req.id
    try {
        const userDetails = await prisma.user.findUnique({
            where : {
                id : id
            }
        })
        if(!userDetails) {
            res.status(404).json({
                msg : "Invalid user"
            })
            console.log("user not found");
            return;
        } 
        if (!userDetails.clubId || !userDetails.email) {
            res.status(400).json({
                msg : "No club joined"
            })
            return;
        }

        const clubFounder = await prisma.clubs.findUnique({
            where : {
                id : userDetails.clubId,
                founderEmail : userDetails.email
            }
        })

        res.status(200).json({
            msg : "Fetched",
            founder : clubFounder ? 'true' : 'false'
        })
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "some error occured in server"
        })
        return;
    }
} 
