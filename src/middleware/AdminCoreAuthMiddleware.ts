import { NextFunction, Request, Response } from 'express';
import { prisma } from '../db/db';

// middlewaere to check if user is admin/core member of the club hosting the event
export const AdminCoreAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Expect AuthMiddleware to have already set req.id
    const userId = req.id;
    if (!userId) {
      res.status(401).json({ msg: 'Please login' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
    if (!user || !user.email) {
      res.status(404).json({ msg: 'User not found' });
      return;
    }

    const eventId = (req.params.id || req.params.eventId) as string;
    if (!eventId) {
      res.status(400).json({ msg: 'Event ID required' });
      return;
    }

    const event = await prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true } });
    if (!event) {
      res.status(404).json({ msg: 'Event not found' });
      return;
    }

    const club = await prisma.clubs.findUnique({
      where: { id: event.clubId },
      select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true }
    });

    if (!club) {
      res.status(404).json({ msg: 'Club not found' });
      return;
    }

    // Site-level admins via env var (comma-separated emails)
    const adminEmailsEnv = process.env.ADMIN_EMAILS || '';
    const adminEmails = adminEmailsEnv.split(',').map(e => e.trim()).filter(Boolean);

    const userEmail = user.email.toLowerCase();
    const isFounder = club.founderEmail && club.founderEmail.toLowerCase() === userEmail;
    const isCore = [club.coremember1, club.coremember2, club.coremember3].some(
      (c) => c && c.toLowerCase() === userEmail
    );
    const isSiteAdmin = adminEmails.map(e => e.toLowerCase()).includes(userEmail);

    if (isFounder || isCore || isSiteAdmin) {
      next();
      return;
    }

    res.status(403).json({ msg: 'Access denied' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

export default AdminCoreAuthMiddleware;
