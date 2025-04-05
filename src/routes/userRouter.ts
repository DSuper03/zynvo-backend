import { Router , Request, Response} from "express";
import prisma from "../db/db";
import { logger } from "../utils/logger";
import { signupSchema } from "../types/formtypes";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";
import { hashSync, compareSync } from "bcrypt-ts";
dotenv.config()
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET!



//login and signup in one route
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
            
                const token = jwt.sign({ id }, JWT_SECRET)                
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
            
            const response = await prisma.user.create({
                data : {
                    email : parsedData.data?.email as string,
                    name : parsedData.data?.name, 
                    password : hashedPassword 
                }
            })
            
            const id = response.id
            const token = jwt.sign({id}, JWT_SECRET);
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

router.post("/veryfy", async (req: Request , res: Response) => {
    try {
        //need to setup smtp server for email / TIP: USE SENDGRID   
    } catch (error) {
        logger.error(error);
    }
})

router.post("/reset-password", async (req: Request , res: Response) => {
    try {
        
    } catch (error) {
        logger.error(error);
    }
})




// get user info (profile)

export const userRouter = router;