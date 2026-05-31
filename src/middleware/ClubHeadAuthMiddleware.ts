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

// middleware to authenticate user as club head (founder of a club)

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

        const eventId = (req.params.eventId || req.body.eventId || req.query.eventId || req.params.id) as string | undefined;
        const clubIdParam = req.params.clubId as string | undefined;

        if (eventId) {
          const event = await prisma.event.findUnique({ 
            where: { id: eventId }, 
            select: { clubId: true, createdById: true } 
          });
          if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
          }

          // Fetch the event's club to check if user is a core member
          const eventClub = await prisma.clubs.findUnique({
            where: { id: event.clubId },
            select: { 
              id: true, 
              name: true, 
              founderEmail: true, 
              coremember1: true, 
              coremember2: true, 
              coremember3: true 
            }
          });

          // Check if user is the club head of the event's club
          const isClubHead = eventClub && eventClub.founderEmail === user.email;
          
          // Check if user is a core member of the event's club
          const isCoreMember = eventClub && (
            eventClub.coremember1 === user.email || 
            eventClub.coremember2 === user.email || 
            eventClub.coremember3 === user.email
          );
          
          // Check if user is the creator of the event
          const isEventCreator = event.createdById === req.id;

          if (!isClubHead && !isCoreMember && !isEventCreator) {
            res.status(403).json({ message: 'Access denied. Only club heads, core members, or event creators can manage this event.' });
            return;
          }

          // Set club info from event's club if not already set
          if (!userClub && eventClub) {
            req.clubId = eventClub.id;
            req.clubName = eventClub.name;
          }
        } else if (clubIdParam) {
          // For club-level operations, check if user is club head or core member
          const club = await prisma.clubs.findUnique({
            where: { id: clubIdParam },
            select: { 
              id: true, 
              name: true, 
              founderEmail: true, 
              coremember1: true, 
              coremember2: true, 
              coremember3: true 
            }
          });

          if (!club) {
            res.status(404).json({ message: 'Club not found' });
            return;
          }

          const isClubHead = club.founderEmail === user.email;
          const isCoreMember = (
            club.coremember1 === user.email || 
            club.coremember2 === user.email || 
            club.coremember3 === user.email
          );

          if (!isClubHead && !isCoreMember) {
            res.status(403).json({ message: 'Access denied. Only club heads and core members can perform this action.' });
            return;
          }

          req.clubId = club.id;
          req.clubName = club.name;
        } else {
          // No specific event or club - check if user is a club head
          if (!userClub) {
            res.status(403).json({ message: 'Access denied. Only club heads can perform this action.' });
            return;
          }
        }

        // Ensure club info is set
        if (!req.clubId && userClub) {
          req.clubId = userClub.id;
          req.clubName = userClub.name;
        }

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