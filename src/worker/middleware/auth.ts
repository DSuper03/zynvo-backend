import type { MiddlewareHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import { verify } from 'hono/jwt';
import type { HonoEnv } from '../types';
import { logger } from '../logger';

const toStatus = (code: number): ContentfulStatusCode =>
  code >= 200 && code < 600 && code !== 204 ? (code as ContentfulStatusCode) : 500;

// ── authMiddleware ─────────────────────────────────────────────
// Verifies Bearer JWT, sets userId + isVerified on context variables.

export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const authHeader = c.req.header('authorization') ?? c.req.header('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return c.json({ msg: 'Please login' }, toStatus(401));
  }
  const token = authHeader.split(' ')[1];
  if (!token) return c.json({ msg: 'Please login' }, toStatus(401));

  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    if (typeof decoded !== 'object' || !decoded || !('id' in decoded)) {
      return c.json({ msg: 'Invalid token format' }, toStatus(401));
    }
    c.set('userId', decoded.id as string);
    c.set('isVerified', (decoded.isVerified as boolean) ?? false);
    await next();
  } catch (err: any) {
    logger.warn('JWT verification failed', { error: err.message });
    if (err.message?.includes('expired')) {
      return c.json({ msg: 'Token expired' }, toStatus(401));
    }
    return c.json({ msg: 'Invalid token' }, toStatus(401));
  }
};

// ── adminAuthMiddleware ────────────────────────────────────────
// Must run after authMiddleware. Checks if the user's email is in ADMIN_EMAILS.

export const adminAuthMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ message: 'Please login' }, toStatus(401));

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return c.json({ message: 'User not found' }, toStatus(404));

  const adminEmails = [
    'zynvosocial@gmail.com',
    'rishirajnatj@gmail.com',
    ...(c.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean),
  ].map((e) => e.toLowerCase());

  if (!adminEmails.includes(user.email.toLowerCase())) {
    return c.json({ message: 'Access denied. Administrator privileges required.' }, toStatus(403));
  }
  await next();
};

// ── clubHeadAuthMiddleware ─────────────────────────────────────
// Must run after authMiddleware. Validates the caller is a club founder
// and sets clubId / clubName / clubCollege on context variables.

export const clubHeadAuthMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ msg: 'Please login' }, toStatus(401));

  const prisma = c.get('prisma');

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true },
    });
    if (!user) return c.json({ message: 'User not found' }, toStatus(404));

    const club = await prisma.clubs.findUnique({
      where: { founderEmail: user.email },
      select: { id: true, name: true, collegeName: true },
    });
    if (!club) {
      return c.json(
        { message: 'Access denied. Only club heads can perform this action.' },
        toStatus(403),
      );
    }

    c.set('userEmail', user.email);
    c.set('clubId', club.id);
    c.set('clubName', club.name);
    c.set('clubCollege', club.collegeName);
    await next();
  } catch (err: any) {
    logger.error('clubHeadAuthMiddleware error', { error: err.message });
    return c.json({ msg: 'Internal server error' }, toStatus(500));
  }
};

// ── adminCoreAuthMiddleware ────────────────────────────────────
// Must run after authMiddleware. Allows site admins OR club core members
// for routes that need event-level admin access.

export const adminCoreAuthMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const userId = c.get('userId');
  if (!userId) return c.json({ message: 'Please login' }, toStatus(401));

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return c.json({ message: 'User not found' }, toStatus(404));

  const adminEmails = [
    'zynvosocial@gmail.com',
    'rishirajnatj@gmail.com',
    ...(c.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean),
  ].map((e) => e.toLowerCase());

  if (adminEmails.includes(user.email.toLowerCase())) {
    await next();
    return;
  }

  // Check if user is a core member of the club hosting the event
  const eventId = c.req.param('id') || c.req.param('eventId');
  if (!eventId) return c.json({ message: 'Event id required' }, toStatus(400));

  const event = await prisma.event.findUnique({ where: { id: eventId }, select: { clubId: true } });
  if (!event) return c.json({ message: 'Event not found' }, toStatus(404));

  const club = await prisma.clubs.findUnique({
    where: { id: event.clubId },
    select: { founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
  });
  if (!club) return c.json({ message: 'Club not found' }, toStatus(404));

  const userEmail = user.email.toLowerCase();
  const isCore = [club.founderEmail, club.coremember1, club.coremember2, club.coremember3]
    .some((e) => e && e.toLowerCase() === userEmail);

  if (isCore) { await next(); return; }

  return c.json({ message: 'Access denied' }, toStatus(403));
};
