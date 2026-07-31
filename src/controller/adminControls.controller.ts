import { Request, Response } from "express";
import { prisma } from '../db/db';

// Normalize query/param values that might be arrays into a single string
const normalizeParam = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

export const removeMember = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const { member } = req.body;
    const clubId = normalizeParam(req.params.clubId);

    if (!member || typeof member !== 'string') {
        res.status(400).json({ msg: "member id is required" });
        return;
    }
    if (!clubId) {
        res.status(400).json({ msg: "clubId is required" });
        return;
    }

    try {
        const userEmail = await prisma.user.findUnique({
            where: { id: id },
            select: { email: true }
        });

        if (!userEmail || !userEmail.email || userEmail.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "unauthorized id" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: clubId,
                founderEmail: { equals: userEmail.email, mode: 'insensitive' },
            }
        });

        if (!founder) {
            res.status(403).json({ msg: "You're not the club president" });
            return;
        }

        const removed = await prisma.user.update({
            where: { id: member },
            data: {
                clubName: null,
                clubId: null
            }
        });

        if (!removed) {
            res.status(400).json({ msg: "some error occured" });
            return;
        }

        res.status(200).json({ msg: "members remove" });
        return;
    } catch (error) {
        res.status(500).json({ msg: "internal server error" });
        return;
    }
};

export const TransferOwnership = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const clubId = normalizeParam(req.params.clubId); 
    const { email } = req.body;
    try {
        const userEmail = await prisma.user.findUnique({
            where: { id: id }, 
            select: { email: true, clubName: true }
        });

        if (!userEmail || !userEmail.email || userEmail.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "unauthorized id" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: clubId,
                founderEmail: { equals: userEmail.email, mode: 'insensitive' },
            }
        });

        if (!founder) {
            res.status(403).json({ msg: "You're not the club president" });
            return;
        }

        const isThere = await prisma.user.findFirst({
            where: {
                email: { equals: email, mode: 'insensitive' }
            },
            select: { clubId: true, email: true }
        });
        
        if (!isThere || isThere.clubId != null) {
            res.status(404).json({ msg: "The user is not present on Zynvo Social or is in another club" });
            return;
        }

        const [update, update1] = await prisma.$transaction([
            prisma.clubs.update({
                where: { id: clubId },
                data: { founderEmail: isThere.email }
            }),
            prisma.user.update({
                where: { email: isThere.email },
                data: {
                    clubId: clubId,
                    clubName: userEmail.clubName
                }
            })
        ]);

        if (!update || !update1) {
            res.status(502).json({ msg: "some error occured" });
            return;
        }

        res.status(201).json({ msg: "Founder updated, your sacrifices will go down in history." });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
};

export const addCoreMembers = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const { coremember1, coremember2, coremember3 } = req.body;
    const clubId = normalizeParam(req.params.clubId);

    try {
        const userEmail = await prisma.user.findUnique({
            where: { id },
            select: { email: true, clubName: true }
        });

        if (!userEmail || !userEmail.email || userEmail.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "Unauthorized ID" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: clubId,
                founderEmail: { equals: userEmail.email, mode: 'insensitive' },
            },
        });

        if (!founder) {
            res.status(403).json({ msg: "You're not the club president" });
            return;
        }

        const coreMembers = [coremember1, coremember2, coremember3].filter(Boolean);

        const users = await prisma.user.findMany({
            where: { email: { in: coreMembers, mode: 'insensitive' } },
            select: { email: true, clubId: true },
        });

        const missingMembers = coreMembers.filter(
            (email) => !users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())
        );

        const alreadyInClub = users.filter((u: any) => u.clubId && u.clubId !== clubId);

        if (missingMembers.length > 0 || alreadyInClub.length > 0) {
            res.status(400).json({
                msg: "Some members are invalid or already in another club",
                missingMembers,
                alreadyInClub: alreadyInClub.map((u: any) => u.email),
            });
            return;
        }

        const updates = [
            prisma.clubs.update({
                where: { id: clubId },
                data: {
                    coremember1: coremember1 || founder.coremember1,
                    coremember2: coremember2 || founder.coremember2,
                    coremember3: coremember3 || founder.coremember3,
                },
            }),
            ...users.map((u) =>
                prisma.user.update({
                    where: { email: u.email },
                    data: { clubId, clubName: userEmail.clubName },
                })
            ),
        ];

        await prisma.$transaction(updates);

        res.status(200).json({
            msg: "Core members added successfully",
            added: coreMembers,
        });
        return;
    } catch (error) {
        console.error("Error adding core members:", error);
        res.status(500).json({ msg: "Internal server error", error: String(error) });
    }
};

export const removeCoreMembers = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const { coremember1, coremember2, coremember3 } = req.body;
    const clubId = normalizeParam(req.params.clubId);

    try {
        const userEmail = await prisma.user.findUnique({
            where: { id },
            select: { email: true, clubName: true }
        });

        if (!userEmail || !userEmail.email || userEmail.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "Unauthorized ID" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: clubId,
                founderEmail: { equals: userEmail.email, mode: 'insensitive' },
            },
        });

        if (!founder) {
            res.status(403).json({ msg: "You're not the club president" });
            return;
        }

        const membersToRemove = [coremember1, coremember2, coremember3].filter(Boolean);

        if (membersToRemove.length === 0) {
            res.status(400).json({ msg: "No core members provided to remove" });
            return;
        }

        const users = await prisma.user.findMany({
            where: {
                email: { in: membersToRemove, mode: 'insensitive' },
                clubId: clubId
            },
            select: { email: true },
        });

        const validMembers = users.map((u: any) => u.email);
        const invalidMembers = membersToRemove.filter(email => !validMembers.some((v: string) => v.toLowerCase() === email.toLowerCase()));

        if (invalidMembers.length > 0) {
            res.status(400).json({
                msg: "Some users are not part of this club",
                invalidMembers,
            });
            return;
        }

        const newCoreMembers = {
            coremember1: founder.coremember1 && membersToRemove.some(m => m.toLowerCase() === founder.coremember1?.toLowerCase()) ? 'none' : founder.coremember1,
            coremember2: founder.coremember2 && membersToRemove.some(m => m.toLowerCase() === founder.coremember2?.toLowerCase()) ? 'none' : founder.coremember2,
            coremember3: founder.coremember3 && membersToRemove.some(m => m.toLowerCase() === founder.coremember3?.toLowerCase()) ? 'none' : founder.coremember3,
        };

        const updates = [
            prisma.clubs.update({
                where: { id: clubId },
                data: newCoreMembers
            }),
            ...validMembers.map((email: string) =>
                prisma.user.update({
                    where: { email },
                    data: {
                        clubId: null,
                        clubName: null,
                    },
                })
            )
        ];

        await prisma.$transaction(updates);

        res.status(200).json({
            msg: "Core members removed successfully",
            removed: validMembers,
        });
    } catch (e) {
        console.error("Error removing core members:", e);
        res.status(500).json({ msg: "Internal server error", error: String(e) });
    }
};

export const addWings = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const clubid = normalizeParam(req.params.id);
    const { wings } = req.body;

    try {
        const email = await prisma.user.findUnique({
            where: { id: id },
            select: { email: true }
        });  
        
        if (!email || !email.email || email.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "user not found" });
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: { id: clubid }, 
            select: { founderEmail: true }
        });

        if (!club || !club.founderEmail || club.founderEmail.toLowerCase() !== email.email.toLowerCase()) {
            res.status(403).json({ msg: "Invalid Founder id" });
            return;
        }

        const update = await prisma.clubs.update({
            where: { id: clubid }, 
            data: { wings: wings || [] }
        });

        if (update) {
            res.status(201).json({ msg: "wings added" });
            return;
        } else {
            res.status(400).json({ msg: "some error occured" });
            return;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
};

export const updateLink = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const clubid = normalizeParam(req.params.id);
    const { instagram, twitter, linkedin } = req.body;

    try {
        const email = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!email || !email.email || email.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: { id: clubid },
            select: { founderEmail: true }
        });

        if (!club || !club.founderEmail || club.founderEmail.toLowerCase() !== email.email.toLowerCase()) {
            res.status(403).json({ msg: "Invalid founder ID" });
            return;
        }

        const updateData: any = {};
        if (instagram != '') updateData.instagram = instagram;
        if (twitter != '') updateData.twitter = twitter;
        if (linkedin != '') updateData.linkedin = linkedin;

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ msg: "No social links provided to update" });
            return;
        }

        await prisma.clubs.update({
            where: { id: clubid },
            data: updateData
        });

        res.status(200).json({
            msg: "Social links updated successfully",
            updated: updateData
        });
    } catch (error) {
        console.error("Error updating links:", error);
        res.status(500).json({ msg: "Internal server error", error: String(error) });
    }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const eventId = normalizeParam(req.params.eventId);
    if (!id) {
        res.status(404).json({ msg: "Unauthorized" });
        return;
    }
    if (!eventId) {
        res.status(400).json({ msg: "Event ID required" });
        return;
    }

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }, 
            select: { clubId: true, createdById: true }
        });

        if (!event) {
            res.status(404).json({ msg: "no such event found" });
            return;
        }

        const userEmail = await prisma.user.findUnique({
            where: { id: id }, 
            select: { email: true }
        });

        if (!userEmail || !userEmail.email || userEmail.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "no such user found" });
            return;
        }

        const emailLower = userEmail.email.toLowerCase();
        const club = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true }
        });

        const isClubHead = club && club.founderEmail && club.founderEmail.toLowerCase() === emailLower;
        const isCoreMember = club && [club.coremember1, club.coremember2, club.coremember3].some(
            (cm) => cm && cm.toLowerCase() !== 'none' && cm.toLowerCase() === emailLower
        );
        const isEventCreator = event.createdById === id;

        if (!isClubHead && !isCoreMember && !isEventCreator) {
            res.status(403).json({ msg: "unauthorized access" });
            return;
        }

        // Transaction cascade delete dependent records
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

        res.status(200).json({ msg: "event deleted, refresh page" });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
};

export const updateEventLink = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const eventId = normalizeParam(req.params.eventId);
    const { link1, link2, link3 } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!user || !user.email || user.email.toLowerCase() === 'none') {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId },
            select: { clubId: true, createdById: true }
        });

        if (!event) {
            res.status(404).json({ msg: "Event not found" });
            return;
        }

        const emailLower = user.email.toLowerCase();
        const club = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true }
        });

        const isClubHead = club && club.founderEmail && club.founderEmail.toLowerCase() === emailLower;
        const isCoreMember = club && [club.coremember1, club.coremember2, club.coremember3].some(
            (cm) => cm && cm.toLowerCase() !== 'none' && cm.toLowerCase() === emailLower
        );
        const isEventCreator = event.createdById === id;

        if (!isClubHead && !isCoreMember && !isEventCreator) {
            res.status(403).json({ msg: "Unauthorized" });
            return;
        }

        const updateData: any = {};
        if (link1) updateData.link1 = link1;
        if (link2) updateData.link2 = link2;
        if (link3) updateData.link3 = link3;

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ msg: "No links provided to update" });
            return;
        }

        await prisma.event.update({
            where: { id: eventId },
            data: updateData,
        });

        res.status(200).json({
            msg: "Event links updated successfully",
            updated: updateData,
        });
        return;
    } catch (error) {
        console.error("Error updating event links:", error);
        res.status(500).json({ msg: "Internal server error", error: String(error) });
    }
};
