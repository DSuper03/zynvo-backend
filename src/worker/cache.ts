/**
 * Read caching for public data.
 *
 * 1. Prisma Accelerate query cache (shared by every isolate, cleared by tag).
 *    `cached(args, { ttl, tags })` adds a cacheStrategy to a query's args.
 *    Writes clear tags through `invalidateOnWrite` (see index.ts), so lists
 *    and pages refresh as soon as an event or club changes; ttl is only a
 *    safety net.
 * 2. `memo()`: a small in-memory cache per isolate for near-static answers.
 *    It skips Prisma entirely (saving Free-plan CPU), but each isolate has its
 *    own copy and writes don't clear it, so use it only where a few minutes of
 *    staleness is harmless.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from './types';
import { logger } from './logger';

export type CacheTag = 'events' | 'clubs' | 'colleges';

type CacheOptions = { ttl: number; swr?: number; tags?: CacheTag[] };

/** Returns the same query args with an Accelerate cacheStrategy attached. */
export function cached<T extends object>(args: T, { ttl, swr = ttl, tags }: CacheOptions): T {
  return { ...args, cacheStrategy: { ttl, swr, ...(tags?.length ? { tags } : {}) } } as T;
}

const INVALIDATE_TIMEOUT_MS = 3000;

export async function invalidateTags(prisma: unknown, tags: CacheTag[]): Promise<void> {
  const accelerate = (prisma as any)?.$accelerate;
  if (!accelerate?.invalidate || tags.length === 0) return;
  try {
    await Promise.race([
      accelerate.invalidate({ tags }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), INVALIDATE_TIMEOUT_MS)),
    ]);
  } catch (err: any) {
    // Not fatal: cached reads expire on their ttl anyway.
    logger.warn('cache invalidation failed', { tags, error: String(err?.message ?? err).slice(0, 200) });
  }
}

/**
 * After a successful write (non-GET, status < 400) clears the given tags
 * before the response goes out, so the caller's next read is fresh.
 */
export const invalidateOnWrite = (tags: CacheTag[]): MiddlewareHandler<HonoEnv> => async (c, next) => {
  await next();
  if (c.req.method === 'GET' || c.req.method === 'HEAD' || c.req.method === 'OPTIONS') return;
  if (c.res.status >= 400) return;
  await invalidateTags(c.get('prisma'), tags);
};

// ── In-memory memo (per isolate) ─────────────────────────────

const MEMO_MAX_ENTRIES = 500;
const memoStore = new Map<string, { value: unknown; expires: number }>();

export async function memo<T>(key: string, ttlMs: number, load: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = memoStore.get(key);
  if (hit && hit.expires > now) return hit.value as T;

  const value = await load();
  if (memoStore.size >= MEMO_MAX_ENTRIES) {
    // Drop the oldest entry (Map keeps insertion order).
    const oldest = memoStore.keys().next().value;
    if (oldest !== undefined) memoStore.delete(oldest);
  }
  memoStore.delete(key);
  memoStore.set(key, { value, expires: now + ttlMs });
  return value;
}
