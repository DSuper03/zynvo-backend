import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import userRouter from '../../src/worker/routes/user';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
let db: FakePrisma;
let app: Hono<HonoEnv>;

beforeEach(async () => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v1/user', userRouter);
  await db.user.create({ data: { email: 'priya@college.edu', name: 'Priya Sharma', password: '' } });
  await db.user.create({ data: { email: 'zed@other.edu', name: 'Zed', password: '' } });
});

const search = async (q: string, token?: string) => {
  const res = await app.request(`/api/v1/user/SearchUser?name=${encodeURIComponent(q)}`,
    { headers: token ? { authorization: `Bearer ${token}` } : {} }, ENV);
  return { status: res.status, body: (await res.json()) as any };
};

// The fake ignores `select`, so assert the route's select via a spy on findMany.
const lastSelect = () => (db.user as any)._lastSelect;

describe('GET /SearchUser', () => {
  beforeEach(() => {
    const orig = db.user.findMany.bind(db.user);
    (db.user as any).findMany = async (args: any) => { (db.user as any)._lastSelect = args.select; return orig(args); };
  });

  it('logged out: matches by name only and does not select email', async () => {
    const r = await search('priya');
    expect(r.status).toBe(200);
    expect(r.body.users).toHaveLength(1);
    expect(lastSelect().email).toBe(false);
    expect((await search('college.edu')).body.users).toHaveLength(0);
  });

  it('invalid token is treated as logged out', async () => {
    await search('priya', 'garbage');
    expect(lastSelect().email).toBe(false);
  });

  it('signed in: matches by name or email and selects email', async () => {
    const token = await sign({ id: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
    expect((await search('PRIYA', token)).body.users).toHaveLength(1);
    expect(lastSelect().email).toBe(true);
    const byEmail = await search('other.edu', token);
    expect(byEmail.body.users.map((u: any) => u.email)).toEqual(['zed@other.edu']);
  });
});
