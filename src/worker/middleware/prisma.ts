/**
 * Middleware that attaches the isolate's shared Prisma Accelerate client to
 * the Hono context. This is the CF-safe way to handle
 * DB connections — no persistent TCP pool, just HTTP via Accelerate.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { getPrismaClient } from '../db';

export const prismaMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  // Reused across requests in this isolate (see db.ts for why).
  const client = getPrismaClient(c.env.DATABASE_URL);
  c.set('prisma', client as any);
  await next();
};
