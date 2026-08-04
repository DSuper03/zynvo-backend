import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/db';
import { logger } from '../utils/logger';

// Site-level admin accounts that are always allowed, regardless of env config.
const DEFAULT_ADMIN_EMAILS = ['zynvosocial@gmail.com'];

/**
 * Admin-only guard for global endpoints (e.g. broadcast notifications).
 *
 * Must run AFTER AuthMiddleware so `req.id` is populated. Allows the request
 * only when the authenticated user's email is in the site-admin list
 * (ADMIN_EMAILS env var, comma-separated, plus the default accounts).
 */
export const AdminAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.id;
  if (!userId) {
    res.status(401).json({ msg: 'Please login' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });

    if (!user || !user.email) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    const adminEmails = new Set(
      [
        ...DEFAULT_ADMIN_EMAILS,
        ...(process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean),
      ].map((e) => e.toLowerCase())
    );

    if (adminEmails.has(user.email.toLowerCase())) {
      next();
      return;
    }

    logger.warn('Non-admin attempted admin action', { userId });
    res.status(403).json({ msg: 'Forbidden: admin access required' });
  } catch (error: any) {
    logger.error('AdminAuthMiddleware failed', { error: error.message });
    res.status(500).json({ msg: 'Internal server error' });
  }
};
