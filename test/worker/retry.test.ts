import { describe, it, expect, vi } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import eventsRouter from '../../src/worker/routes/events';
import { withRetry, isTransientDbError } from '../../src/worker/utils/retry';

const ACCELERATE = new Error('\nInvalid `prisma.follow.findMany()` invocation:\n\n\nerror code: 1102\n');

describe('withRetry', () => {
  it('retries once on a transient Accelerate error and returns the result', async () => {
    const run = vi.fn().mockRejectedValueOnce(ACCELERATE).mockResolvedValueOnce('ok');
    await expect(withRetry(run, { delayMs: 1 })).resolves.toBe('ok');
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('gives up after the retry and throws the original error', async () => {
    const run = vi.fn().mockRejectedValue(ACCELERATE);
    await expect(withRetry(run, { delayMs: 1 })).rejects.toBe(ACCELERATE);
    expect(run).toHaveBeenCalledTimes(2);
  });

  it('does not retry real errors (validation, missing column, unique)', async () => {
    for (const msg of ['P2022 column does not exist', 'Unique constraint failed P2002', 'Argument `x` is missing']) {
      const run = vi.fn().mockRejectedValue(new Error(msg));
      await expect(withRetry(run, { delayMs: 1 })).rejects.toThrow(msg);
      expect(run).toHaveBeenCalledTimes(1);
    }
    expect(isTransientDbError(new Error('P2022'))).toBe(false);
  });
});

describe('GET /friends-going', () => {
  it('survives one transient Accelerate failure on the follow lookup', async () => {
    const findMany = vi.fn().mockRejectedValueOnce(ACCELERATE).mockResolvedValueOnce([]);
    const prisma = {
      follow: { findMany },
      userEvents: { groupBy: async () => [{ eventId: 'e1', _count: { _all: 3 } }], findMany: async () => [] },
    };
    const app = new Hono<HonoEnv>();
    app.use('*', async (c, next) => { c.set('prisma', prisma as any); await next(); });
    app.route('/api/v1/events', eventsRouter);

    const env = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
    const token = await sign({ id: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 }, env.JWT_SECRET);
    const res = await app.request('/api/v1/events/friends-going?ids=e1', { headers: { authorization: `Bearer ${token}` } }, env);

    expect(res.status).toBe(200);
    expect(((await res.json()) as any).events.e1.total).toBe(3);
    expect(findMany).toHaveBeenCalledTimes(2);
  });
});
