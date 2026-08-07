import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/db';

export const AdminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.id;
    if (!userId) {
      res.status(401).json({ message: 'Please login' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user || !user.email) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = [
      'zynvosocial@gmail.com',
      'rishirajnatj@gmail.com', // Default admin access
      ...adminEmailsEnv.split(',').map((e) => e.trim()).filter(Boolean),
    ];

    const userEmail = user.email.toLowerCase();
    const isSiteAdmin = adminEmails.map((e) => e.toLowerCase()).includes(userEmail);

    if (isSiteAdmin) {
      next();
      return;
    }

    res.status(403).json({ message: 'Access denied. Administrator privileges required.' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
