import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import userRouter from '../../src/worker/routes/user';

// Profile pages show when each attended event happened, so the Worker's
// getPublicUser must select event.startDate (#193 only fixed the Express controller).
describe('GET /getPublicUser', () => {
  it('selects startDate for attended events', async () => {
    let args: any;
    const prisma = { user: { findUnique: async (a: any) => { args = a; return { id: 'u2', eventAttended: [] }; } } };
    const app = new Hono<HonoEnv>();
    app.use('*', async (c, next) => { c.set('prisma', prisma as any); await next(); });
    app.route('/api/v1/user', userRouter);

    const env = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
    const token = await sign({ id: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 }, env.JWT_SECRET);
    const res = await app.request('/api/v1/user/getPublicUser?id=u2', { headers: { authorization: `Bearer ${token}` } }, env);

    expect(res.status).toBe(200);
    expect(args.select.eventAttended.select.event.select.startDate).toBe(true);
  });
});
