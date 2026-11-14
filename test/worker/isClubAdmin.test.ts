import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import userRouter from '../../src/worker/routes/user';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
let db: FakePrisma;
let app: Hono<HonoEnv>;

beforeEach(() => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v1/user', userRouter);
});

const get = async (path: string, userId: string) => {
  const token = await sign({ id: userId, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
  const res = await app.request(path, { headers: { authorization: `Bearer ${token}` } }, ENV);
  return { status: res.status, body: (await res.json()) as any };
};

describe('isClubAdmin', () => {
  it('no id: non-leader gets 200 with a falsy founder (not 403)', async () => {
    const u = await db.user.create({ data: { email: 'member@x.com', password: '' } });
    await db.clubs.create({ data: { name: 'C', founderEmail: 'head@x.com' } });
    const r = await get('/api/v1/user/isClubAdmin', u.id);
    expect(r.status).toBe(200);
    expect(r.body.founder).toBeFalsy();
  });

  it('no id: founder still gets founder:true with club id', async () => {
    const u = await db.user.create({ data: { email: 'head@x.com', password: '' } });
    const club = await db.clubs.create({ data: { name: 'C', founderEmail: 'head@x.com' } });
    const r = await get('/api/v1/user/isClubAdmin', u.id);
    expect(r.body).toMatchObject({ founder: 'true', role: 'founder', clubId: club.id });
  });

  it('per club: founder without a membership row is recognised (case-insensitive)', async () => {
    const u = await db.user.create({ data: { email: 'Head@X.com', password: '' } });
    const club = await db.clubs.create({ data: { name: 'C', founderEmail: 'head@x.com' } });
    const r = await get(`/api/v1/user/isClubAdmin/${club.id}`, u.id);
    expect(r.status).toBe(200);
    expect(r.body.founder).toBe('true');
  });

  it('per club: core member is recognised; plain member gets 200 founder:false', async () => {
    const core = await db.user.create({ data: { email: 'core@x.com', password: '' } });
    const member = await db.user.create({ data: { email: 'm@x.com', password: '' } });
    const club = await db.clubs.create({ data: { name: 'C', founderEmail: 'head@x.com', coremember2: 'core@x.com' } });
    await db.userClubMembership.create({ data: { userId: member.id, clubId: club.id } });
    expect((await get(`/api/v1/user/isClubAdmin/${club.id}`, core.id)).body.founder).toBe('true');
    const r = await get(`/api/v1/user/isClubAdmin/${club.id}`, member.id);
    expect(r.status).toBe(200);
    expect(r.body.founder).toBe(false);
  });
});
