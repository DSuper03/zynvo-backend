//============================ event Announcements CRUD ===============================
import prisma from '../db/db';
import { Request, Response } from "express"

export const createAnnouncement = async(req : Request, res : Response) => {
    const eventId = req.params.eventId as string;
    const id = req.id;

    try {
        const {
            Title,
            Description
        } = req.body

       const event = await prisma.event.findUnique({
        where  : {
            id : eventId    
        }   
        })

        if(!event) {
            res.status(404).json({
                msg : "no event found"
            })
            return;
        }

        const userEmail = await prisma.user.findUnique({
            where : {
                id : id
            }
        })

        if(!userEmail){
            res.status(404).json({
                msg : "no user found"
            })
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where : {
                id : event.clubId,
                founderEmail : userEmail.email
            }
        })

        if(!founder) {
            res.status(403).json({
                msg  : "Youre not the founder sir"
            })
            return;
        }

        const createAnn = await prisma.eventAnnouncement.create({
            data : {
                Title,
                Description,
                eventId 
            }
        })

        if(!createAnn){
            res.status(400).json({
                msg : "Error creating announcements"
            })
            return;
        } else {
            res.status(200).json({
                msg : "Announcement published",
                data: createAnn
            })
            return;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg : "internal server error"
        })
    }

}

export const getAllannouncemts = async(req : Request, res : Response) => {
    const eventId = req.params.eventId as string;

    try {
        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if (!event) {
            res.status(404).json({ msg: "no event found" });
            return;
        }

        const announcements = await prisma.eventAnnouncement.findMany({
            where: { eventId },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({
            msg: "announcements fetched",
            data: announcements
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "internal server error"
        });
    }
}

export const updateAnnouncement = async(req : Request, res : Response) => {
    const eventId = req.params.eventId as string;
    const annId = String(req.query.annId || '');
    const id = req.id;

    try {
        if (!annId) {
            res.status(400).json({ msg: "announcement id (annId) required in query" });
            return;
        }

        const { Title, Description } = req.body;

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if(!event) {
            res.status(404).json({ msg: "no event found" });
            return;
        }

        const userEmail = await prisma.user.findUnique({
            where: { id }
        });

        if(!userEmail) {
            res.status(404).json({ msg: "no user found" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                founderEmail: userEmail.email
            }
        });

        if(!founder) {
            res.status(403).json({ msg: "You are not the founder" });
            return;
        }

        const ann = await prisma.eventAnnouncement.findUnique({
            where: { id: annId }
        });

        if(!ann || ann.eventId !== eventId) {
            res.status(404).json({ msg: "announcement not found for this event" });
            return;
        }

        const updated = await prisma.eventAnnouncement.update({
            where: { id: annId },
            data: {
                Title: Title ?? ann.Title,
                Description: Description ?? ann.Description
            }
        });

        res.status(200).json({
            msg: "announcement updated",
            data: updated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
    }
}

export const deleteAnnouncement = async(req : Request, res : Response) => {
    const eventId = req.params.eventId as string;
    const annId = String(req.query.annId || '');
    const id = req.id;

    try {
        if (!annId) {
            res.status(400).json({ msg: "announcement id (annId) required in query" });
            return;
        }

        const event = await prisma.event.findUnique({
            where: { id: eventId }
        });

        if(!event) {
            res.status(404).json({ msg: "no event found" });
            return;
        }

        const userEmail = await prisma.user.findUnique({
            where: { id }
        });

        if(!userEmail) {
            res.status(404).json({ msg: "no user found" });
            return;
        }

        const founder = await prisma.clubs.findFirst({
            where: {
                id: event.clubId,
                founderEmail: userEmail.email
            }
        });

        if(!founder) {
            res.status(403).json({ msg: "You are not the founder" });
            return;
        }

        const ann = await prisma.eventAnnouncement.findUnique({
            where: { id: annId }
        });

        if(!ann || ann.eventId !== eventId) {
            res.status(404).json({ msg: "announcement not found for this event" });
            return;
        }

        await prisma.eventAnnouncement.delete({
            where: { id: annId }
        });

        res.status(200).json({ msg: "announcement deleted" });
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "internal server error" });
        return;
    }
}