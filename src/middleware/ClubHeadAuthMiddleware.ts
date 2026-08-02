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

// Helper to resolve user ID from req.id or JWT token
const getUserId = (req: Request, res: Response): string | null => {
  if (req.id) return req.id;

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Please login' });
    return null;
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Please signin, Unauthorized' });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && 'id' in decoded) {
      req.id = (decoded as jwt.JwtPayload).id as string;
      req.isVerified = (decoded as jwt.JwtPayload).isVerified as boolean;
      return req.id;
    }
    res.status(401).json({ message: 'Invalid token format' });
    return null;
  } catch (error: any) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ msg: 'Token expired' });
    } else {
      res.status(401).json({ msg: 'Invalid token' });
    }
    return null;
  }
};

// middleware to authenticate user as club head (founder of a club) or core member
export const ClubHeadAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);

      if (typeof decoded === 'object' && 'id' in decoded) {
        req.id = (decoded as jwt.JwtPayload).id as string;
        req.isVerified = (decoded as jwt.JwtPayload).isVerified as boolean;

        // Check if user is a club head (founder) or core member.
        const user = await prisma.user.findUnique({
          where: { id: req.id },
          select: { email: true }
        });

        if (!user) {
          res.status(404).json({ message: 'User not found' });
          return;
        }

        const club = await prisma.clubs.findFirst({
          where: {
            OR: [
              { founderEmail: { equals: user.email, mode: 'insensitive' } },
              { coremember1: { equals: user.email, mode: 'insensitive' } },
              { coremember2: { equals: user.email, mode: 'insensitive' } },
              { coremember3: { equals: user.email, mode: 'insensitive' } },
            ],
          },
          select: { id: true, name: true }
        });

        if (!club) {
          res.status(403).json({ 
            message: 'Access denied. Only club heads and core members can perform this action.' 
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
      return;
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({ msg: 'Token expired' });
        return;
      }
      res.status(401).json({ msg: 'Invalid token' });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      msg: 'error occured in processing token, either token not found or is invalid.',
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user.email || user.email.toLowerCase() === 'none') {
      res.status(403).json({ message: 'Invalid user email. Cannot verify club membership.' });
      return;
    }

    const club = await prisma.clubs.findFirst({
      where: {
        OR: [
          { founderEmail: { equals: user.email, mode: 'insensitive' } },
          { coremember1: { equals: user.email, mode: 'insensitive' } },
          { coremember2: { equals: user.email, mode: 'insensitive' } },
          { coremember3: { equals: user.email, mode: 'insensitive' } },
        ],
      },
      select: { id: true, name: true }
    });

    if (!club) {
      res.status(403).json({ 
        message: 'Access denied. Only club heads and core members can perform this action.' 
      });
      return;
    }

    req.clubId = club.id;
    req.clubName = club.name;

    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: 'Internal server error processing authentication' });
  }
};

// Middleware that ensures the authenticated user is the club head or core member of the specific
// club which owns a given resource (identified by :eventId, :clubId, or body/query in params).
export const SpecificClubHeadAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = getUserId(req, res);
    if (!userId) return;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true }
    });

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (!user.email || user.email.toLowerCase() === 'none') {
      res.status(403).json({ message: 'Invalid user email. Cannot verify club membership.' });
      return;
    }

    const emailLower = user.email.toLowerCase();
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

      const isClubHead = eventClub && eventClub.founderEmail && eventClub.founderEmail.toLowerCase() === emailLower;
      const isCoreMember = eventClub && [eventClub.coremember1, eventClub.coremember2, eventClub.coremember3].some(
        (cm) => cm && cm.toLowerCase() !== 'none' && cm.toLowerCase() === emailLower
      );
      const isEventCreator = event.createdById === userId;

      if (!isClubHead && !isCoreMember && !isEventCreator) {
        res.status(403).json({ message: 'Access denied. Only club heads, core members, or event creators can manage this event.' });
        return;
      }

      if (eventClub) {
        req.clubId = eventClub.id;
        req.clubName = eventClub.name;
      }
    } else if (clubIdParam) {
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

      const isClubHead = club.founderEmail && club.founderEmail.toLowerCase() === emailLower;
      const isCoreMember = [club.coremember1, club.coremember2, club.coremember3].some(
        (cm) => cm && cm.toLowerCase() !== 'none' && cm.toLowerCase() === emailLower
      );

      if (!isClubHead && !isCoreMember) {
        res.status(403).json({ message: 'Access denied. Only club heads and core members can perform this action.' });
        return;
      }

      req.clubId = club.id;
      req.clubName = club.name;
    } else {
      // General check: user must be founder/core of at least one club
      const userClub = await prisma.clubs.findFirst({
        where: {
          OR: [
            { founderEmail: { equals: user.email, mode: 'insensitive' } },
            { coremember1: { equals: user.email, mode: 'insensitive' } },
            { coremember2: { equals: user.email, mode: 'insensitive' } },
            { coremember3: { equals: user.email, mode: 'insensitive' } },
          ],
        },
        select: { id: true, name: true }
      });

      if (!userClub) {
        res.status(403).json({ message: 'Access denied. Only club heads can perform this action.' });
        return;
      }

      req.clubId = userClub.id;
      req.clubName = userClub.name;
    }

    next();
  } catch (error) {
    logger.error(error);
    res.status(500).json({ msg: 'Internal server error processing specific club authorization' });
  }
};
