import { Request, Response } from "express";
import prisma from '../db/db';

export const removeMember = async (req: Request, res: Response): Promise<void> => {
    const id =  req.id;
    //members is array
    const {
        members
    } = req.body 
    const clubId = req.params.clubId; 
    try {

        const userEmail = await prisma.user.findUnique({
            where : {
                id : id
            }, 
            select : {
                email : true
            }
        })

        if(!userEmail) {
            res.status(404).json({
                msg : "unauthorized id"
            })
            return;
        }

        const founder = await prisma.clubs.findUnique({
            where : {
                id : clubId,
                founderEmail : userEmail.email,
            }
        })

        if(!founder){
            res.status(403).json({
                msg : "Youre not the club president"
            })
            return
        }

        const removed = await prisma.user.updateMany({
            where : {
                id : members
            },
            data : {
                clubName : null,
                clubId : null
            }
        })

        if(!removed){
            res.status(400).json({
                msg : "some error occured"
            })
            return;
        }

        res.status(200).json({
            msg : "members remove"
        })
        return;
        
    } catch (error) {
        
    }
}

export const TransferOwnership = async (req: Request, res: Response): Promise<void> => {
    const id =  req.id;
    const clubId = req.params.clubId; 
    const {
        email
    } = req.body;
    try {

        const userEmail = await prisma.user.findUnique({
            where : {
                id : id
            }, 
            select : {
                email : true,
                clubName : true
            }
        })

        if(!userEmail) {
            res.status(404).json({
                msg : "unauthorized id"
            })
            return;
        }

        const founder = await prisma.clubs.findUnique({
            where : {
                id : clubId,
                founderEmail : userEmail.email,
            }
        })

        if(!founder){
            res.status(403).json({
                msg : "Youre not the club president"
            })
            return;
        }

        const isThere = await prisma.user.findUnique({
            where : {
                email : email
            },
            select : {
                clubId : true
            }
        });
        
        if(!isThere || clubId != null) {
            res.status(404).json({
                msg : "The user is not present on zynvo or is in another club"
            });
            return;
        }

        const [update, update1] = await prisma.$transaction([
            prisma.clubs.update({
            where: { id: clubId },
            data: { founderEmail: email }
            }),
            prisma.user.update({
            where: { email: email },
            data: {
                clubId: clubId,
                clubName: userEmail.clubName
            }
            })
        ]);

        if (!update || !update1) {
            res.status(502).json({
            msg: "some error occured"
            });
            return;
        }

        res.status(201).json({
            msg : "Founder updated, your sacrifices will go down in history."
        })
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "internal server error"
        })
    }
}

export const addCoreMembers = async (req: Request, res: Response): Promise<void> => {
    const id =  req.id;
    const {
        memberEmail
    } = req.body 
    const clubId = req.params.clubId; 
    try {

        const userEmail = await prisma.user.findUnique({
            where : {
                id : id
            }, 
            select : {
                email : true,
                clubName : true
            }
        })

        if(!userEmail) {
            res.status(404).json({
                msg : "unauthorized id"
            })
            return;
        }

        const founder = await prisma.clubs.findUnique({
            where : {
                id : clubId,
                founderEmail : userEmail.email,
            }
        })

        if(!founder){
            res.status(403).json({
                msg : "Youre not the club president"
            })
            return
        }

        const isThere = await prisma.user.findUnique({
            where : {
                email : memberEmail
            }, 
            select : {
                clubId : true
            }
        });
        
        if(!isThere || clubId != null) {
            res.status(404).json({
                msg : "The user is not present on zynvo or is part of another club"
            });
            return;
        }
        
                const [update, update1] = await prisma.$transaction([
            prisma.clubs.update({
            where: { id: clubId },
            data: { coremember1: email }
            }),
            prisma.user.update({
            where: { email: email },
            data: {
                clubId: clubId,
                clubName: userEmail.clubName
            }
            })
        ]);

        if (!update || !update1) {
            res.status(502).json({
            msg: "some error occured"
            });
            return;
        }
        
    } catch (error) {
        
    }
}