import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import clubsRouter from '../../src/worker/routes/clubs';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
let db: FakePrisma;
let app: Hono<HonoEnv>;
let ip = 0;

beforeEach(() => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v1/clubs', clubsRouter);
});

const del = async (clubId: string, userId: string, confirmName?: string) => {
  const token = await sign({ id: userId, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
  const res = await app.request(`/api/v1/clubs/${clubId}/delete`, {
    method: 'POST',
    headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json', 'cf-connecting-ip': `10.7.0.${++ip}` },
    body: JSON.stringify({ confirmName }),
  }, ENV, { waitUntil: () => {}, passThroughOnException() {} } as any);
  return res.status;
};

async function setup() {
  const head = await db.user.create({ data: { email: 'head@x.com', password: '' } });
  const core = await db.user.create({ data: { email: 'core@x.com', password: '' } });
  const club = await db.clubs.create({ data: { name: 'Robotics Club', founderEmail: head.email, coremember1: core.email } });
  const other = await db.clubs.create({ data: { name: 'Other', founderEmail: 'o@x.com' } });
  // a member whose legacy pointer targets the club (ON DELETE CASCADE in the DB)
  const legacyMember = await db.user.create({ data: { email: 'm@x.com', password: '', clubId: club.id, clubName: club.name } });
  await db.event.create({ data: { clubId: club.id, EventName: 'Hack' } });
  await db.event.create({ data: { clubId: other.id, EventName: 'Keep me' } });
  return { head, core, club, other, legacyMember };
}

describe('POST /clubs/:clubId/delete', () => {
  it('head deletes the club; members keep their accounts; other clubs untouched', async () => {
    const { head, club, other, legacyMember } = await setup();
    expect(await del(club.id, head.id, '  robotics   CLUB ')).toBe(200);

    expect(await db.clubs.findUnique({ where: { id: club.id } })).toBeNull();
    expect(db.event.rows.map((e) => e.EventName)).toEqual(['Keep me']);
    const member = await db.user.findUnique({ where: { id: legacyMember.id } });
    expect(member).not.toBeNull();
    expect(member!.clubId).toBeNull();
    expect(member!.clubName).toBeNull();
    expect(await db.clubs.findUnique({ where: { id: other.id } })).not.toBeNull();
  });

  it('core members and others cannot delete', async () => {
    const { core, club } = await setup();
    const stranger = await db.user.create({ data: { email: 's@x.com', password: '' } });
    expect(await del(club.id, core.id, 'Robotics Club')).toBe(403);
    expect(await del(club.id, stranger.id, 'Robotics Club')).toBe(403);
    expect(await db.clubs.findUnique({ where: { id: club.id } })).not.toBeNull();
  });

  it('requires the exact club name', async () => {
    const { head, club } = await setup();
    expect(await del(club.id, head.id)).toBe(400);
    expect(await del(club.id, head.id, 'Robotics')).toBe(400);
    expect(await db.clubs.findUnique({ where: { id: club.id } })).not.toBeNull();
  });
});
