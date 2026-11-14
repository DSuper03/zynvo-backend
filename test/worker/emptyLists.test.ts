import { describe, it, expect, beforeEach } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import type { HonoEnv } from '../../src/worker/types';
import eventsRouter from '../../src/worker/routes/events';
import clubsRouter from '../../src/worker/routes/clubs';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const ENV = { JWT_SECRET: 'test-secret', NODE_ENV: 'test' } as any;
let db: FakePrisma;
let app: Hono<HonoEnv>;

beforeEach(() => {
  db = createFakePrisma();
  app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => { c.set('prisma', db as any); await next(); });
  app.route('/api/v1/events', eventsRouter);
  app.route('/api/v1/clubs', clubsRouter);
});

const get = async (path: string) => {
  const res = await app.request(path, {}, ENV);
  return { status: res.status, body: (await res.json()) as any };
};

describe('empty lists are 200, not 404', () => {
  it('getSpeakers: event with no speakers', async () => {
    const r = await get('/api/v1/events/getSpeakers?id=evt-1');
    expect(r.status).toBe(200);
    expect(r.body.speakers).toEqual([]);
  });

  it('getSpeakers: still 400 without an id', async () => {
    expect((await get('/api/v1/events/getSpeakers')).status).toBe(400);
  });

  it('events/all: no events', async () => {
    const r = await get('/api/v1/events/all?page=1');
    expect(r.status).toBe(200);
    expect(r.body.response).toEqual([]);
    expect(r.body.totalPages).toBe(0);
  });

  it('eventByClub: club with no events', async () => {
    const res = await app.request('/api/v1/events/eventByClub/club-1', {
      headers: { authorization: `Bearer ${await sign({ id: 'u1', exp: Math.floor(Date.now() / 1000) + 3600 }, ENV.JWT_SECRET)}` },
    }, ENV);
    expect(res.status).toBe(200);
    expect(((await res.json()) as any).event).toEqual([]);
  });

  it('getClub?name: no club with that name', async () => {
    const r = await get('/api/v1/clubs/getClub?name=Nope');
    expect(r.status).toBe(200);
    expect(r.body.response).toEqual([]);
  });
});
