//tested
import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import prisma from '../db/db';
import { postSchema } from '../types/formtypes';

const router = Router();
const Verification = (req: Request, res: Response) => {
  if (!req.isVerified) {
    res.status(400).json({
      msg: 'please verify yourself first',
    });
  }
};

//router.use(Verification)

router.post('/create', AuthMiddleware, async (req: Request, res: Response) => {
  //add collegeName and EventType to databases
  const { title, description, collegeName, eventType } = req.body;
  const parsedData = postSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(500).json({
      msg: 'wrong format for your posts',
    });
    return
  }
  const userId = req.id;
  try {
    // probably perform this in transaction
    const transaction = await prisma.$transaction([]);

    const response = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
        name: true,
        clubId: true,
      },
    });

    if (!response) {
      res.status(404).json({
        msg: 'no such user found',
      });
      return;
    }

    const ClubId = response?.clubId as string;

    const response1 = await prisma.clubs.findFirst({
      where: {
        id: ClubId,
      },
    });

    if (!response1) {
      res.status(404).json({
        msg: 'no club found associated to you, either join a club or create one',
      });
      return;
    }

    const collegeName = response1?.collegeName;
    const collegeId = response1?.collegeId as string;

    const response2 = await prisma.createPost.create({
      data: {
        title: parsedData.data?.title as string,
        description: parsedData.data?.description as string,
        collegeId: collegeId,
        authorId: userId,
        published: true, //when saved in drafts , default is activated
      },
    });

    if (!response2) {
      res.status(500).json({
        msg: 'internal server error, post not published',
      });
      return;
    } else {
      res.status(200).json({
        msg: 'post created',
        id: response2.id,
      });
      return;
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'error creating post , some error occured.',
    });
  }
});

router.put('/edit/:id', AuthMiddleware, async (req: Request, res: Response) => {
  const Postid = req.params.id;
  const { title, description } = req.body;
  const parsedData = postSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.json({
      msg: 'incorrect format',
    });
    return;
  }
  try {
    //add updation of images later
    const response = await prisma.createPost.update({
      where: {
        id: Postid,
      },
      data: {
        title: parsedData.data?.title,
        description: parsedData.data?.description,
      },
    });

    if (!response) {
      res.status(500).json({
        msg: 'internal server error',
      });
      return;
    }

    res.json(200).json({
      msg: 'post updated, changes will reflect shortly',
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'error editing post',
    });
  }
});

router.get('/all', async (req: Request, res: Response) => {
  try {
    //add more
    //auth not required here
    const posts = await prisma.createPost.findMany({
      select: {
        title: true,
        description: true,
        collegeId: true,
      },
    });

    if (!posts || posts.length <= 0) {
      res.json({
        msg: 'not enough posts to show',
      });
      return;
    }

    res.status(200).json({
      msg: 'fetched',
      posts: posts,
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'error getting posts',
    });
  }
});

router.get('/get/:id', AuthMiddleware, async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const response = await prisma.createPost.findFirst({
      where: {
        id: id,
      },
    });

    if (!response) {
      res.json({
        msg: 'no such post found',
      });
      return;
    }

    res.status(200).json({
      msg: 'post fetched',
      response, // choose what you want to send to frontend
    });
    return;
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'error getting post',
    });
  }
});
router.delete(
  '/delete/:id',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const response = await prisma.createPost.delete({
        where: {
          id: id,
        },
      });

      if (!response) {
        res.json({
          msg: 'no such post found',
        });
        return;
      }

      res.status(200).json({
        msg: 'post deleted', // choose what you want to send to frontend
      });
      return;
    } catch (error) {
      logger.error(error);
      res.status(500).json({
        msg: 'error deleting post',
      });
    }
  }
);

export const postRouter = router;
