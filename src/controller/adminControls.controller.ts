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
    const id = req.id;
    const { coremember1, coremember2, coremember3 } = req.body;
    const clubId = req.params.clubId;

    try {
         const userEmail = await prisma.user.findUnique({
            where: { id },
            select: { email: true, clubName: true }
        });

        if (!userEmail) {
            res.status(404).json({ msg: "Unauthorized ID" });
            return;
        }

        
        const founder = await prisma.clubs.findUnique({
            where: {
                id: clubId,
                founderEmail: userEmail.email,
            },
        });

        if (!founder) {
            res.status(403).json({ msg: "You're not the club president" });
            return;
        }


        const coreMembers = [coremember1, coremember2, coremember3].filter(Boolean);


        const users = await prisma.user.findMany({
            where: { email: { in: coreMembers } },
            select: { email: true, clubId: true },
        });

       
        const missingMembers = coreMembers.filter(
            (email) => !users.some((u) => u.email === email)
        );

        const alreadyInClub = users.filter((u) => u.clubId && u.clubId !== clubId);

        if (missingMembers.length > 0 || alreadyInClub.length > 0) {
            res.status(400).json({
                msg: "Some members are invalid or already in another club",
                missingMembers,
                alreadyInClub: alreadyInClub.map((u) => u.email),
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
            ...coreMembers.map((email) =>
                prisma.user.update({
                    where: { email },
                    data: { clubId, clubName: userEmail.clubName },
                })
            ),
        ];

        await prisma.$transaction(updates);

        res.status(200).json({
            msg: "Core members added successfully",
            added: coreMembers,
        });
        return

    } catch (error) {
        console.error("Error adding core members:", error);
        res.status(500).json({ msg: "Internal server error", error: String(error) });
    }
};

export const removeCoreMembers = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const { coremember1, coremember2, coremember3 } = req.body;
    const clubId = req.params.clubId;

    try {
        const userEmail = await prisma.user.findUnique({
            where: { id },
            select: { email: true, clubName: true }
        });

        if (!userEmail) {
            res.status(404).json({ msg: "Unauthorized ID" });
            return;
        }


        const founder = await prisma.clubs.findUnique({
            where: {
                id: clubId,
                founderEmail: userEmail.email,
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
                email: { in: membersToRemove },
                clubId: clubId
            },
            select: { email: true },
        });

        const validMembers = users.map(u => u.email);
        const invalidMembers = membersToRemove.filter(email => !validMembers.includes(email));

        if (invalidMembers.length > 0) {
            res.status(400).json({
                msg: "Some users are not part of this club",
                invalidMembers,
            });
            return;
        }

        
        const newCoreMembers = {
            coremember1: founder.coremember1 && membersToRemove.includes(founder.coremember1) ? null : founder.coremember1,
            coremember2: founder.coremember2 && membersToRemove.includes(founder.coremember2) ? null : founder.coremember2,
            coremember3: founder.coremember3 && membersToRemove.includes(founder.coremember3) ? null : founder.coremember3,
        };

        
        const updates = [
            prisma.clubs.update({
                where: { id: clubId },
                data: newCoreMembers
            }),
            ...validMembers.map(email =>
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

export const addWings =   async (req: Request, res: Response): Promise<void> => {
    const id = req.id 
    const clubid = req.params.id as string;
    const {
       wings
    } =  req.body

    try {
        const email =  await prisma.user.findUnique({
            where : {
                id : id
            } ,
            select : {
                email : true
            }
        })  
        
        if (!email) {
            res.status(404).json({
                msg : "user not found"
            })
            return;
        }

        const club = await prisma.clubs.findUnique({
            where : {
                id : clubid
            }, 
            select : {
                founderEmail : true
            }
        })

        if (!club || (club.founderEmail != email.email)) {
            res.status(403).json({
                msg : "Invalid Founder id"
            })
            return;
        }


        const update = await prisma.clubs.update({
            where : {
                id : clubid
            }, 
            data : {
                wings : wings || []
            }
        })

        if(update) {
            res.status(201).json({
                msg : "wings added"
            })
            return;
         } else {
            res.status(400).json({
                msg : "some error occured"
            })
            return;
         }

    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg : "inetrnal server error"
        })
        return;
    }
}

export const updateLink = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const clubid = req.params.id as string;
    const { instagram, twitter, linkedin } = req.body;

    try {
        const email = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!email) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        const club = await prisma.clubs.findUnique({
            where: { id: clubid },
            select: { founderEmail: true }
        });

        if (!club || club.founderEmail !== email.email) {
            res.status(403).json({ msg: "Invalid founder ID" });
            return;
        }

        const updateData: any = {};
        if (instagram) updateData.instagram = instagram;
        if (twitter) updateData.twitter = twitter;
        if (linkedin) updateData.linkedin = linkedin;

        // 4️⃣ No valid fields provided
        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ msg: "No social links provided to update" });
            return;
        }

        // 5️⃣ Perform update
        const update = await prisma.clubs.update({
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


export const deleteEvent = async (req : Request, res : Response) => {
    const id = req.id 
    const eventId = req.params.eventId;
    if(!id) {
        res.status(404).json({
            msg : "Unauthorized"
        })
        return;
    }

    try {
        const club = await prisma.event.findUnique({
            where : {
                id : eventId
            }, 
            select : {
                clubId : true
            }
        })

        if(!club){
            res.status(404).json({
                msg : "no such event found"
            })
        return;
        }

        const userEmail = await prisma.user.findUnique({
            where : {
                id : id
            }, 
            select : {
                email : true
            }
        })

        if(!userEmail){
            res.status(404).json({
                msg : "no such user found"
            })
        return;
        }

        const founder = await prisma.clubs.findUnique({
            where : {
               id : club.clubId,
               founderEmail : userEmail.email 
            }
        })

       if(!founder){
            res.status(403).json({
                msg : "unauthorized access"
            })
        return;
        } else {
            const del = await prisma.event.delete({
                where : {
                    id : eventId
                }
            })
            if(del){
                res.status(200).json({
                    msg : "event deleted, refresh page"
                })
                return;
            } else {
                res.status(501).json({
                    msg : "some error occured"
                })
                return;
            }
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg : "internal server error"
        })
        return;
    }
}

// under progress
export const updateEventLink = async (req: Request, res: Response): Promise<void> => {
    const id = req.id;
    const eventId = req.params.id as string;
    const { link1, link2, link3 } = req.body;

    try {
        // 1️⃣ Verify requesting user
        const user = await prisma.user.findUnique({
            where: { id },
            select: { email: true }
        });

        if (!user) {
            res.status(404).json({ msg: "User not found" });
            return;
        }

        // 2️⃣ Verify event ownership (founder or creator of event)
        const event = await prisma.event.findUnique({
            where: { id: eventId },
        });

        if (!event) {
            res.status(403).json({ msg: "Unauthorized: You are not the event creator" });
            return;
        }

        // 3️⃣ Build dynamic update object
        const updateData: any = {};
        if (link1) updateData.link1 = link1;
        if (link2) updateData.link2 = link2;
        if (link3) updateData.link3 = link3;

        if (Object.keys(updateData).length === 0) {
            res.status(400).json({ msg: "No links provided to update" });
            return;
        }

        // 4️⃣ Update the event
        const updatedEvent = await prisma.event.update({
            where: { id: eventId },
            data: updateData,
        });

        res.status(200).json({
            msg: "Event links updated successfully",
            updated: updateData,
        });

    } catch (error) {
        console.error("Error updating event links:", error);
        res.status(500).json({ msg: "Internal server error", error: String(error) });
    }
};
