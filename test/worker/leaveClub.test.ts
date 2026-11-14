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

const leave = async (userId: string, clubId: string) => {
  const token = await sign({ id: userId, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
  const res = await app.request(`/api/v1/user/leaveClub/${clubId}`, {
    method: 'POST', headers: { authorization: `Bearer ${token}`, 'cf-connecting-ip': `10.9.0.${Math.random()}` },
  }, ENV);
  return res.status;
};

describe('POST /leaveClub/:id', () => {
  it('leaves a club joined through a membership row', async () => {
    const u = await db.user.create({ data: { email: 'a@x.com', password: '' } });
    await db.userClubMembership.create({ data: { userId: u.id, clubId: 'c1' } });
    await db.userClubMembership.create({ data: { userId: u.id, clubId: 'c2' } });
    expect(await leave(u.id, 'c1')).toBe(200);
    expect(db.userClubMembership.rows.map((m) => m.clubId)).toEqual(['c2']);
  });

  it('leaves a legacy-only club (User.clubId, no membership row) and clears the pointer', async () => {
    const u = await db.user.create({ data: { email: 'b@x.com', password: '', clubId: 'old', clubName: 'Old Club' } });
    expect(await leave(u.id, 'old')).toBe(200);
    const after = (await db.user.findUnique({ where: { id: u.id } }))!;
    expect(after.clubId).toBeNull();
    expect(after.clubName).toBeNull();
  });

  it('clears both when the club is in the membership table and the legacy pointer', async () => {
    const u = await db.user.create({ data: { email: 'c@x.com', password: '', clubId: 'c1', clubName: 'C1' } });
    await db.userClubMembership.create({ data: { userId: u.id, clubId: 'c1' } });
    expect(await leave(u.id, 'c1')).toBe(200);
    expect(db.userClubMembership.rows).toHaveLength(0);
    expect((await db.user.findUnique({ where: { id: u.id } }))!.clubId).toBeNull();
  });

  it('keeps the legacy pointer when leaving a different club', async () => {
    const u = await db.user.create({ data: { email: 'd@x.com', password: '', clubId: 'main', clubName: 'Main' } });
    await db.userClubMembership.create({ data: { userId: u.id, clubId: 'other' } });
    expect(await leave(u.id, 'other')).toBe(200);
    expect((await db.user.findUnique({ where: { id: u.id } }))!.clubId).toBe('main');
  });

  it('400s when the user is not in the club at all', async () => {
    const u = await db.user.create({ data: { email: 'e@x.com', password: '' } });
    expect(await leave(u.id, 'nope')).toBe(400);
  });
});
