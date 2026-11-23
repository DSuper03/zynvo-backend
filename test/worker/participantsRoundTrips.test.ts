import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import eventsRouter from '../../src/worker/routes/events';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

// /participants/:eventId used to chain ~7 Accelerate round trips (each an HTTP
// call), which made it slow. The independent lookups now run together and the
// answers query is skipped when an event has no custom questions. Access rules
// must not change.
const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
const SITE_ADMIN = 'zynvosocial@gmail.com'; // built-in admin (middleware/auth.ts)

let db: FakePrisma;
let app: Hono<HonoEnv>;

const token = (id: string) => sign({ id, exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET);
const get = async (path: string, userId: string) =>
  app.request(path, { headers: { authorization: `Bearer ${await token(userId)}` } }, ENV);

async function seed() {
  const core = await db.user.create({ data: { email: 'core@x.com', isVerified: true } });
  const outsider = await db.user.create({ data: { email: 'outsider@x.com', isVerified: true } });
  const admin = await db.user.create({ data: { email: SITE_ADMIN, isVerified: true } });
  const club = await db.clubs.create({ data: { name: 'Robotics', collegeName: 'C', description: '', founderEmail: 'head@x.com', coremember1: 'core@x.com' } });
  const event = await db.event.create({ data: { clubId: club.id, createdById: core.id, EventName: 'Hack', isPaid: false } });
  await db.userEvents.create({ data: { userId: outsider.id, eventId: event.id, uniquePassId: 'p1' } });
  return { core, outsider, admin, club, event };
}

beforeEach(() => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v1/events', eventsRouter);
});

describe('GET /participants/:eventId access (unchanged)', () => {
  it('lets a core member of the hosting club in', async () => {
    const { core, event } = await seed();
    const res = await get(`/api/v1/events/participants/${event.id}`, core.id);
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).pagination.total).toBe(1);
  });

  it('lets a site admin in', async () => {
    const { admin, event } = await seed();
    expect((await get(`/api/v1/events/participants/${event.id}`, admin.id)).status).toBe(200);
  });

  it('denies a user who is not on the hosting club (403)', async () => {
    const { outsider, event } = await seed();
    expect((await get(`/api/v1/events/participants/${event.id}`, outsider.id)).status).toBe(403);
  });

  it('404s an unknown event for both a member and an admin', async () => {
    const { core, admin } = await seed();
    expect((await get('/api/v1/events/participants/nope', core.id)).status).toBe(404);
    expect((await get('/api/v1/events/participants/nope', admin.id)).status).toBe(404);
  });
});

describe('GET /participants/:eventId round trips', () => {
  it('skips the answers query when the event has no custom questions', async () => {
    const { core, event } = await seed();
    const answers = vi.spyOn(db.registrationAnswer, 'findMany');
    expect((await get(`/api/v1/events/participants/${event.id}`, core.id)).status).toBe(200);
    expect(answers).not.toHaveBeenCalled();
  });

  it('still loads answers when the event has custom questions', async () => {
    const { core, event } = await seed();
    await db.eventCustomQuestion.create({ data: { eventId: event.id, label: 'Team name', sortOrder: 0 } });
    const answers = vi.spyOn(db.registrationAnswer, 'findMany');
    const res = await get(`/api/v1/events/participants/${event.id}`, core.id);
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).questions).toEqual(['Team name']);
    expect(answers).toHaveBeenCalledTimes(1);
  });

  it('looks up the user and the event together, not one after the other', async () => {
    const { core, event } = await seed();
    let inFlight = 0;
    let peak = 0;
    for (const model of [db.user, db.event] as any[]) {
      const original = model.findUnique.bind(model);
      model.findUnique = async (args: any) => {
        inFlight++;
        peak = Math.max(peak, inFlight);
        await new Promise((r) => setTimeout(r, 5));
        try { return await original(args); } finally { inFlight--; }
      };
    }
    expect((await get(`/api/v1/events/participants/${event.id}`, core.id)).status).toBe(200);
    expect(peak).toBeGreaterThanOrEqual(2);
  });
});
