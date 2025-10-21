
//============================ event Announcements CRUD ===============================

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

export const getClubAllannouncemts = async(req : Request, res : Response) => {

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
  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }
}

export const updateClubAnnouncement = async(req : Request, res : Response) => {
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
  } catch (error) {
    console.log(error);
    res.status(500).json({
        msg : "internal server error"
    })
    return;
  }
    
}