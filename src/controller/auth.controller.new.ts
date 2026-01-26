import { generateRequestId } from "../utils/helper";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { prisma } from "../db/db";
import jwt from "jsonwebtoken";


// This route handles BOTH "Sign in with Google" AND "New Clerk Signups"
export const clerkLogin = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { email, name, clerkId, collegeName, avatarUrl, imgUrl, password } = req.body; 

    try {
        if(!clerkId || !email) {
            logger.warn(`[${requestId}] Clerk Auth attempt with missing fields`, { email, clerkId });
            res.status(400).json({ msg: "Missing required fields" });
            return;
        }

        if (!collegeName){
            logger.warn(`[${requestId}] Clerk Auth attempt with missing collegeName`, { email, clerkId });
            res.status(400).json({ msg: "Missing required fields" });
            return;
        }

        logger.info(`[${requestId}] Clerk Auth attempt`, { email });

        // 3. Check if user exists in YOUR Database
        let user = await prisma.user.findUnique({
            where: { email: email }
        });

    
        if (user) {
            //if they don't have a clerkId yet, link it now
            if (!user.clerkId) {
                user = await prisma.user.update({
                    where: { email },
                    data: { clerkId }
                });
            }
        } 
    
        else {
            user = await prisma.user.create({
                data: {
                    email,
                    clerkId,
                    name: name || "New User",
                    collegeName: collegeName , // Sent from frontend
                    profileAvatar: avatarUrl || imgUrl,
                    password: password || "", // No password needed for Clerk users
                    isVerified: true,
                    ValidFor: 86400000,
                }
            });
        }

       
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            pfp: user.profileAvatar,
            name: user.name
        }, process.env.JWT_SECRET!);

        res.status(200).json({
            msg: 'login success',
            token,
        });

    } catch (error: any) {
        logger.error(`[${requestId}] Clerk Auth Error`, error);
        res.status(401).json({ msg: "Unauthorized or Verification Failed" });
    }
};