import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/db';


declare global {
  namespace Express {
    interface Request {
      id: string;
      isVerified: boolean;
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

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Please login');
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
        next();
      } else {
        res.status(401).json({
          message: 'Invalid token format',
        });
        return
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
