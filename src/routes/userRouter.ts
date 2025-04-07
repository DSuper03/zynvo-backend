import { Router , Request, Response} from "express";
import prisma from "../db/db";
import { logger } from "../utils/logger";
import { newPWschema, signupSchema } from "../types/formtypes";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { hashSync, compareSync } from "bcrypt-ts";
import crypto from "crypto";
import mail from "../utils/nodemailer";
dotenv.config()
const router = Router();

const genToken =() => {
  return crypto.randomBytes(20).toString("hex")
}


router.post("/signup", async (req: Request , res: Response) => {
    const {name, email, password} = req.body; 
    const parsedData = signupSchema.safeParse(req.body) 
      
    if(!parsedData.success) {
        res.status(411).json({msg  : "incorrect inputs"});
        logger.error(parsedData.error);
        return; 
    }
    try {
        const resposne = await prisma.user.findUnique({
            where : {
                email : parsedData.data?.email
            }
        })
      
        if (resposne) {
            const userPw = resposne.password; 
            const id = resposne.id
            
       
            if (compareSync(password, userPw)) {
                
                const token = jwt.sign({ id }, process.env.JWT_SECRET!)                
                res.status(200).json({
                    msg : "login success",
                    token
                })
            } else {
              
                res.status(401).json({
                    msg: "Invalid email or password"
                });
            }
        }
        else {
           
            const hashedPassword = hashSync(parsedData.data?.password as string, 10);
            const vToken = genToken();

            const response = await prisma.user.create({
                data : {
                    email : parsedData.data?.email as string,
                    name : parsedData.data?.name, 
                    password : hashedPassword, 
                    vToken : vToken,
                    expiryToken : Date.now(),
                    ValidFor : 86400000
                }
            })
            
            const url = `${process.env.FE_URL}/verify`
            await mail(parsedData.data.email, "Verification email for zynvo", `Please click this link to verify this email : ${url}`)
            const id = response.id
            const token = jwt.sign({id}, process.env.JWT_SECRET!);
            res.status(200).json({
                msg : "account created", 
                token
            })
        }
    } catch (error:any) {
        logger.info(error.message);
        logger.error(error);
        res.status(500).json({msg : "internal server error"})
    }
})

router.post("/verify", async (req: Request , res: Response) => {
    const vToken = req.query.vToken as string

    if(!vToken) {
        res.status(404).json({
            msg : "bad response, invalid token"
        })
    }
    try {
        //need to setup smtp server for email / TIP: USE SENDGRID
        const response =  await prisma.user.findFirst({
            where: {
                vToken : vToken,
            }
        }) 
        
        if(!response) {
            res.status(400).json({
                msg : "no user found, Invalid token"
            })
        }

        const expTime = response?.expiryToken as number
        const currentTime = Date.now()
        const ValidFor = response?.ValidFor as number
        if (currentTime - expTime <= ValidFor ){
            const Res = await prisma.user.update({
                where : {
                    id : response?.id
                }, 
                data : {
                    isVerified : true
                }
            })

            if(!Res) {
                res.status(500).json({
                    msg : "internal server error, try again"
                })
            }

            res.status(200).json({
                msg  : "Verified successfully"
            })
        }
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            msg : "internal server error"
        })
    }
})

router.put("/reset-password", async (req: Request , res: Response) => {
    // add auth middleware and remove the ts ignore
    //@ts-ignore
    const userID = req.id 
    const password = req.body
    const newPassword =req.body

    const parsedData = newPWschema.safeParse(newPassword);

    if(!parsedData.success) {
        res.json({
            msg : "invalid passwrd format blud"
        })
    }
    
    try {
        const response = await prisma.user.findFirst({
            where : {
                id : userID
            }
        })

        if(!response) {
            res.status(404).json({
                msg : "invalid user, no such user"
            })
        }

        const pw = response?.password as string

        if(compareSync(password, pw)) {
            const update = await prisma.user.update({
                where : {
                    id : response?.id
                }, 
                data : {
                    password : parsedData.data?.password
                }
            })

            if(!update) res.status(500).json({ msg : "internal server error, try again" }) 
            
            res.status(200).json({
                msg : "password updated successfully"
            })
        }
    } catch (error) {
        logger.error(error);
    }
})


router.get("/", (req: Request,res: Response) => {
   try {
    
   } catch (error) {
    logger.error(error);
   }
})

export const userRouter = router;