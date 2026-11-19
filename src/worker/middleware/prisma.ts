/**
 * Middleware that lends this request a Prisma Accelerate client from the
 * isolate's pool (see db.ts) and returns it once the request — including its
 * waitUntil() background work — is finished. No persistent TCP pool: queries
 * are HTTP calls via Accelerate.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { acquirePrismaClient } from '../db';
import { requestLogMatches } from '../logger';

// What Workers throws when a request waits on a promise another, finished,
// request created. A client that produced it is broken: never reuse it.
const DEAD_PROMISE = /created by a request that has since ended|can never settle|handle_cross_request_promise_resolution/i;

export const prismaMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  // The health check never touches the database.
  if (c.req.path === '/health') return next();

  const lease = await acquirePrismaClient(c.env.DATABASE_URL);
  c.set('prisma', lease.client as any);
  try {
    await next();
  } finally {
    // The error may have reached Hono's onError (c.error) or been caught by a
    // route and only logged; check both.
    if (DEAD_PROMISE.test(String(c.error?.message ?? '')) || requestLogMatches(DEAD_PROMISE)) {
      lease.discard();
    }

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
