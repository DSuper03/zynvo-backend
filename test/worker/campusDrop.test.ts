import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';

vi.mock('../../src/worker/middleware/auth', () => ({
  authMiddleware: async (c: any, next: () => Promise<void>) => {
    const user = c.req.header('x-test-user');
    if (!user) return c.json({ msg: 'Please login' }, 401);
    c.set('userId', user);
    await next();
  },
}));

import {
  LIVE_MS,
  MIN_CAMPUS_ANSWERS,
  buildResults,
  canAnswer,
  computeStreak,
  dropWindowAt,
  isDue,
  pickQuestion,
  pickSendAt,
} from '../../src/worker/campus-drop/policy';
import { DROP_QUESTIONS } from '../../src/worker/campus-drop/questions';
import { backfillDropTopic, campusDropTick } from '../../src/worker/campus-drop/tick';
import drops from '../../src/worker/routes/drops';

/** A moment in IST, e.g. ist('2026-11-25T20:15'). */
const ist = (local: string) => new Date(`${local}:00+05:30`);

// ── Timing ─────────────────────────────────────────────────────

describe('drop window (07:00 to 01:00 IST)', () => {
  it('is quiet from 01:00 to 06:59 IST', () => {
    expect(dropWindowAt(ist('2026-11-25T01:00'))).toBeNull();
    expect(dropWindowAt(ist('2026-11-25T03:30'))).toBeNull();
    expect(dropWindowAt(ist('2026-11-25T06:59'))).toBeNull();
  });

  it('opens at 07:00 IST', () => {
    const w = dropWindowAt(ist('2026-11-25T07:00'))!;
    expect(w.day).toBe('2026-11-25');
    expect(w.start.toISOString()).toBe(ist('2026-11-25T07:00').toISOString());
    expect(w.end.toISOString()).toBe(ist('2026-11-26T01:00').toISOString());
  });

  it('just after midnight still belongs to the previous day', () => {
    expect(dropWindowAt(ist('2026-11-26T00:40'))!.day).toBe('2026-11-25');
    expect(dropWindowAt(ist('2026-12-01T00:10'))!.day).toBe('2026-11-30');
  });
});

describe('pickSendAt', () => {
  const w = dropWindowAt(ist('2026-11-25T07:00'))!;

  it('never picks a time in quiet hours, across many random draws', () => {
    for (let i = 0; i <= 100; i++) {
      const at = pickSendAt(w, ist('2026-11-25T07:00'), () => i / 100.0001);
      expect(dropWindowAt(at)?.day).toBe('2026-11-25');
      expect(at.getUTCSeconds()).toBe(0);
    }
  });

  it('is never in the past or the next minute', () => {
    const now = ist('2026-11-25T21:30');
    expect(pickSendAt(w, now, () => 0).getTime()).toBeGreaterThanOrEqual(now.getTime() + 59_000);
  });

  it('sends right away when the window is about to close', () => {
    const now = ist('2026-11-26T00:59');
    expect(pickSendAt(w, now, () => 0.5)).toEqual(now);
  });
});

describe('isDue', () => {
  const drop = { day: '2026-11-25', sendAt: ist('2026-11-25T20:00'), sentAt: null };
  it('waits until the planned minute', () => {
    expect(isDue(drop, ist('2026-11-25T19:59'))).toBe(false);
    expect(isDue(drop, ist('2026-11-25T20:00'))).toBe(true);
    expect(isDue(drop, ist('2026-11-25T23:00'))).toBe(true); // late cron still sends
  });
  it('never sends in quiet hours or once sent', () => {
    expect(isDue(drop, ist('2026-11-26T02:00'))).toBe(false);
    expect(isDue({ ...drop, sentAt: ist('2026-11-25T20:00') }, ist('2026-11-25T20:01'))).toBe(false);
  });
});

describe('canAnswer', () => {
  const sentAt = ist('2026-11-25T20:00');
  const drop = { sentAt, closesAt: new Date(sentAt.getTime() + LIVE_MS) };
  it('is open for 10 minutes plus a short grace', () => {
    expect(canAnswer(drop, ist('2026-11-25T20:09'))).toBe(true);
    expect(canAnswer(drop, new Date(drop.closesAt.getTime() + 20_000))).toBe(true);
    expect(canAnswer(drop, ist('2026-11-25T20:11'))).toBe(false);
    expect(canAnswer({ sentAt: null, closesAt: null }, sentAt)).toBe(false);
  });
});

describe('question bank', () => {
  it('every question has 2 to 4 options and a teaser', () => {
    for (const q of DROP_QUESTIONS) {
      expect(q.options.length).toBeGreaterThanOrEqual(2);
      expect(q.options.length).toBeLessThanOrEqual(4);
      expect(q.teaser.length).toBeGreaterThan(0);
      expect(q.teaser.length).toBeLessThanOrEqual(80);
    }
  });
  it('goes through every question before repeating', () => {
    const seen = new Set<string>();
    const start = Date.UTC(2026, 10, 1);
    for (let i = 0; i < DROP_QUESTIONS.length; i++) {
      const day = new Date(start + i * 86_400_000).toISOString().slice(0, 10);
      seen.add(pickQuestion(DROP_QUESTIONS, day).question);
    }
    expect(seen.size).toBe(DROP_QUESTIONS.length);
  });
});

// ── Results and streaks ───────────────────────────────────────

describe('buildResults', () => {
  const groups = [
    { option: 0, collegeName: 'IIT Delhi', count: 4 },
    { option: 1, collegeName: 'iit delhi ', count: 2 },
    { option: 1, collegeName: 'NIT Trichy', count: 10 },
    { option: 7, collegeName: 'NIT Trichy', count: 3 }, // unknown option ignored
  ];

  it('counts everyone and the user’s campus (case and spaces ignored)', () => {
    const r = buildResults(groups, 2, 'IIT Delhi');
    expect(r.overall).toEqual({ total: 16, counts: [4, 12] });
    expect(r.campus).toEqual({ name: 'IIT Delhi', total: 6, counts: [4, 2] });
  });

  it(`hides the campus result below ${MIN_CAMPUS_ANSWERS} answers or without a college`, () => {
    expect(buildResults([{ option: 0, collegeName: 'X', count: 4 }], 2, 'X').campus).toBeNull();
    expect(buildResults(groups, 2, 'not joined').campus).toBeNull();
    expect(buildResults(groups, 2, null).campus).toBeNull();
  });
});

describe('computeStreak', () => {
  it('counts answered drops in a row, newest first', () => {
    expect(computeStreak(['d5', 'd4', 'd3', 'd2'], new Set(['d5', 'd4', 'd2']))).toBe(2);
    expect(computeStreak(['d5', 'd4'], new Set())).toBe(0);
  });
  it('a live drop not answered yet does not break the streak', () => {
    expect(computeStreak(['d5', 'd4', 'd3'], new Set(['d4', 'd3']), 'd5')).toBe(2);
    expect(computeStreak(['d5', 'd4', 'd3'], new Set(['d4', 'd3']))).toBe(0);
  });
});

// ── Cron tick ──────────────────────────────────────────────────

function memoryKv() {
  const map = new Map<string, string>();
  return { map, get: async (k: string) => map.get(k) ?? null, put: async (k: string, v: string) => void map.set(k, v) };
}

function tickPrisma() {
  const rows: any[] = [];
  const prisma = {
    rows,
    campusDrop: {
      findUnique: vi.fn(async ({ where }: any) => rows.find((r) => r.day === where.day) ?? null),
      create: vi.fn(async ({ data }: any) => {
        if (rows.some((r) => r.day === data.day)) throw Object.assign(new Error('dup'), { code: 'P2002' });
        const row = { id: `drop-${data.day}`, sentAt: null, closesAt: null, ...data };
        rows.push(row);
        return row;
      }),
      updateMany: vi.fn(async ({ where, data }: any) => {
        const hits = rows.filter((r) => r.id === where.id && (!('sentAt' in where) || r.sentAt === where.sentAt));
        hits.forEach((r) => Object.assign(r, data));
        return { count: hits.length };
      }),
    },
  };
  return prisma;
}

describe('campusDropTick', () => {
  it('does nothing in quiet hours', async () => {
    const prisma = tickPrisma();
    const send = vi.fn();
    expect(await campusDropTick({ prisma, now: ist('2026-11-25T03:00'), send })).toBe('quiet');
    expect(prisma.campusDrop.findUnique).not.toHaveBeenCalled();
    expect(send).not.toHaveBeenCalled();
  });

  it('plans once, waits using KV only, then sends exactly once', async () => {
    const prisma = tickPrisma();
    const kv = memoryKv();
    const send = vi.fn(async () => {});
    const random = () => 0.5;

    expect(await campusDropTick({ prisma, kv, now: ist('2026-11-25T07:00'), random, send })).toBe('planned');
    const drop = prisma.rows[0];
    expect(drop.day).toBe('2026-11-25');
    expect(dropWindowAt(drop.sendAt)?.day).toBe('2026-11-25');

    // Before the planned minute: answered from KV without touching the DB.
    prisma.campusDrop.findUnique.mockClear();
    const before = new Date(drop.sendAt.getTime() - 60_000);
    expect(await campusDropTick({ prisma, kv, now: before, send })).toBe('waiting');
    expect(prisma.campusDrop.findUnique).not.toHaveBeenCalled();

    expect(await campusDropTick({ prisma, kv, now: drop.sendAt, send })).toBe('sent');
    expect(send).toHaveBeenCalledTimes(1);
    expect(send.mock.calls[0]).toEqual([
      { title: '🔴 The Drop is live · 10 min', body: drop.teaser },
      { type: 'campus_drop', dropId: drop.id, route: '/drop' },
    ]);
    expect(drop.closesAt.getTime() - drop.sentAt.getTime()).toBe(LIVE_MS);

    const later = new Date(drop.sendAt.getTime() + 60_000);
    expect(await campusDropTick({ prisma, kv, now: later, send })).toBe('already-sent');
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('two overlapping runs push only once', async () => {
    const prisma = tickPrisma();
    const send = vi.fn(async () => {});
    await campusDropTick({ prisma, now: ist('2026-11-25T07:00'), random: () => 0, send });
    const at = prisma.rows[0].sendAt;
    await Promise.all([campusDropTick({ prisma, now: at, send }), campusDropTick({ prisma, now: at, send })]);
    expect(send).toHaveBeenCalledTimes(1);
  });

  it('a failed push is retried on the next minute', async () => {
    const prisma = tickPrisma();
    const kv = memoryKv();
    await campusDropTick({ prisma, kv, now: ist('2026-11-25T07:00'), random: () => 0, send: vi.fn() });
    const at = prisma.rows[0].sendAt;
    const failing = vi.fn(async () => { throw new Error('FCM down'); });
    await expect(campusDropTick({ prisma, kv, now: at, send: failing })).rejects.toThrow('FCM down');
    expect(prisma.rows[0].sentAt).toBeNull();

    const send = vi.fn(async () => {});
    expect(await campusDropTick({ prisma, kv, now: new Date(at.getTime() + 60_000), send })).toBe('sent');
  });

  it('a new day plans a new drop with the next question', async () => {
    const prisma = tickPrisma();
    const send = vi.fn(async () => {});
    await campusDropTick({ prisma, now: ist('2026-11-25T07:00'), send });
    await campusDropTick({ prisma, now: ist('2026-11-26T07:00'), send });
    expect(prisma.rows.map((r) => r.day)).toEqual(['2026-11-25', '2026-11-26']);
    expect(prisma.rows[0].question).not.toBe(prisma.rows[1].question);
  });
});

describe('backfillDropTopic', () => {
  it('adds existing devices in pages, then stops for good', async () => {
    const tokens = Array.from({ length: 2500 }, (_, i) => ({ id: `t${String(i).padStart(5, '0')}`, token: `tok${i}` }));
    const findMany = vi.fn(async ({ take, cursor }: any) => {
      const from = cursor ? tokens.findIndex((t) => t.id === cursor.id) + 1 : 0;
      return tokens.slice(from, from + take);
    });
    const kv = memoryKv();
    const subscribe = vi.fn(async () => {});

    expect(await backfillDropTopic({ prisma: { deviceToken: { findMany } }, kv, subscribe })).toBe(2500);
    expect(subscribe).toHaveBeenCalledTimes(3);
    expect(kv.map.get('campus-drop:topic-backfill')).toBe('done');
    expect(await backfillDropTopic({ prisma: { deviceToken: { findMany } }, kv, subscribe })).toBe(0);
    expect(findMany).toHaveBeenCalledTimes(3);
    // opted-out users are skipped
    expect(findMany.mock.calls[0][0].where).toEqual({ user: { campusDropOptOut: { is: null } } });
  });
});

// ── Routes ─────────────────────────────────────────────────────

function routePrisma(opts: { sentAt?: Date | null } = {}) {
  const sentAt = opts.sentAt === undefined ? new Date(Date.now() - 60_000) : opts.sentAt;
  const drop = {
    id: 'drop-1',
    day: '2026-11-25',
    kind: 'poll',
    question: 'Maggi or chai?',
    options: ['Maggi', 'Chai'],
    sentAt,
    closesAt: sentAt ? new Date(sentAt.getTime() + LIVE_MS) : null,
  };
  const answers: any[] = [];
  const optOuts = new Set<string>();
  const colleges: Record<string, string> = { u1: 'IIT Delhi', u2: 'IIT Delhi', u3: 'IIT Delhi', u4: 'IIT Delhi', u5: 'IIT Delhi', u6: 'NIT Trichy' };
  return {
    answers,
    optOuts,
    campusDrop: {
      findFirst: vi.fn(async () => (drop.sentAt ? drop : null)),
      findUnique: vi.fn(async ({ where }: any) => (where.id === drop.id ? drop : null)),
      findMany: vi.fn(async () => (drop.sentAt ? [{ id: drop.id }] : [])),
    },
    campusDropAnswer: {
      create: vi.fn(async ({ data }: any) => {
        if (answers.some((a) => a.dropId === data.dropId && a.userId === data.userId)) {
          throw Object.assign(new Error('dup'), { code: 'P2002' });
        }
        answers.push(data);
        return data;
      }),
      findUnique: vi.fn(async ({ where }: any) =>
        answers.find((a) => a.dropId === where.dropId_userId.dropId && a.userId === where.dropId_userId.userId) ?? null),
      findMany: vi.fn(async ({ where }: any) => answers.filter((a) => a.userId === where.userId)),
      count: vi.fn(async () => answers.length),
      groupBy: vi.fn(async () => {
        const m = new Map<string, any>();
        for (const a of answers) {
          const k = `${a.option}|${a.collegeName}`;
          m.set(k, { option: a.option, collegeName: a.collegeName, _count: { _all: (m.get(k)?._count._all ?? 0) + 1 } });
        }
        return [...m.values()];
      }),
    },
    campusDropOptOut: {
      findUnique: vi.fn(async ({ where }: any) => (optOuts.has(where.userId) ? { userId: where.userId } : null)),
      upsert: vi.fn(async ({ where }: any) => void optOuts.add(where.userId)),
      deleteMany: vi.fn(async ({ where }: any) => void optOuts.delete(where.userId)),
    },
    user: { findUnique: vi.fn(async ({ where }: any) => ({ collegeName: colleges[where.id] ?? 'not joined' })) },
    deviceToken: { findMany: vi.fn(async () => []) },
  };
}

function appWith(prisma: unknown) {
  const app = new Hono();
  app.use('*', async (c, next) => { c.set('prisma' as never, prisma as never); await next(); });
  app.route('/', drops);
  return app;
}

const env = { NODE_ENV: 'test' };
const call = (app: Hono, path: string, init: RequestInit & { user?: string } = {}) =>
  app.request(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.user ? { 'x-test-user': init.user } : {}) },
  }, env);
const answer = (app: Hono, user: string, option: unknown) =>
  call(app, '/drop-1/answer', { method: 'POST', user, body: JSON.stringify({ option }) });

describe('Drop routes', () => {
  it('GET /live is public and never includes results', async () => {
    const app = appWith(routePrisma());
    const json: any = await (await call(app, '/live')).json();
    expect(json.drop).toMatchObject({ id: 'drop-1', question: 'Maggi or chai?', live: true });
    expect(json.results).toBeUndefined();
    expect(json.answers).toBe(0);
  });

  it('GET /live with no drop yet', async () => {
    const json: any = await (await call(appWith(routePrisma({ sentAt: null })), '/live')).json();
    expect(json).toEqual({ drop: null, answers: 0 });
  });

  it('results are hidden until you answer, then shown with your campus', async () => {
    const prisma = routePrisma();
    const app = appWith(prisma);
    for (const u of ['u2', 'u3', 'u4', 'u5', 'u6']) await answer(app, u, 0);

    const before: any = await (await call(app, '/me', { user: 'u1' })).json();
    expect(before.myAnswer).toBeNull();
    expect(before.results).toBeNull();
    expect(before.enabled).toBe(true);

    const res = await answer(app, 'u1', 1);
    expect(res.status).toBe(200);
    const after: any = await res.json();
    expect(after.myAnswer).toBe(1);
    expect(after.streak).toBe(1);
    expect(after.results.overall).toEqual({ total: 6, counts: [5, 1] });
    expect(after.results.campus).toEqual({ name: 'IIT Delhi', total: 5, counts: [4, 1] });
  });

  it('answering twice keeps the first answer', async () => {
    const app = appWith(routePrisma());
    await answer(app, 'u1', 0);
    const json: any = await (await answer(app, 'u1', 1)).json();
    expect(json.alreadyAnswered).toBe(true);
    expect(json.myAnswer).toBe(0);
  });

  it('rejects answers after it closes, bad options, and signed-out users', async () => {
    const closed = appWith(routePrisma({ sentAt: new Date(Date.now() - LIVE_MS - 60_000) }));
    expect((await answer(closed, 'u1', 0)).status).toBe(410);

    const app = appWith(routePrisma());
    expect((await answer(app, 'u1', 2)).status).toBe(400);
    expect((await answer(app, 'u1', '0')).status).toBe(400);
    expect((await call(app, '/drop-1/answer', { method: 'POST', body: '{"option":0}' })).status).toBe(401);
    expect((await call(app, '/nope/answer', { method: 'POST', user: 'u1', body: '{"option":0}' })).status).toBe(404);
  });

  it('PUT /settings turns Drop notifications off and on', async () => {
    const prisma = routePrisma();
    const app = appWith(prisma);
    const off = await call(app, '/settings', { method: 'PUT', user: 'u1', body: '{"enabled":false}' });
    expect(await off.json()).toEqual({ enabled: false });
    expect(prisma.optOuts.has('u1')).toBe(true);
    expect(((await (await call(app, '/me', { user: 'u1' })).json()) as any).enabled).toBe(false);

    await call(app, '/settings', { method: 'PUT', user: 'u1', body: '{"enabled":true}' });
    expect(prisma.optOuts.has('u1')).toBe(false);
    expect((await call(app, '/settings', { method: 'PUT', user: 'u1', body: '{"enabled":"no"}' })).status).toBe(400);
  });
});
