import { Router , Request, Response} from "express";
import prisma from "../db/db";
import { logger } from "../utils/logger";
import { signupSchema } from "../types/formtypes";
import jwt from "jsonwebtoken"; 
import dotenv from "dotenv";

dotenv.config()
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string

// todo => use bcrypt to hash 

//login and signup in one route
router.post("/signup", async (req: Request , res: Response) => {
    const {name, email, password} = req.body; 
    const parsedData = signupSchema.safeParse(req.body) 
       
    if(!parsedData.success) {
        res.status(411).json({msg  : "incorrect inputs"});
        logger.error(parsedData.error);
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
            if (password === userPw) {
                // login
                const token = jwt.sign({ id }, JWT_SECRET)
                localStorage.setItem("token", token);
                //remove when production
                res.status(200).json({
                    msg : "login success",
                    token
                })
                
            }
        }
        else {
           const response = await prisma.user.create({
                data : {
                    email : parsedData.data?.email as string ,
                    name : parsedData.data?.name , 
                    password : parsedData.data?.password as string
                }
            })
            
            const id = response.id

            const token = jwt.sign({id}, JWT_SECRET);
            localStorage.setItem("token", token)

            res.status(200).json({
                msg : "account created", 
                token
            })
        }
    } catch (error) {
     logger.info(error);
     logger.error(error);
    }


})


// get user info (profile)

export const userRouter = router;