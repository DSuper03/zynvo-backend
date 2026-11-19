/**
 * Middleware that lends this request a Prisma Accelerate client from the
 * isolate's pool (see db.ts) and returns it once the request — including its
 * waitUntil() background work — is finished. No persistent TCP pool: queries
 * are HTTP calls via Accelerate.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { acquirePrismaClient } from '../db';

export const prismaMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const lease = acquirePrismaClient(c.env.DATABASE_URL);
  c.set('prisma', lease.client as any);
  try {
    await next();
  } finally {
    let ctx: { waitUntil(p: Promise<unknown>): void } | undefined;
    try {
      ctx = c.executionCtx;
    } catch {
      // No execution context (tests): nothing runs after the response.
    }
    const pending = ((ctx as any)?.pendingWork as Promise<unknown>[] | undefined) ?? [];
    if (ctx && pending.length > 0) {
      ctx.waitUntil(Promise.allSettled([...pending]).then(() => lease.release()));
    } else {
      lease.release();
    }
  }
};
