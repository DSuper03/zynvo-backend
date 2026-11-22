import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { getLeaderboard, parseLeaderboardOptions } from '../utils/leaderboard';
import { rateLimiter } from '../middleware/ratelimit';
import { logger } from '../logger';
import {
  leaderboardCacheKey,
  leaderboardCacheSeconds,
} from '../utils/leaderboard-cache';

const router = new Hono<HonoEnv>();
router.use('*', async (c, next) => {
  c.header('Cache-Control', 'no-store');
  await next();
});
router.get('/', rateLimiter(30), async (c) => {
  c.header('Cache-Control', 'no-store');
  let options;
  try {
    options = parseLeaderboardOptions(new URL(c.req.url).searchParams);
  } catch {
    return c.json({ msg: 'Invalid leaderboard filters' }, 400);
  }
  // Cache API is local to the Cloudflare data centre. Never memoize in-flight
  // Prisma promises: a later Worker request cannot await another request's I/O.
  const cache =
    typeof caches === 'undefined'
      ? undefined
      : (caches as CacheStorage & { default?: Cache }).default;
  const key = leaderboardCacheKey(c.req.url, options);
  if (cache) {
    try {
      const hit = await cache.match(key);
      if (hit) return hit;
    } catch {
      // Cache availability must not prevent a fresh database read.
    }
  }
  try {
    const data = await getLeaderboard(c.get('prisma'), options);
    // The Next.js proxy forwards this response without another cache layer.
    const ttl = leaderboardCacheSeconds(
      options,
      new Date(data.generatedAt),
      new Date()
    );
    c.header(
      'Cache-Control',
      ttl > 0 ? `public, max-age=0, s-maxage=${ttl}` : 'no-store'
    );
    const response = c.json(data);
    if (cache && ttl > 0) {
      try {
        // A cache failure is harmless, and an unhandled waitUntil rejection
        // would incorrectly alert operations about an otherwise successful read.
        c.executionCtx.waitUntil(
          cache.put(key, response.clone()).catch(() => undefined)
        );
      } catch {
        // No execution context in tests or non-Worker runtimes.
      }
    }
    return response;
  } catch (error) {
    logger.error('Leaderboard query failed', {
      error: error instanceof Error ? error.name : 'UnknownError',
    });
    return c.json(
      { msg: 'Unable to load leaderboard. Please try again.' },
      500
    );
  }
});
export default router;
