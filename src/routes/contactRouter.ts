//converting this page to feedback and contact handling page

import { Request, Response, Router } from 'express';
import { logger } from '../utils/logger';
import mail from '../utils/nodemailer';
import cmail from '../utils/contactMailer';
import { AuthMiddleware } from '../middleware/AuthMiddleware';
import prisma from '../db/db';

const router = Router();
router.post('/contact', async (req: Request, res: Response) => {
  const {name , email, subject, message} = req.body
  const html = `${message}`
  try {
    const mail = await cmail(
      name, 
      email,
      subject,
      html
    )

    if(mail) {
      res.status(200).json({
        msg : "sent"
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
  }
});

router.post('/feedback', AuthMiddleware, async (req: Request, res: Response) => {
 
  const userid = req.id

  const {subject , category, description, improvements} = req.body;

  const html = `category : ${category}
  <br>
  <br>
  ${description}
  <br>
  <br>
  improvemnts if any : ${improvements}
  `

  if(!userid) {
    res.status(402).json({
      msg : "invalid user"
    })
    return;
  }
 
  try {
    const userEmail = await prisma.user.findUnique({
      where : {
        id : userid
      },
      select : {
        email : true,
        name : true
      }
    })

    if(!userEmail) {
      res.status(404).json({
        msg : "user not found"
      })
      return;
    }

    const mail = await cmail(userEmail.name, 
      userEmail.email,
      subject,
      html
    )

     if(mail) {
      res.status(200).json({
        msg : "sent"
      })
      return;
    } else {
      res.status(400).json({
        msg : "some error occured"
      })
      return;
    }

  } catch (error) {
    logger.error(error);
  }
});
export const contactRouter = router;
