import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/db';


declare global {
  namespace Express {
    interface Request {
      id: string;
      isVerified: boolean;
      clubId?: string;
      clubName?: string;
    }
  }
}



export const ClubHeadAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // First run the regular auth middleware
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        message: 'Please login',
      });
      return;
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({
        message: 'Please signin ,Unauthorized',
      });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof decoded === 'object' && 'id' in decoded) {
        req.id = (decoded as jwt.JwtPayload).id as string;
        req.isVerified = (decoded as jwt.JwtPayload).isVerified as boolean;

        // Check if user is a club head (founder)
        const user = await prisma.user.findUnique({
          where: { id: req.id },
          select: { email: true }
        });

        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const club = await prisma.clubs.findUnique({
          where: { founderEmail: user.email },
          select: { id: true, name: true }
        });

        if (!club) {
          res.status(403).json({ 
            message: 'Access denied. Only club heads can perform this action.' 
          });
          return;
        }

        // Add club info to request for potential use
        (req as any).clubId = club.id;
        (req as any).clubName = club.name;

        next();
      } else {
        res.status(401).json({
          message: 'Invalid token format',
        });
        return;
      }
    } catch (error: any) {
      logger.error(error);
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ msg: 'Token expired' });
      }
      res.status(401).json({ msg: 'Invalid token' });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'error occured in processing token, either token not found or is invalid.',
    });
  }
};

// Middleware that ensures the authenticated user is the club head of the specific
// club which owns a given resource (identified by :eventId or :clubId in params).
export const SpecificClubHeadAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Please login' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Please signin ,Unauthorized' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof decoded === 'object' && 'id' in decoded) {
        req.id = (decoded as jwt.JwtPayload).id as string;
        req.isVerified = (decoded as jwt.JwtPayload).isVerified as boolean;

        const user = await prisma.user.findUnique({
          where: { id: req.id },
          select: { email: true }
        });

        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const userClub = await prisma.clubs.findUnique({
          where: { founderEmail: user.email },
          select: { id: true, name: true }
        });

        if (!userClub) {
          res.status(403).json({ message: 'Access denied. Only club heads can perform this action.' });
          return;
        }

        const eventId = req.params.eventId as string | undefined;
        const clubIdParam = req.params.clubId as string | undefined;

        if (eventId) {
          const event = await prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true } });
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }
          if (event.clubId !== userClub.id) {
            res.status(403).json({ message: 'Access denied. You are not the club head of the club that created this event.' });
            return;
          }
        } else if (clubIdParam) {
          if (clubIdParam !== userClub.id) {
            res.status(403).json({ message: 'Access denied. You are not the club head of this club.' });
            return;
          }
        }

        req.clubId = userClub.id;
        req.clubName = userClub.name;

        next();
      } else {
        res.status(401).json({ message: 'Invalid token format' });
        return;
      }
    } catch (error: any) {
      logger.error(error);
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ msg: 'Token expired' });
        return;
      }
      res.status(401).json({ msg: 'Invalid token' });
      return;
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ msg: 'error occured in processing token, either token not found or is invalid.' });
  }
};