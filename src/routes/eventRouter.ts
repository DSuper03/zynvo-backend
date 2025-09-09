//tested
import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import prisma from '../db/db';
import { EventSchema } from '../types/formtypes';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import { tuple } from 'zod';

const router = Router();
const Verification = (req: Request, res: Response) => {
  if (!req.isVerified) {
    res.status(400).json({
      msg: 'please verify yourself first',
    });
  }
};


//router.use(Verification)

router.post('/event', AuthMiddleware, async (req: Request, res: Response) => {
  //include pfp later
  // prizes not added here
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
    image
  } = req.body;
  const userId = req.id;
  const parsedData = EventSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.json({
      msg: 'incorrect format',
    });
  }
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });

    if (!user) {
      res.status(404).json({
        msg: 'No user Found',
      });
      return;
    }
    //  const clubId = club?.clubId

    //   if (!club || !clubId) {
    //     res.json({
    //       msg: 'invalid user or club',
    //     });
    //   }

    //   const isPresident = await prisma.clubs.findFirst({
    //     where : {
    //       id : clubId
    //     }
    //   })

    const club = await prisma.clubs.findUnique({
      where: {
        founderEmail: user.email,
      },
      select: {
        name: true,
        id: true,
        collegeName: true,
      },
    });

    if (!club) {
      res.status(402).json({
        msg: 'invalid president identification',
      });
      return;
    }

    const response = await prisma.event.create({
      data: {
        EventName: parsedData.data?.eventName as string,
        description: parsedData.data?.description as string,
        EventMode: eventMode,
        EventType: eventType,
        EventUrl: eventWebsite ? eventWebsite : '',
        Venue: venue,
        TeamSize: maxTeamSize,
        clubName: club?.name as string,
        clubId: club?.id as string,
        prizes: prizes ? prizes : '',
        startDate: eventStartDate,
        endDate: eventEndDate,
        university: university
          ? university.toLowerCase()
          : club.collegeName.toLowerCase(),
        collegeStudentsOnly: collegeStudentsOnly,
        contactEmail: contactEmail,
        contactPhone: contactPhone,
        participationFee: noParticipationFee,
        posterUrl : image
      },
    });

    if (response) {
      res.status(200).json({
        msg: 'event created',
        id: response.id,
      });
      return;
    } else {
      res.status(500).json({
      msg: 'error creating event',
    });
    return;
    }
  } catch (error) {
    logger.error(error);
    res.status(501).json({
      msg: 'internal server error',
    });
  }
});

router.get(
  '/event/:id',
  async (req: Request, res: Response) => {
    const Eventid = req.params.id;

    try {
      if (Eventid) {
        const response = await prisma.event.findFirst({
          where: {
            id: Eventid,
          },
        });

        if (!response) {
          res.json({
            msg: 'no such event',
          });
          return;
        }

        res.status(200).json({
          msg: 'event found',
          response,
        });
        return;
      }
    } catch (error) {
      logger.error(error);
    }
  }
);

router.get(
  '/eventByClub/:id',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const clubId = req.params.id;

    try {
      const event = await prisma.event.findMany({
        where: {
          clubId: clubId,
        },
      });

      if (event) {
        res.status(200).json({
          msg: 'fetched',
          event, // [{}, {}, {}]
        });
        return;
      } else {
        res.status(404).json({
          msg: 'no club found',
        });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
);

router.get('/all', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1
    const limit = 10
    const skip = (page - 1) * limit

    const response = await prisma.event.findMany({
      take : limit,
      skip,
      orderBy : {
        createdAt : "desc"
      },
      include: {
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
    });

    const totalData = await prisma.event.count();

    if (!response) {
      res.status(404).json({
        msg: 'No events found',
      });
      return;
    }
    res.status(200).json({
      msg: 'found',
      response,
      totalPages : Math.ceil(totalData/limit)
    });
  } catch (error) {
    res.status(500).json({
      msg: 'internal server error',
    });
  }
});

router.post(
  '/registerEvent',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.id;
    if (!userId) {
      res.status(402).json({
        msg: 'invalid user',
      });
      return;
    }

    const { eventId } = req.body;
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
        res.status(402).json({
          msg: 'already registered bro',
        });
        return;
      }

      const response = await prisma.userEvents.create({
        data: {
          userId: userId,
          eventId: eventId,
          uniquePassId: generateUUID(),
        },
      });

      if (response) {
        res.status(200).json({
          msg: 'registered successfully',
          ForkedUpId: response.uniquePassId,
        });
        return;
      } else {
        res.status(402).json({
          msg: 'please try again later',
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        msg: 'internal server error',
      });

      console.log(error);
    }
  }
);

router.post(
  '/addSpeakers',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const userId = req.id;

    const { profilePic, about, name, email, eventId } = req.body;

    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          email: true,
        },
      });

      if (!user) {
        res.status(404).json({
          msg: 'No user Found',
        });
        return;
      }

      const club = await prisma.clubs.findUnique({
        where: {
          founderEmail: user.email,
        },
        select: {
          name: true,
          id: true,
        },
      });

      if (!club) {
        res.status(402).json({
          msg: 'invalid president identification',
        });
        return;
      }

      const addSpeaker = await prisma.speakers.create({
        data: {
          profilePic: profilePic ? profilePic : '',
          about: about,
          name: name,
          email: email,
          eventId: eventId,
        },
      });

      if (addSpeaker) {
        res.status(200).json({
          msg: 'Speaker added',
          id: addSpeaker.id,
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: 'internal server error',
      });
    }
  }
);

function generateUUID() {
  return 'Zynvo xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }
  );
}

router.get('/getSpeakers', async(req : Request, res: Response) => {
  const eventId = req.query.id as string
  console.log("eventid: ", eventId)
  try {
    const speakers = await prisma.speakers.findMany({
      where : {
        eventId : eventId
      }
    })

    if(!speakers || speakers.length <= 0) {
      res.status(404).json({
        msg : "No speakers added for the event"
      })
      return;
    }

    res.status(200).json({
      msg : "speakers are there",
      speakers
    })
    return 
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg : "internal server error"
    })
  }
})


router.get('/ver-event',async(req:Request, res:Response)=> {
  const id = req.query.id as string

  if(!id.startsWith('Z')) {
    res.status(502).json({
      status : 'invalid'
    })
    return;
  }

  try {
    const findUser = await prisma.userEvents.findFirst({
      where : {
       uniquePassId : id
      }
    })

    if(findUser){
      res.status(200).json({
        status : 'registered'
      })
      return;
    } else {
      res.status(404).json({
        status : 'unregistered'
      })
      return;
    }
  } catch ( error ) {
    res.status(500).json({
        msg : "internal server error"   
         })
      return;
  }


})


router.get('/event-details',async(req:Request, res:Response)=> {
  const id = req.query.id as string

  if(!id.startsWith('Z')) {
    res.status(502).json({
      status : 'invalid'
    })
    return;
  }

  try {
    const findUser = await prisma.userEvents.findFirst({
      where : {
       uniquePassId : id
      },
      select : {
        event : {
          select : {
            EventName : true,
            clubName : true,
            club : {
              select : {
                collegeName : true
              }
            },
            startDate : true, 
          }
        },
        user : {
          select : {
            profileAvatar : true
          }
        }
      }
    })

    if(findUser){
      res.status(200).json({
        data : {
          eventName : findUser.event.EventName,
          clubName : findUser.event.clubName,
          collegeName : findUser.event.club.collegeName,
          startDate : findUser.event.startDate,
          profilePic : findUser.user.profileAvatar
        }
      })
      return;
    } else {
      res.status(404).json({
        data : {
          
        }
      })
      return;
    }
  } catch ( error ) {
    res.status(500).json({
        msg : "internal server error"   
         })
      return;
  }


})

export const EventRouter = router;
