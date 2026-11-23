import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Hono } from 'hono';
import type { HonoEnv } from '../../src/worker/types';
import eventsRouter from '../../src/worker/routes/events';
import { logger } from '../../src/worker/logger';

// The schedule routes used to swallow errors (`catch {}`), so the Telegram
// alert for a 500 had no cause. They must log the real error like other routes.
describe('GET /schedule/:eventId failure', () => {
  beforeEach(() => vi.restoreAllMocks());

  it('returns 500 and logs the underlying error', async () => {
    const errorLog = vi.spyOn(logger, 'error').mockImplementation(() => {});
    const prisma = { scheduleDay: { findMany: async () => { throw new Error('error code: 1102'); } } };
    const app = new Hono<HonoEnv>();
    app.use('*', async (c, next) => { c.set('prisma', prisma as any); await next(); });
    app.route('/api/v1/events', eventsRouter);

    const res = await app.request('/api/v1/events/schedule/evt-1', {}, { NODE_ENV: 'test' } as any);

    expect(res.status).toBe(500);
    expect(errorLog).toHaveBeenCalledOnce();
    expect(JSON.stringify(errorLog.mock.calls[0])).toContain('error code: 1102');
  });
});
