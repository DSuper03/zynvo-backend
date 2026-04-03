import { generateRequestId } from "../utils/helper";
import { Request, Response } from "express";
import { logger } from "../utils/logger";
import { prisma } from "../db/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createClerkClient } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();


const secretKey = process.env.CLERK_SECRET_KEY;


const clerkClient = createClerkClient({ secretKey: secretKey });


// This route handles BOTH "Sign in with Google" AND "New Clerk Signups"
export const clerkLogin = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { email, name, clerkId, collegeName, avatarUrl, imgUrl, password } = req.body; 

    try {
        // Fallback: if no clerkId is provided, treat this as legacy email/password login
        if (!clerkId) {
            logger.info(`[${requestId}] /login without clerkId - falling back to password login`, { email });
            await login(req, res);
            return;
        }

        if (!email) {
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
        logger.info(`[${requestId}] Clerk Auth attempt`, { email });
        logger.info(`[${requestId}] Clerk Auth Data`, { email, name, clerkId, collegeName});

        // 3. Check if user exists in YOUR Database
        let user = await prisma.user.findUnique({
            where: { email: email }
        });

        // collegeName is only required for NEW users (signup), not existing (signin)
        if (!user && !collegeName) {
            logger.warn(`[${requestId}] New user signup missing collegeName`, { email, clerkId });
            res.status(404).json({ msg: "No account found with this email. Please sign up first." });
            return;
        }


        if (user) {
            // Update user with new data from Clerk/OAuth (clerkId, collegeName, name, profileAvatar)
            const updateData: any = {};
            
            if (!user.clerkId) {
                updateData.clerkId = clerkId;
            }
            
            // Always update collegeName if provided
            if (collegeName) {
                updateData.collegeName = collegeName;
            }
            
            // Update name if provided and different
            if (name && name !== user.name) {
                updateData.name = name;
            }
            
            // Update profile avatar if provided and different
            if ((avatarUrl || imgUrl) && (avatarUrl || imgUrl) !== user.profileAvatar) {
                updateData.profileAvatar = avatarUrl || imgUrl;
            }

            // If there are changes to make, update the user
            if (Object.keys(updateData).length > 0) {
                user = await prisma.user.update({
                    where: { email },
                    data: updateData,
                    select: {
                        id: true,
                        email: true,
                        name: true,
                        profileAvatar: true,
                        collegeName: true,
                        clerkId: true,
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
                    password: password ? bcrypt.hashSync(password, 10) : "", // Hash password; empty for OAuth-only users
                    isVerified: true,
                    ValidFor: 86400000,
                },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profileAvatar: true,
                    collegeName: true,
                    clerkId: true,
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

// depricated
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

        let passwordMatches = false;
        let needsRehash = false;

        if (user.password) {
            // First, try bcrypt comparison (hashed password case)
            passwordMatches = bcrypt.compareSync(password, user.password);

            // If bcrypt comparison fails, fall back to legacy plain-text comparison
            if (!passwordMatches && password === user.password) {
                passwordMatches = true;
                needsRehash = true; // legacy plain-text password: upgrade to bcrypt
            }
        }

        if (passwordMatches) {
            if (needsRehash) {
                // Transparently upgrade legacy plain-text password to a bcrypt hash
                const newHashedPassword = bcrypt.hashSync(password, 10);
                await prisma.user.update({
                    where: { id: user.id },
                    data: { password: newHashedPassword },
                });
                logger.info(`[${requestId}] Upgraded legacy plain-text password to bcrypt`, { userId: user.id, email });
            }
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
        }

        logger.warn(`[${requestId}] Invalid password`, { email });
        res.status(403).json({
            msg: 'Invalid email or password',
            token: 'no token',
        });
        return;

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

// Signin via syncWithClerk: verify credentials, sync legacy users to Clerk, return JWT
export const syncWithClerk = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { email, password } = req.body;

    logger.info(`[${requestId}] POST /syncWithClerk`, { email });

    if (!email || !password) {
        res.status(400).json({ msg: "Email and password are required" });
        return;
    }

    try {
        // 1. Find the user in our DB
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
                name: true,
                clerkId: true,
                isVerified: true,
                profileAvatar: true,
            },
        });

        if (!user) {
            res.status(404).json({ msg: "No account found with this email. Please sign up first." });
            return;
        }

        if (!user.isVerified) {
            res.status(403).json({ msg: "Please verify your email first" });
            return;
        }

        // 2. Verify the password against our DB
        let passwordMatches = false;
        let needsRehash = false;

        if (user.password) {
            passwordMatches = bcrypt.compareSync(password, user.password);
            if (!passwordMatches && password === user.password) {
                passwordMatches = true;
                needsRehash = true;
            }
        }

        if (!passwordMatches) {
            res.status(403).json({ msg: "Invalid email or password" });
            return;
        }

        // Upgrade plaintext password to bcrypt if needed
        if (needsRehash) {
            const hashed = bcrypt.hashSync(password, 10);
            await prisma.user.update({ where: { id: user.id }, data: { password: hashed } });
            logger.info(`[${requestId}] Upgraded legacy password to bcrypt`, { email });
        }

        // 3. If user has no clerkId, sync them into Clerk
        if (!user.clerkId) {
            try {
                const nameParts = (user.name || "User").split(" ");
                const clerkUser = await clerkClient.users.createUser({
                    emailAddress: [email],
                    password: password,
                    firstName: nameParts[0],
                    lastName: nameParts.slice(1).join(" ") || undefined,
                });

                await prisma.user.update({
                    where: { id: user.id },
                    data: { clerkId: clerkUser.id },
                });
                logger.info(`[${requestId}] Legacy user synced with Clerk`, { email, clerkId: clerkUser.id });
            } catch (clerkError: any) {
                // If Clerk says the email already exists, look up and link
                if (clerkError?.errors?.[0]?.code === "form_identifier_exists") {
                    const existingClerkUsers = await clerkClient.users.getUserList({
                        emailAddress: [email],
                    });
                    if (existingClerkUsers.data.length > 0) {
                        const clerkId = existingClerkUsers.data[0].id;
                        await prisma.user.update({
                            where: { email },
                            data: { clerkId },
                        });
                        logger.info(`[${requestId}] Linked existing Clerk user`, { email, clerkId });
                    }
                } else {
                    // Log full error details for debugging
                    logger.error(`[${requestId}] Clerk sync failed (non-blocking)`, {
                        error: clerkError?.message,
                        status: clerkError?.status,
                        clerkErrors: JSON.stringify(clerkError?.errors),
                        clerkTraceId: clerkError?.clerkTraceId,
                        fullError: JSON.stringify(clerkError, null, 2),
                    });
                }
            }
        }

        // 4. Issue JWT token and return
        const token = jwt.sign({
            id: user.id,
            email: user.email,
            pfp: user.profileAvatar,
            name: user.name,
        }, process.env.JWT_SECRET!);

        logger.info(`[${requestId}] Login successful via syncWithClerk`, { email });

        res.status(200).json({
            msg: "login success",
            token,
        });
        return;

    } catch (error: any) {
        logger.error(`[${requestId}] syncWithClerk error`, {
            error: error?.message,
            stack: error?.stack,
            email,
        });
        res.status(500).json({ msg: "Internal server error" });
        return;
    }
};