import { generateRequestId } from "../utils/helper";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { prisma } from "../db/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


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

        // Basic email format validation to prevent invalid emails from being stored
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            logger.warn(`[${requestId}] Clerk Auth attempt with invalid email format`, { email, clerkId });
            res.status(400).json({ msg: "Invalid email format" });
            return;
        }
        if (!collegeName){
            logger.warn(`[${requestId}] Clerk Auth attempt with missing collegeName`, { email, clerkId });
            res.status(400).json({ msg: "Missing required fields" });
            return;
        }

        logger.info(`[${requestId}] Clerk Auth attempt`, { email });
        logger.info(`[${requestId}] Clerk Auth Data`, { email, name, clerkId, collegeName});

        // 3. Check if user exists in YOUR Database
        let user = await prisma.user.findUnique({
            where: { email: email }
        });

    
        if (user) {
            //if they don't have a clerkId yet, link it now
            if (!user.clerkId) {
                user = await prisma.user.update({
                    where: { email },
                    data: { clerkId}
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
        return;
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

              const token = jwt.sign({
            id: user.id,
            email: user.email,
            pfp: user.profileAvatar,
            name: user.name
        }, process.env.JWT_SECRET!);

        res.status(200).json({
            msg: 'Signup success',
            token,
        });
        return;
        }

       
      
    } catch (error: any) {
        logger.error(`[${requestId}] Clerk Auth Error`, {
            error: error?.message,
            stack: error?.stack,
        });

        let status = 500;
        let msg = "Internal server error during authentication";

        // Authentication / token-related errors
        if (error?.name === "JsonWebTokenError" || error?.name === "TokenExpiredError") {
            status = 401;
            msg = "Invalid or expired authentication token";
        }
        // Validation-related errors (e.g., bad input)
        else if (error?.name === "ValidationError") {
            status = 400;
            msg = "Invalid authentication request";
        }

        res.status(status).json({ msg, requestId });
        return;
    }
};

// traditional Login (Depreciate when all users have clerkId linked)
export const login = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { email, password } = req.body;

    logger.info(`[${requestId}] POST /login - Starting login`, { email });

    if (!email || !password) {
        logger.warn(`[${requestId}] Missing email or password`);
        res.status(400).json({ msg: 'Email and password are required' });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                email: true,
                password: true,
                isVerified: true,
                profileAvatar: true,
                name: true,
            }
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { email });
            res.status(404).json({
                msg: 'Invalid email or password'
            });
            return;
        }

        if (!user.isVerified) {
            logger.warn(`[${requestId}] User not verified`, { email });
            res.status(403).json({
                msg: "please verify yourself"
            });
            return;
        }

        if (bcrypt.compareSync(password, user.password)) {
            logger.info(`[${requestId}] Login successful`, { userId: user.id, email });
            
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
            return;
        } else {
            logger.warn(`[${requestId}] Invalid password`, { email });
            res.status(403).json({
                msg: 'Invalid email or password',
                token: 'no token',
            });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error in login`, {
            error: error.message,
            stack: error.stack,
            email
        });
        console.log(error);
        res.status(500).json({ msg: 'internal server error' });
        return;
    }
};