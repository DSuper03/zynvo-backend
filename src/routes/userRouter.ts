//tested
import { Router, Request, Response } from 'express';
import prisma from '../db/db';
import { logger } from '../utils/logger';
import { newPWschema, signupSchema } from '../types/formtypes';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import mail from '../utils/nodemailer';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
dotenv.config();
const router = Router();

const genToken = () => {
  return crypto.randomBytes(20).toString('hex');
};

router.post('/signup', async (req: Request, res: Response) => {
  const { name, email, password, collegeName } = req.body;
  const avatarUrl = req.body.avatarUrl;
  const parsedData = signupSchema.safeParse(req.body);

  if (!parsedData.success) {
    res.status(411).json({ msg: 'incorrect inputs' });
    logger.error(parsedData.error);
    return;
  }
  try {
    const resposne = await prisma.user.findUnique({
      where: {
        email: parsedData.data?.email,
      },
    });

    if (resposne) {
      const userPw = resposne.password;
      const id = resposne.id;

      if (bcrypt.compareSync(password, userPw)) {
        const token = jwt.sign({ id }, process.env.JWT_SECRET!);
        res.status(200).json({
          msg: 'login success',
          token,
        });
        return;
      } else {
        res.status(401).json({
          msg: 'Invalid email or password',
          token: 'no token',
        });
        return;
      }
    } else {
      const hashedPassword = bcrypt.hashSync(
        parsedData.data?.password as string,
        10
      );
      const vToken = genToken();

      const response = await prisma.user.create({
        data: {
          email: parsedData.data?.email as string,
          name: parsedData.data?.name,
          password: hashedPassword,
          collegeName: collegeName,
          profileAvatar: avatarUrl,
          vToken: vToken,
          expiryToken: Math.floor(Date.now() / 1000),
          ValidFor: 86400000,
        },
      });

      const isVerified = response.isVerified;
      const url = `https://zynvo.social/verification-email?${vToken}`;
      await mail(
        parsedData.data.name,
        parsedData.data.email,
        'One click away from greatness (seriously, just one)',
        `Hey there! ${name} 👋
        <br>
         Welcome to Zynvo! You've got excellent taste in platforms (we're not biased at all).
         We just need to make sure you're not a robot trying to take over the world. 
        <br>
        <strong>Click that Link and boom – you're officially part of the cool kids club : ${url}</strong>
        <br>
        Questions? Just reply to this email.
        <br>
        Welcome aboard!
        <br>
        The Zynvo Team 🚀
        <br>
        PS : P.S. This link expires in 24 hours, so don't overthink it like choosing a Netflix show.
        `
      );
      const id = response.id;
      const token = jwt.sign({ id }, process.env.JWT_SECRET!);
      res.status(200).json({
        msg: 'account created',
        token,
      });
    }
  } catch (error: any) {
    logger.info(error.message);
    logger.error(error);
    res.status(500).json({ msg: 'internal server error' });
  }
});


router.post("/test-email", async(req : Request, res: Response) => {
  await mail("mohak", "mohakchakraborty2007@outlook.com", "test email", "test email html")
  res.json("email sent");
})



router.post('/verify', async (req: Request, res: Response) => {
  const vToken = req.query.vToken as string;

  if (!vToken) {
    res.status(404).json({
      msg: 'bad response, invalid token',
    });
  }
  try {
    //need to setup smtp server for email / TIP: USE SENDGRID
    const response = await prisma.user.findFirst({
      where: {
        vToken: vToken,
      },
    });

    if (!response) {
      res.status(400).json({
        msg: 'no user found, Invalid token',
      });
    }

    const expTime = response?.expiryToken as number;
    const currentTime = Date.now();
    const ValidFor = response?.ValidFor as number;
    if (currentTime - expTime <= ValidFor) {
      const Res = await prisma.user.update({
        where: {
          id: response?.id,
        },
        data: {
          isVerified: true,
        },
      });

      const id = Res.id;
      const isVerified = Res.isVerified;

      const token = jwt.sign({ id, isVerified }, process.env.JWT_SECRET!);

      if (!Res) {
        res.status(500).json({
          msg: 'internal server error, try again',
        });
      }

      res.status(200).json({
        msg: 'Verified successfully',
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      msg: 'internal server error',
    });
  }
});

router.put(
  '/reset-password',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const userID = req.id;
    // const password = req.body.password;
    // const newPassword =req.body.newPassword;

    const { password, newPassword } = req.body;
    const parsedData = newPWschema.safeParse(req.body);

    if (!parsedData.success) {
      res.json({
        msg: 'invalid passwrd format',
      });
    }

    try {
      const response = await prisma.user.findFirst({
        where: {
          id: userID,
        },
      });

      if (!response) {
        res.status(404).json({
          msg: 'invalid user, no such user',
        });
      }

      const pw = response?.password as string;

      if (bcrypt.compareSync(password, pw)) {
        const update = await prisma.user.update({
          where: {
            id: response?.id,
          },
          data: {
            password: bcrypt.hashSync(parsedData.data?.password as string, 10),
          },
        });

        if (!update)
          res.status(500).json({ msg: 'internal server error, try again' });

        res.status(200).json({
          msg: 'password updated successfully',
        });
      }
    } catch (error) {
      logger.info(error);
      logger.error(error);
    }
  }
);

router.get('/getUser', AuthMiddleware, async (req: Request, res: Response) => {
  const userId = req.id;
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        profileAvatar: true,
        name: true,
        clubName: true,
        email: true,
        isVerified: true,
        eventAttended: {
          where: {
            userId: userId,
          },
          select: {
            event: {
              select: {
                EventName: true,
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      res.status(404);
      console.log('error');
      return;
    } else {
      res.status(200).json({
        user,
      });
      return;
    }
  } catch (error) {}
});

router.post(
  '/joinClub/:id',
  AuthMiddleware,
  async (req: Request, res: Response) => {
    // maybe allow users to join multiple clubs.
    const ClubId = req.params.id;
    const userId = req.id;
    try {
      const club = await prisma.clubs.findFirst({
        where: {
          id: ClubId,
        },
        select: {
          name: true,
        },
      });

      if (!club) {
        res.json({
          msg: 'no club found',
        });
      }

      const clubName = club?.name as string;

      const JoinClub = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          clubName: clubName,
          clubId: ClubId,
        },
      });

      if (JoinClub) {
        res.status(200).json({
          msg: 'yay club joined',
        });
      }

      console.log('working');
    } catch (error) {
      logger.error(error);
    }
  }
);

export const userRouter = router;
