//tested
import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import prisma from '../db/db';
import { ClubSchema } from '../types/formtypes';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();

// Move specific routes BEFORE parameterized routes
router.get('/getAll', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const pages = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const skip = (pages - 1) * limit;

    const resp = await prisma.clubs.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        collegeName: true,
        description: true,
        type: true,
        profilePicUrl: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        }
      }
    });

    const totalData = await prisma.clubs.count();
    
    res.status(200).json({
      resp,
      totalPages: Math.ceil(totalData / limit)
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'Error fetching clubs'
    });
  }
});

router.get('/getClub', AuthMiddleware, async (req: Request, res: Response) => {
  // ...existing getClub code...
});

router.get('/getClubs/:college', async (req: Request, res: Response) => {
  // ...existing getClubs code...
});

// Put parameterized routes LAST
router.get('/:id', AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const clubId = req.params.id;

    const club = await prisma.clubs.findUnique({
      where: {
        id: clubId,
      },
      select: {
        id: true,
        name: true,
        collegeName: true,
        description: true,
        type: true,
        founderEmail: true,
        clubContact: true,
        requirements: true,
        facultyEmail: true,
        profilePicUrl: true,
        wings: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true,
            profileAvatar: true,
            course: true,
            year: true
          }
        }
      },
    });

    if (!club) {
      res.status(404).json({
        msg: 'Club not found',
      });
      return;
    }

    res.status(200).json({
      msg: 'Club details retrieved successfully',
      club,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'Error retrieving club details',
    });
  }
});

router.post('/club', AuthMiddleware,async (req: Request, res: Response) => {
  //include pfp later
  const {
    name,
    description,
    type,
    FounderEmail,
    clubContact,
    requirements,
    facultyEmail,
    logo,
    wings
  } = req.body;

  const userId = req.id;

  try {
    const college = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        collegeName: true,
      },
    });

    const founder = await prisma.user.findUnique({
      where: {
        email: FounderEmail,
      },
    });

    if (!founder) {
      res.status(402).json({
        msg: 'founder not found , ask him to register',
      });
      return;
    }

    const findClub = await prisma.clubs.findFirst({
      where: {
        collegeName: college?.collegeName as string,
        name: name,
      },
    });

    if (findClub) {
      res.json({
        msg: 'the club of this name already exists in your college, delete that or create a new club',
      });
      return;
    }

    const alrFounder = await prisma.clubs.findUnique({
      where : {
        founderEmail : FounderEmail
      }
    })

    if(alrFounder) {
      res.status(400).json({
        msg : "President you chose, is already a president of one club"
      })
      return;
    }
    const response = await prisma.clubs.create({
      data: {
        name: name,
        collegeName: college?.collegeName as string,
        description: description,
        type: type,
        founderEmail: FounderEmail,
        clubContact: clubContact,
        requirements: requirements,
        facultyEmail: facultyEmail,
        profilePicUrl : logo,
        wings : wings ? wings : []
      },
    });

    if (!response) {
      res.json({
        msg: 'error in forming a club, please try again later',
      });
      return;
    }

    const partOfClub = await prisma.user.update({
      where : {
        email : FounderEmail
      }, 
      data : {
        clubId : response.id,
        clubName : response.name
      }
    })

    if(!partOfClub){
      res.status(200).json({
        msg : "club is formed, please explicitly join the club.",
        clubId : response.id
      })
      return;
    }

    res.status(200).json({
      msg: 'club formed!',
      clubId: response.id,
    });
    return;
  } catch (error) {
    logger.error(error);
    console.log(error);
    res.status(500).json({
      msg: 'error creating club',
    });
  }
});

export const clubRouter = router;
