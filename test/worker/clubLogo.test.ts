import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import adminRouter from '../../src/worker/routes/admin';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
const LOGO = 'https://ik.imagekit.io/zynvo/clubs/new-logo.png';
let db: FakePrisma;
let app: Hono<HonoEnv>;

beforeEach(() => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v2/admin', adminRouter);
});

const tokenFor = (id: string) => sign({ id, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);

const put = async (clubId: string, logo: unknown, userId?: string) => {
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (userId) headers.authorization = `Bearer ${await tokenFor(userId)}`;
  const res = await app.request(`/api/v2/admin/updateClubLogo/${clubId}`,
    { method: 'PUT', headers, body: JSON.stringify({ logo }) }, ENV);
  return res.status;
};

async function setup() {
  const head = await db.user.create({ data: { email: 'head@x.com', password: '' } });
  const core = await db.user.create({ data: { email: 'core@x.com', password: '' } });
  const outsider = await db.user.create({ data: { email: 'out@x.com', password: '' } });
  const otherCore = await db.user.create({ data: { email: 'othercore@x.com', password: '' } });
  const club = await db.clubs.create({ data: { name: 'Demo Club', founderEmail: head.email, coremember1: core.email, profilePicUrl: null } });
  await db.clubs.create({ data: { name: 'Other', founderEmail: 'h2@x.com', coremember1: otherCore.email } });
  return { head, core, outsider, otherCore, club };
}

const logoOf = async (id: string) => (await db.clubs.findUnique({ where: { id } }))!.profilePicUrl;

describe('PUT /updateClubLogo/:clubId', () => {
  it('lets the club head and a core member change the logo', async () => {
    const { head, core, club } = await setup();
    expect(await put(club.id, LOGO, head.id)).toBe(200);
    expect(await logoOf(club.id)).toBe(LOGO);
    const second = 'https://ik.imagekit.io/zynvo/clubs/second.png';
    expect(await put(club.id, second, core.id)).toBe(200);
    expect(await logoOf(club.id)).toBe(second);
  });

  it("denies outsiders and another club's core member", async () => {
    const { outsider, otherCore, club } = await setup();
    expect(await put(club.id, LOGO, outsider.id)).toBe(403);
    expect(await put(club.id, LOGO, otherCore.id)).toBe(403);
    expect(await put(club.id, LOGO)).toBe(401);
    expect(await logoOf(club.id)).toBeNull();
  });

  it.each([
    'http://ik.imagekit.io/zynvo/a.png',
    'https://evil.example.com/a.png',
    'https://ik.imagekit.io.evil.com/a.png',
    'javascript:alert(1)',
    '',
    123,
  ])('rejects logo %s', async (logo) => {
    const { head, club } = await setup();
    expect(await put(club.id, logo, head.id)).toBe(400);
    expect(await logoOf(club.id)).toBeNull();
  });

  it('404s for an unknown club', async () => {
    const { head } = await setup();
    expect(await put('nope', LOGO, head.id)).toBe(404);
  });
});
