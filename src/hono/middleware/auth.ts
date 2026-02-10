import type { MiddlewareHandler } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';
import jwt from 'jsonwebtoken';
import { prisma } from '../../db/db';
import { logger } from '../../utils/logger';
import type { HonoEnv } from '../types';

const getAuthHeader = (value: string | undefined): string | null => {
  if (!value) return null;
  if (!value.startsWith('Bearer ')) return null;
  return value.split(' ')[1] ?? null;
};

const toContentfulStatus = (statusCode: number): ContentfulStatusCode => {
  if (statusCode >= 200 && statusCode < 600 && statusCode !== 204) {
    return statusCode as ContentfulStatusCode;
  }
  return 500;
};

const resolveAuth = (
  authHeader: string | undefined,
  onError: (payload: Record<string, unknown>, status: number) => Response,
): { id: string; isVerified: boolean } | Response => {
  const token = getAuthHeader(authHeader);
  if (!token) {
    return onError({ message: 'Please login' }, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if (typeof decoded === 'object' && decoded && 'id' in decoded) {
      return {
        id: (decoded as jwt.JwtPayload).id as string,
        isVerified: (decoded as jwt.JwtPayload).isVerified as boolean,
      };
    }
    return onError({ message: 'Invalid token format' }, 401);
  } catch (error: any) {
    logger.error(error);
    if (error instanceof jwt.TokenExpiredError) {
      return onError({ msg: 'Token expired' }, 401);
    }
    return onError({ msg: 'Invalid token' }, 401);
  }
};

export const authMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const authHeader =
    c.req.header('authorization') ?? c.req.header('Authorization');

  const result = resolveAuth(authHeader, (payload, status) =>
    c.json(payload, toContentfulStatus(status)),
  );

  if (result instanceof Response) {
    return result;
  }

  c.set('userId', result.id);
  c.set('isVerified', result.isVerified);

  await next();
};

export const clubHeadAuthMiddleware: MiddlewareHandler<HonoEnv> = async (
  c,
  next,
) => {
  const authHeader =
    c.req.header('authorization') ?? c.req.header('Authorization');

  const result = resolveAuth(authHeader, (payload, status) =>
    c.json(payload, toContentfulStatus(status)),
  );

  if (result instanceof Response) {
    return result;
  }

  c.set('userId', result.id);
  c.set('isVerified', result.isVerified);

  try {
    const user = await prisma.user.findUnique({
      where: { id: result.id },
      select: { email: true },
    });

    if (!user) {
      return c.json({ message: 'User not found' }, toContentfulStatus(404));
    }

    const club = await prisma.clubs.findUnique({
      where: { founderEmail: user.email },
      select: { id: true, name: true, collegeName: true },
    });

    if (!club) {
      return c.json(
        { message: 'Access denied. Only club heads can perform this action.' },
        toContentfulStatus(403),
      );
    }

    c.set('clubId', club.id);
    c.set('clubName', club.name);
    c.set('clubCollege', club.collegeName);
  } catch (error: any) {
    logger.error(error);
    return c.json({ msg: 'Invalid token' }, toContentfulStatus(401));
  }

  await next();
};
