/**
 * Middleware that creates a per-request Prisma Accelerate client and
 * attaches it to the Hono context. This is the CF-safe way to handle
 * DB connections — no persistent TCP pool, just HTTP via Accelerate.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { createPrismaClient } from '../db';

export const prismaMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const client = createPrismaClient(c.env.DATABASE_URL);
  c.set('prisma', client as any);
  await next();
};
