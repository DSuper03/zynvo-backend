
//============================ club Announcements CRUD ================================

import prisma from '../db/db';
import { Request, Response } from "express"

export const createClubAnnouncement = async(req : Request, res : Response) => {
  const id = req.id
  const clubId = req.params.clubId as string
  try {
    const {
        Title,
        Description
    } = req.body

    if(!Title || !Description) {
        res.status(403).json({
            msg : "title and description both are mandatory"
        });
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

    if(!userEmail) {
        res.status(404).json({
            msg : "No user found"
        })
        return;
    }

    const founder = await prisma.clubs.findUnique({
        where : {
            id : clubId,
            founderEmail : userEmail.email
        }
    })

    if(!founder) {
        res.status(403).json({
            msg : "forbidden access"
        })
        return;
    }

    const createAnn = await prisma.clubAnnouncement.create({
      data : {
        Title : Title,
        Description : Description,
        clubId : clubId
      }
    })

    if(createAnn) {
        res.status(201).json({
            msg : "Announcement published"
        })
        return;
    } else {
        res.status(400).json({
            msg : "some error occured making an announcement"
        })
        return;
    }

  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }

}

export const getClubAllannouncements = async(req : Request, res : Response) => {
  const clubId = req.params.clubId as string
  if(!clubId){
    res.status(404).json({
        msg : "club Id not mentioned"
    })
    return;
  }
  try {
    const Announcements = await prisma.clubAnnouncement.findMany({
        where : {
            clubId : clubId
        }, 
    })

    if(!Announcements){
        res.status(404).json({
            msg : "Error fetching announcements"
        });
        return;
    } 

    res.status(200).json({
        msg : "Announcements Fetched",
        Announcements
    })
    return;
  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }
}

export const updateClubAnnouncement = async(req : Request, res : Response) => {
  const annId = req.query.annId as string
  const id = req.id
  const clubId = req.params.clubId as string
  try {
    const {
        Title,
        Description
    } = req.body

    if(!Title && !Description) {
        res.status(403).json({
            msg : "Either title or description are mandatory"
        });
        return;
    }

  const updateData: any = {};

  updateData.updatedAt = new Date()
  if (Title) updateData.Title = Title;
  if (Description) updateData.Description = Description;

  
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
            msg : "No user found"
        })
        return;
    }

    const founder = await prisma.clubs.findUnique({
        where : {
            id : clubId,
            founderEmail : userEmail.email
        }
    })

    if(!founder) {
        res.status(403).json({
            msg : "forbidden access"
        })
        return;
    }

    const update = await prisma.clubAnnouncement.update({
        where : {
            id : annId,
            clubId : clubId
        }, 
        data : updateData
    })

    if(!update) {
        res.status(400).json({
            msg : "failed to update"
        })
        return;
    }

    res.status(200).json({
        msg : "updated"
    })

    return;


  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }
    
}

export const deleteClubAnnouncement = async(req : Request, res : Response) => {
  const id = req.id
  const clubId = req.params.clubId as string
  const annId = req.query.annId as string
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
            msg : "No user found"
        })
        return;
    }

    const founder = await prisma.clubs.findUnique({
        where : {
            id : clubId,
            founderEmail : userEmail.email
        }
    })

    if(!founder) {
        res.status(403).json({
            msg : "forbidden access"
        })
        return;
    }

    const del = await prisma.clubAnnouncement.delete({
        where : {
            id : annId,
            clubId : clubId
        }
    });

    if(!del) {
        res.status(400).json({
            msg : "some error occured"
        })
        return;
    } else {
        res.status(200).json({
            msg : "Deleted" 
        })
        return;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }
    
}