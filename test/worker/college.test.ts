import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import userRouter from '../../src/worker/routes/user';
import { sameCollege, cleanCollegeName } from '../../src/worker/utils/college';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

describe('sameCollege', () => {
  it.each([
    // the reported case: typo + extra city
    ['netaji subhash chandra', 'netaji subhash chanda kolkata'],
    ['Netaji Subhash Chandra', 'NETAJI  SUBHASH CHANDRA'],
    ['Netaji Subhash Chandra Bose College', 'Netaji Subhas Chandra Bose College, Kolkata'],
    ['Lovely Professional University', 'Lovely Professional University, Phagwara, Punjab'],
    ['Institute of Engineering and Management', 'Institute of Engineering & Management Kolkata'],
    ['St. Xavier\'s College', 'St Xaviers College'],
  ])('matches %s ~ %s', (a, b) => {
    expect(sameCollege(a, b)).toBe(true);
    expect(sameCollege(b, a)).toBe(true);
  });

  it.each([
    ['Netaji Subhash Engineering College', 'Netaji Subhash University'],
    ['Netaji Subhash', 'Netaji Subhash Engineering College'],
    ['IIT', 'IIT Bombay'],
    ['IIT Bombay', 'IIT Delhi'],
    ['Jadavpur University', 'Presidency University'],
    ['not joined', 'not joined'],
    ['', ''],
    ['Other', 'Other'],
  ])('does not match %s ~ %s', (a, b) => {
    expect(sameCollege(a, b)).toBe(false);
  });

  it('cleanCollegeName trims and collapses spaces', () => {
    expect(cleanCollegeName('  Netaji   Subhash  ')).toBe('Netaji Subhash');
  });
});

describe('routes', () => {
  const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
  let db: FakePrisma;
  let app: Hono<HonoEnv>;
  let ip = 0;

  beforeEach(() => {
    db = createFakePrisma();
    (db as any).userClubMembership.findUnique = async ({ where }: any) =>
      db.userClubMembership.rows.find((m) => m.userId === where.userId_clubId.userId && m.clubId === where.userId_clubId.clubId) ?? null;
    app = new Hono<HonoEnv>();
    app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
    app.route('/api/v1/user', userRouter);
  });

  const req = async (method: string, path: string, token?: string) => {
    const headers: Record<string, string> = { 'cf-connecting-ip': `10.1.0.${++ip}` };
    if (token) headers.authorization = `Bearer ${token}`;
    const res = await app.request(path, { method, headers }, ENV);
    return { status: res.status, body: (await res.json()) as any };
  };

  it('lets "Netaji Subhash Chanda Kolkata" join a college-only club of "Netaji Subhash Chandra"', async () => {
    const club = await db.clubs.create({
      data: { name: 'Robotics', collegeName: 'Netaji Subhash Chandra', collegeStudentsOnly: true, founderEmail: 'h@x.com' },
    });
    const user = await db.user.create({ data: { email: 'u@x.com', password: '', collegeName: 'Netaji Subhash Chanda Kolkata' } });
    const token = await sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
    const r = await req('POST', `/api/v1/user/joinClub/${club.id}`, token);
    expect(r.status).toBe(200);
    expect(r.body.msg).toBe('yay club joined');
  });

  it('still blocks a different college', async () => {
    const club = await db.clubs.create({
      data: { name: 'Robotics', collegeName: 'Netaji Subhash Engineering College', collegeStudentsOnly: true, founderEmail: 'h@x.com' },
    });
    const user = await db.user.create({ data: { email: 'u@x.com', password: '', collegeName: 'Netaji Subhash University' } });
    const token = await sign({ id: user.id, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
    expect((await req('POST', `/api/v1/user/joinClub/${club.id}`, token)).status).toBe(403);
  });

  it('GET /colleges suggests existing spellings, merging case/spacing variants, most used first', async () => {
    const add = (collegeName: string) => db.user.create({ data: { email: `${Math.random()}@x.com`, password: '', collegeName } });
    await add('Netaji Subhash Chandra'); await add('Netaji Subhash Chandra'); await add('netaji  subhash chandra');
    await add('Netaji Subhash University');
    await add('not joined');
    const r = await req('GET', '/api/v1/user/colleges?q=netaji');
    expect(r.status).toBe(200);
    expect(r.body.colleges).toEqual(['Netaji Subhash Chandra', 'Netaji Subhash University']);
    expect((await req('GET', '/api/v1/user/colleges?q=n')).body.colleges).toEqual([]);
  });
});
