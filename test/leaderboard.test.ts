import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { Hono } from 'hono';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { HonoEnv } from '../src/worker/types';
import router from '../src/worker/routes/leaderboard';
import {
  getLeaderboard,
  leaderboardWindow,
  parseLeaderboardOptions,
} from '../src/worker/utils/leaderboard';
import type { Prisma } from '@prisma/client';
import {
  leaderboardCacheKey,
  leaderboardCacheSeconds,
} from '../src/worker/utils/leaderboard-cache';

const now = new Date('2026-11-22T12:00:00Z');
let pg: PGlite;
const db = {
  async $queryRaw<T>(query: Prisma.Sql): Promise<T> {
    return (await pg.query(query.text, query.values)).rows as T;
  },
};
const options = (query = '') =>
  parseLeaderboardOptions(new URLSearchParams(query));

beforeAll(async () => {
  pg = new PGlite();
  await pg.exec(`
    CREATE TABLE clubs (id text PRIMARY KEY, name text, "collegeName" text, "profilePicUrl" text);
    CREATE TABLE event (id text PRIMARY KEY, "EventName" text, "posterUrl" text, "clubId" text,
      "isPaid" boolean DEFAULT false, "coreTeamOnly" boolean DEFAULT false, "applicationStatus" text DEFAULT 'open');
    CREATE TABLE "userEvents" ("userId" text, "eventId" text, "approvalStatus" text DEFAULT 'approved',
      "paymentStatus" text DEFAULT 'CONFIRMED', "paymentVerifiedAt" timestamptz,
      "joinedAt" timestamptz DEFAULT '2026-11-20T12:00:00Z', PRIMARY KEY ("userId", "eventId"));
    INSERT INTO clubs VALUES ('a', 'Alpha', 'Campus A', NULL), ('b', 'Beta', 'Campus B', NULL), ('c', '100% Club', 'Campus B', NULL), ('z', 'Empty Club', 'Campus A', NULL);
    INSERT INTO event (id, "EventName", "clubId") VALUES ('a1','Alpha One','a'),('a2','Alpha Two','a'),('b1','Beta One','b'),('c1','Percent Event','c');
    INSERT INTO event (id, "EventName", "clubId", "isPaid") VALUES ('paid','Paid Event','a',true);
    INSERT INTO event (id, "EventName", "clubId", "coreTeamOnly") VALUES ('internal','Internal Event','a',true);
    INSERT INTO event (id, "EventName", "clubId", "applicationStatus") VALUES ('cancel','Cancelled Event','a','cancelled'),('draft','Draft Event','a','draft');
    INSERT INTO "userEvents" ("userId","eventId") VALUES ('u1','a1'),('u2','a1'),('u1','a2'),('u3','b1'),('u4','b1'),('u5','b1'),('u6','c1'),('u7','internal'),('u8','cancel'),('u9','draft');
    INSERT INTO "userEvents" ("userId","eventId","approvalStatus") VALUES ('pending','a1','pending'),('rejected','a1','rejected');
    INSERT INTO "userEvents" ("userId","eventId","paymentStatus","paymentVerifiedAt") VALUES
      ('unverified','paid','CONFIRMED',NULL),('verified','paid','CONFIRMED','2026-11-21T00:00:00Z'),('bad','paid','REJECTED','2026-11-21T00:00:00Z'),('waiting','paid','PENDING',NULL);
    INSERT INTO "userEvents" ("userId","eventId","joinedAt") VALUES ('old','b1','2026-10-31T12:00:00Z'),('month','b1','2026-11-02T12:00:00Z'),('future','a1','2026-11-23T00:00:00Z');
  `);
}, 60_000);
afterAll(async () => {
  await pg?.close();
});

describe('India calendar periods', () => {
  it('starts the week on Monday in IST, including Sunday UTC crossing into Monday', () => {
    expect(
      leaderboardWindow(
        'week',
        new Date('2026-11-22T18:29:59Z')
      ).start?.toISOString()
    ).toBe('2026-11-15T18:30:00.000Z');
    expect(
      leaderboardWindow(
        'week',
        new Date('2026-11-22T18:30:00Z')
      ).start?.toISOString()
    ).toBe('2026-11-22T18:30:00.000Z');
  });
  it('handles month and year boundaries', () => {
    expect(
      leaderboardWindow(
        'month',
        new Date('2026-12-31T18:30:00Z')
      ).start?.toISOString()
    ).toBe('2026-12-31T18:30:00.000Z');
    expect(leaderboardWindow('all', now).start).toBeNull();
  });
});

describe('database rankings', () => {
  it('handles legacy payment approval and mixed-case statuses without trusting unverified screenshots', async () => {
    await pg.exec('BEGIN');
    try {
      await pg.exec(`
        INSERT INTO "userEvents" ("userId", "eventId", "paymentStatus", "paymentVerifiedAt", "approvalStatus") VALUES
          ('legacy', 'paid', 'APPROVED', '2026-11-21', 'approved'),
          ('legacy-unverified', 'paid', 'APPROVED', NULL, 'approved'),
          ('mixed', 'paid', ' confirmed ', '2026-11-21', ' Approved '),
          ('still-pending', 'paid', 'APPROVED', '2026-11-21', 'pending');
      `);
      const result = await getLeaderboard(
        db,
        options('kind=events&search=Paid'),
        now
      );
      expect(result.entries[0].registrations).toBe(3);
    } finally {
      await pg.exec('ROLLBACK');
    }
  });
  it('includes the period start and excludes the exact cutoff', async () => {
    await pg.exec('BEGIN');
    try {
      await pg.exec(`INSERT INTO "userEvents" ("userId", "eventId", "joinedAt") VALUES
        ('boundary-start','a1','2026-11-15T18:30:00Z'),
        ('before-start','a1','2026-11-15T18:29:59.999Z'),
        ('boundary-end','a1','2026-11-22T12:00:00Z');`);
      const result = await getLeaderboard(
        db,
        options('kind=events&search=Alpha+One'),
        now
      );
      expect(result.entries[0].registrations).toBe(3);
    } finally {
      await pg.exec('ROLLBACK');
    }
  });
  it('reflects approval changes, deletions and closed events on the next fresh read', async () => {
    await pg.exec('BEGIN');
    try {
      await pg.exec(`UPDATE "userEvents" SET "approvalStatus" = 'rejected' WHERE "userId"='u2' AND "eventId"='a1';
        DELETE FROM "userEvents" WHERE "userId"='u1' AND "eventId"='a2';
        UPDATE event SET "applicationStatus"='closed' WHERE id='a1';`);
      const result = await getLeaderboard(db, options(), now);
      expect(result.entries.find((row) => row.id === 'a')?.registrations).toBe(
        2
      );
    } finally {
      await pg.exec('ROLLBACK');
    }
  });
  it('counts only eligible registrations, deduplicates students and excludes empty clubs', async () => {
    const result = await getLeaderboard(db, options(), now);
    expect(
      result.entries.map((e) => [
        e.id,
        e.registrations,
        e.uniqueStudents,
        e.eventsCount,
      ])
    ).toEqual([
      ['a', 4, 3, 3],
      ['b', 3, 3, 1],
      ['c', 1, 1, 1],
    ]);
    expect(result.totals).toEqual({
      registrations: 8,
      uniqueStudents: 7,
      eventsCount: 5,
      rankedCount: 3,
    });
    expect(JSON.stringify(result)).not.toContain('unverified');
  });
  it('ranks events with shared ties and stable ordering', async () => {
    const result = await getLeaderboard(db, options('kind=events'), now);
    expect(result.entries.map((e) => [e.id, e.rank])).toEqual([
      ['b1', 1],
      ['a1', 2],
      ['a2', 3],
      ['paid', 3],
      ['c1', 3],
    ]);
  });
  it('filters colleges before ranking and keeps ranks when searching', async () => {
    const filtered = await getLeaderboard(
      db,
      options('college=Campus+B&search=Beta'),
      now
    );
    expect(filtered.entries[0]).toMatchObject({ id: 'b', rank: 1 });
    const searched = await getLeaderboard(db, options('search=Beta'), now);
    expect(searched.entries[0].rank).toBe(2);
    const literal = await getLeaderboard(db, options('search=%25'), now);
    expect(literal.entries.map((e) => e.id)).toEqual(['c']);
  });
  it('changes periods by registration date and excludes future registrations', async () => {
    const month = await getLeaderboard(db, options('period=month'), now);
    expect(month.entries.find((e) => e.id === 'b')?.registrations).toBe(4);
    expect(month.entries.slice(0, 2).map((e) => e.rank)).toEqual([1, 1]);
    const all = await getLeaderboard(db, options('period=all'), now);
    expect(all.entries[0]).toMatchObject({ id: 'b', registrations: 5 });
  });
  it('returns empty results and complete totals for an out-of-range page', async () => {
    const result = await getLeaderboard(db, options('page=2'), now);
    expect(result.entries).toEqual([]);
    expect(result.totals.registrations).toBe(8);
    const empty = await getLeaderboard(db, options('college=Missing'), now);
    expect(empty.totals.rankedCount).toBe(0);
    expect(empty.entries).toEqual([]);
  });
  it('parameterizes hostile search text', async () => {
    const result = await getLeaderboard(
      db,
      options("search=';DROP+TABLE+clubs;--"),
      now
    );
    expect(result.entries).toEqual([]);
    expect((await getLeaderboard(db, options(), now)).entries).toHaveLength(3);
  });
});

describe('large ranking pages', () => {
  it('checks index definitions in the in-memory database', async () => {
    for (const migration of [
      '20261122000000_leaderboard_indexes',
      '20261122000100_leaderboard_event_index',
    ]) {
      const sql = readFileSync(
        resolve('prisma/migrations', migration, 'migration.sql'),
        'utf8'
      );
      expect(sql.match(/CREATE INDEX CONCURRENTLY/g)).toHaveLength(1);
      // PGlite cannot emulate concurrent index build transactions. Real PostgreSQL runs the unmodified migrations in CI.
      await pg.exec(sql.replace('CONCURRENTLY ', ''));
    }
    const indexes = await pg.query<{ indexname: string }>(
      `SELECT indexname FROM pg_indexes WHERE tablename='userEvents'`
    );
    expect(indexes.rows.map((row) => row.indexname)).toContain(
      'userEvents_joinedAt_eventId_idx'
    );
    expect(indexes.rows.map((row) => row.indexname)).toContain(
      'userEvents_eventId_idx'
    );
  });
  it('paginates without duplicate entries or changing totals', async () => {
    await pg.exec('BEGIN');
    try {
      await pg.exec(`
        INSERT INTO clubs (id, name, "collegeName")
          SELECT 'extra-' || n, 'Extra Club ' || n, 'Campus A' FROM generate_series(1,30) n;
        INSERT INTO event (id, "EventName", "clubId")
          SELECT 'extra-event-' || n, 'Extra Event ' || n, 'extra-' || n FROM generate_series(1,30) n;
        INSERT INTO "userEvents" ("userId", "eventId")
          SELECT 'extra-user-' || n, 'extra-event-' || n FROM generate_series(1,30) n;
      `);
      const first = await getLeaderboard(db, options(), now);
      const second = await getLeaderboard(db, options('page=2'), now);
      expect(first.entries).toHaveLength(25);
      expect(second.entries).toHaveLength(8);
      expect(second.totals).toEqual(first.totals);
      expect(
        new Set([...first.entries, ...second.entries].map((e) => e.id)).size
      ).toBe(33);
    } finally {
      await pg.exec('ROLLBACK');
    }
  });
});

describe('public HTTP contract', () => {
  const app = new Hono<HonoEnv>();
  app.use('*', async (c, next) => {
    c.set('prisma', db as any);
    await next();
  });
  app.route('/api/v1/leaderboard', router);
  it('returns public aggregate data and caches successful requests', async () => {
    const response = await app.request(
      '/api/v1/leaderboard?period=all',
      {},
      {} as any
    );
    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toMatch(
      /s-maxage=([1-9]|[12]\d|30)$/
    );
    const data = await response.json();
    expect(data.entries.length).toBeGreaterThan(0);
    expect(Object.keys(data.entries[0]).sort()).toEqual(
      [
        'clubName',
        'college',
        'eventsCount',
        'id',
        'image',
        'name',
        'rank',
        'registrations',
        'uniqueStudents',
      ].sort()
    );
    expect(data.maxPage).toBe(1000);
  });
  it.each([
    'period=year',
    'kind=users',
    'page=-1',
    'page=1.5',
    'page=1001',
    'page=100000',
    'period=week&period=all',
    'unknown=1',
    'search=%00',
    'college=' + 'x'.repeat(201),
    'search=' + 'x'.repeat(101),
  ])('rejects invalid filters: %s', async (query) => {
    const response = await app.request(
      '/api/v1/leaderboard?' + query,
      {},
      {} as any
    );
    expect(response.status).toBe(400);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
  it('returns a non-cacheable, safe error when the database is unavailable', async () => {
    const broken = new Hono<HonoEnv>();
    broken.use('*', async (c, next) => {
      c.set('prisma', {
        $queryRaw: async () => {
          throw new Error('sensitive connection string');
        },
      } as any);
      await next();
    });
    broken.route('/api/v1/leaderboard', router);
    const response = await broken.request('/api/v1/leaderboard', {}, {} as any);
    expect(response.status).toBe(500);
    expect(response.headers.get('cache-control')).toBe('no-store');
    expect(await response.text()).not.toContain('sensitive');
  });
  it('rate limits anonymous requests with a Retry-After header', async () => {
    let response: Response | undefined;
    for (let i = 0; i < 31; i++)
      response = await app.request(
        '/api/v1/leaderboard?period=invalid',
        { headers: { 'cf-connecting-ip': 'rate-test' } },
        {} as any
      );
    expect(response?.status).toBe(429);
    expect(response?.headers.get('retry-after')).toBe('60');
    expect(response?.headers.get('cache-control')).toBe('no-store');
  });
});

describe('public cache policy', () => {
  it('never caches a result after the period boundary or after its freshness budget', () => {
    expect(
      leaderboardCacheSeconds(
        options(),
        new Date('2026-11-22T18:29:50Z'),
        new Date('2026-11-22T18:30:01Z')
      )
    ).toBe(0);
    expect(
      leaderboardCacheSeconds(
        options('period=all'),
        now,
        new Date(now.getTime() + 31_000)
      )
    ).toBe(0);
  });
  it('serves shared aggregate cache hits and survives cache outages', async () => {
    const saved = new Map<string, Response>();
    const writes: Promise<unknown>[] = [];
    const app = new Hono<HonoEnv>();
    const query = vi.spyOn(db, '$queryRaw');
    app.use('*', async (c, next) => {
      c.set('prisma', db as any);
      await next();
    });
    app.route('/api/v1/leaderboard', router);
    vi.stubGlobal('caches', {
      default: {
        match: async (key: Request) => saved.get(key.url)?.clone(),
        put: async (key: Request, response: Response) => {
          saved.set(key.url, response);
        },
      },
    });
    try {
      const ctx = {
        waitUntil: (promise: Promise<unknown>) => writes.push(promise),
        passThroughOnException() {},
      };
      const request = () =>
        new Request('https://api.example.com/api/v1/leaderboard?period=all');
      const first = await app.fetch(request(), {} as any, ctx as any);
      expect(first.status).toBe(200);
      await Promise.all(writes);
      const calls = query.mock.calls.length;
      const second = await app.fetch(request(), {} as any, ctx as any);
      expect(await second.json()).toEqual(await first.json());
      expect(query.mock.calls.length).toBe(calls);
      vi.stubGlobal('caches', {
        default: {
          match: async () => {
            throw new Error('cache offline');
          },
          put: async () => {
            throw new Error('cache offline');
          },
        },
      });
      expect((await app.fetch(request(), {} as any, ctx as any)).status).toBe(
        200
      );
      await Promise.all(writes);
      expect(query.mock.calls.length).toBe(calls + 1);
    } finally {
      query.mockRestore();
      vi.unstubAllGlobals();
    }
  });
  it('canonicalizes keys without viewer credentials or unknown query strings', () => {
    const key = leaderboardCacheKey(
      'https://api.example.com/api/v1/leaderboard?search=ignored',
      options('period=month&college=Campus+A')
    );
    expect(key.url).toBe(
      'https://api.example.com/api/v1/leaderboard?kind=clubs&period=month&college=Campus+A&search=&page=1'
    );
    expect([...key.headers]).toEqual([]);
  });
  it('expires before the week/month changes in India', () => {
    expect(
      leaderboardCacheSeconds(options(), new Date('2026-11-22T18:29:50Z'))
    ).toBe(10);
    expect(
      leaderboardCacheSeconds(
        options('period=month'),
        new Date('2026-11-30T18:29:55Z')
      )
    ).toBe(5);
    expect(leaderboardCacheSeconds(options('period=all'), now)).toBe(30);
  });
});
