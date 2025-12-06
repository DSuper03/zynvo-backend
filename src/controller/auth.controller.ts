import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { prisma } from '../db/db';
import { signupSchema, newPWschema } from '../types/formtypes';
import { generateRequestId } from '../utils/helper';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import mail from '../utils/nodemailer';
import { getSignupVerificationEmailHTML, getResendVerificationEmailHTML } from '../utils/authEmail';


const genToken = (): string => {
    return crypto.randomBytes(20).toString('hex');
};

export const signup = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const { name, email, collegeName, password } = req.body;
    const avatarUrl = req.body.avatarUrl;

    logger.info(`[${requestId}] POST /signup - Starting signup`, {
        email,
        collegeName
    });

    const parsedData = signupSchema.safeParse(req.body);
    if (!parsedData.success) {
        logger.error(`[${requestId}] Incorrect inputs`, parsedData.error);
        res.status(411).json({ msg: 'incorrect inputs' });
        return;
    }

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
            select: {
                id: true,
                isVerified: true,
            }
        });

        if (existingUser) {
            if (!existingUser.isVerified) {
                logger.warn(`[${requestId}] User exists but not verified`, { email });
                res.status(400).json({
                    msg: "please verify yourself"
                });
                return;
            } else {
                logger.warn(`[${requestId}] User already exists`, { email });
                res.status(409).json({
                    msg: "User already exists, please login"
                });
                return;
            }
        }

        if (collegeName === "zynvo college" || name === "zynvo") {
            logger.warn(`[${requestId}] Reserved name attempt`, { name, collegeName });
            res.status(400).json({
                msg: "Please Sign Up first and verify yourself."
            });
            return;
        }

        logger.info(`[${requestId}] Creating new user`, { email, name });

        const hashedPassword = bcrypt.hashSync(parsedData.data.password, 10);
        const vToken = genToken();

        try {
            const newUser = await prisma.$transaction(async (tx) => {
            const created = await tx.user.create({
                data: {
                email: parsedData.data.email,
                name: parsedData.data.name,
                password: hashedPassword,
                collegeName: collegeName,
                profileAvatar: avatarUrl,
                vToken: vToken,
                expiryToken: Math.floor(Date.now() / 1000),
                ValidFor: 86400000,
                },
                select: {
                id: true,
                profileAvatar: true,
                name: true,
                }
            });

            const url = `https://zynvo.social/verification-mail?token=${vToken}&email=${parsedData.data.email}`;
            const emailHTML = getSignupVerificationEmailHTML(parsedData.data.name, url);

            // If mail fails, throw to rollback the transaction
            const sendMail = await mail(
                parsedData.data.name,
                parsedData.data.email,
                'One click away from greatness (seriously, just one)',
                emailHTML
            );

            if (!sendMail) {
                throw new Error('MAIL_FAILED');
            }

            return created;
            });

            logger.info(`[${requestId}] User created successfully`, {
            userId: newUser.id,
            email
            });

            const id = newUser.id;
            const token = jwt.sign({
            id,
            email,
            pfp: newUser.profileAvatar,
            name: newUser.name
            }, process.env.JWT_SECRET!);

            res.status(200).json({
            msg: 'account created',
            token
            });
            return;
        } catch (err: any) {
            if ((err as Error).message === 'MAIL_FAILED') {
            logger.error(`[${requestId}] Error sending verification email`, { email });
            res.status(400).json({
                msg: "error in sending mail"
            });
            return;
            }
            // rethrow so outer catch can handle other errors
            throw err;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error in signup`, {
            error: error.message,
            stack: error.stack,
            email
        });
        console.log(error);
        res.status(500).json({ msg: 'internal server error' });
        return;
    }
};


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

export const resendEmail = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const email = req.query.email as string;

    logger.info(`[${requestId}] POST /ResendEmail - Starting request`, { email });

    try {
        const exists = await prisma.user.findUnique({
            where: { email: email },
            select: { name: true }
        });

        if (exists && exists.name) {
            logger.info(`[${requestId}] Regenerating verification token`, { email });

            const vToken = genToken();
            const update = await prisma.user.update({
                where: { email: email },
                data: {
                    vToken: vToken,
                    expiryToken: Math.floor(Date.now() / 1000)
                }
            });

            if (update) {
                const url = `https://zynvo.social/verification-mail?token=${vToken}&email=${email}`;
                const emailHTML = getResendVerificationEmailHTML(exists.name, url);

                const sendMail = await mail(
                    exists.name,
                    email,
                    'One click away from greatness (seriously, just one)',
                    emailHTML
                );

                if (sendMail) {
                    logger.info(`[${requestId}] Verification email resent`, { email });
                    res.status(200).json({
                        msg: "Email sent successfully"
                    });
                    return;
                } else {
                    logger.error(`[${requestId}] Error sending email`, { email });
                    res.status(400).json({
                        msg: "Error in sending mail"
                    });
                    return;
                }
            } else {
                logger.error(`[${requestId}] Error updating token`, { email });
                res.status(500).json({
                    msg: "Error updating token"
                });
                return;
            }
        } else {
            logger.warn(`[${requestId}] User not found`, { email });
            res.status(200).json({
                msg: "No such user"
            });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error resending email`, {
            error: error.message,
            stack: error.stack,
            email
        });
        console.log(error);
        res.status(500).json({
            msg: "internal server error"
        });
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const vToken = req.query.vToken as string;

    logger.info(`[${requestId}] POST /verify - Starting verification`, { vToken });

    if (!vToken) {
        logger.warn(`[${requestId}] Invalid token provided`);
        res.status(404).json({
            msg: 'bad response, invalid token',
        });
        return;
    }

    try {
        const user = await prisma.user.findFirst({
            where: { vToken: vToken },
            select: {
                id: true,
                expiryToken: true,
                ValidFor: true,
            }
        });

        if (!user) {
            logger.warn(`[${requestId}] No user found for token`, { vToken });
            res.status(400).json({
                msg: 'no user found, Invalid token',
            });
            return;
        }

        const expTime = user.expiryToken as number;
        const currentTime = Math.floor(Date.now() / 1000);
        const ValidFor = user.ValidFor as number;

        if (currentTime - expTime <= ValidFor / 1000) {
            logger.info(`[${requestId}] Token valid, verifying user`, { userId: user.id });

            const verified = await prisma.user.update({
                where: { id: user.id },
                data: { isVerified: true },
                select: {
                    id: true,
                    isVerified: true,
                }
            });

            const id = verified.id;
            const isVerified = verified.isVerified;

            const token = jwt.sign({ id, isVerified }, process.env.JWT_SECRET!);

            logger.info(`[${requestId}] User verified successfully`, { userId: id });

            res.status(200).json({
                msg: 'Verified successfully',
                token,
            });
            return;
        } else {
            logger.warn(`[${requestId}] Token expired`, { userId: user.id });
            res.status(400).json({
                msg: 'expired',
            });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error verifying email`, {
            error: error.message,
            stack: error.stack,
            vToken
        });
        res.status(500).json({
            msg: 'internal server error',
        });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const requestId = generateRequestId();
    const userID = req.id;
    const { password, newPassword } = req.body;

    logger.info(`[${requestId}] PUT /reset-password - Starting request`, { userId: userID });

    const parsedData = newPWschema.safeParse(req.body);
    if (!parsedData.success) {
        logger.warn(`[${requestId}] Invalid password format`, { userId: userID });
        res.json({
            msg: 'invalid password format',
        });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userID },
            select: {
                id: true,
                password: true,
            }
        });

        if (!user) {
            logger.warn(`[${requestId}] User not found`, { userId: userID });
            res.status(404).json({
                msg: 'invalid user, no such user',
            });
            return;
        }

        const pw = user.password as string;

        if (bcrypt.compareSync(password, pw)) {
            logger.info(`[${requestId}] Current password verified, updating`, { userId: userID });

            const update = await prisma.user.update({
                where: { id: user.id },
                data: {
                    password: bcrypt.hashSync(parsedData.data.password, 10),
                },
                select: { id: true }
            });

            logger.info(`[${requestId}] Password updated successfully`, { userId: update.id });

            res.status(200).json({
                msg: 'password updated successfully',
            });
            return;
        } else {
            logger.warn(`[${requestId}] Current password incorrect`, { userId: userID });
            res.status(403).json({
                msg: 'Current password is incorrect',
            });
            return;
        }
    } catch (error: any) {
        logger.error(`[${requestId}] Error resetting password`, {
            error: error.message,
            stack: error.stack,
            userId: userID
        });
        res.status(500).json({ msg: 'internal server error' });
    }
};
