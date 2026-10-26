/**
 * Lightweight in-memory rate limiter for CF Workers.
 * Uses a sliding window counter stored in a Map.
 * Good enough for the free/paid Workers tier — for multi-region
 * deployments use Cloudflare Rate Limiting rules instead.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';

type WindowEntry = { count: number; resetAt: number };

const store = new Map<string, WindowEntry>();

/**
 * @param limit   Max requests per window
 * @param windowMs  Window size in milliseconds (default 15 min)
 */
export const rateLimiter = (
  limit = 100,
  windowMs = 15 * 60 * 1000,
): MiddlewareHandler<HonoEnv> => {
  return async (c, next) => {
    const ip =
      c.req.header('cf-connecting-ip') ??
      c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
      'unknown';

    const key = `rl:${ip}`;
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      await next();
      return;
    }

    if (entry.count >= limit) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      c.header('Retry-After', String(retryAfter));
      return c.json({ msg: 'Too many requests, please try again later.' }, 429);
    }

    entry.count++;
    await next();
  };
};
