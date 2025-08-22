//tested
import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import prisma from '../db/db';
import { ClubSchema } from '../types/formtypes';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const router = Router();
const Verification = (req: Request, res: Response) => {
  if (!req.isVerified) {
    res.status(400).json({
      msg: 'please verify yourself first',
    });
  }
};


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

//query korbo, params na , tahole id , name , collegeName diye o khoja jabe
router.get('/getClub',AuthMiddleware, async (req: Request, res: Response) => {
  const id = req.query.id;
  const name = req.query.name;
  const collegeName = req.query.collegeName;
  try {
    if (id) {
      const response = await prisma.clubs.findFirst({
        where: {
          id: id as string,
        },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
          founderEmail : true,
          facultyEmail : true,
          members : true
          // add profile pic later
        },
      });

      if (!response) {
        res.json({
          msg: 'no such club',
        });
        return 
      }

      res.status(200).json({
        msg: 'club found',
        response,
      });

      return;
    } else if (name) {
      const response = await prisma.clubs.findMany({
        where: {
          name: name as string,
        },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
          // add profile pic later
        },
      });

      if (!response) {
        res.json({
          msg: 'no such club',
        });
        return
      }

      res.status(200).json({
        msg: 'clubs found, add college filter to sort out',
        response,
      });

      return;
    } else if (name && collegeName) {
      const response = await prisma.clubs.findFirst({
        where: {
          name: name as string,
          collegeName: collegeName as string,
        },
        select: {
          id: true,
          name: true,
          collegeName: true,
          description: true,
          // add profile pic later
        },
      });

      if (!response) {
        res.json({
          msg: 'no such club',
        });
      }

      res.status(200).json({
        msg: 'clubs found',
        response,
      });
    }
  } catch (error) {
    logger.error(error);
  }
});

router.get('/getAll',AuthMiddleware, async (req: Request, res: Response) => {
  try {
    const pages = parseInt(req.query.page as string)
    const limit = 10

    const skip = (pages - 1) * limit

    const resp = await prisma.clubs.findMany({
      skip,
      take : limit
    });
    const totalData = await prisma.clubs.count();
    if (resp) {
      res.status(200).json({
        resp, 
        totalPages : Math.ceil(totalData/limit)
      });
      return;
    }
  } catch (error) {
    console.log(error);
  }
});

router.get('/getClubs/:college', async (req: Request, res: Response) => {
  try {
    const collegeName = req.params.college as string
    const resp = await prisma.clubs.findMany({
      where : {
        collegeName : collegeName
      } , 
      select : {
        name : true
      }
    });
    if (resp && resp.length > 0) {
      res.status(200).json({
        resp,
      });
      return;
    } else {
      res.status(404).json({
        resp : []
      })
    }
  } catch (error) {
    console.log(error);
  }
});

export const clubRouter = router;
