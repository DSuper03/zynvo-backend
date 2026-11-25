import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';

vi.mock('../src/worker/middleware/auth', () => ({
  authMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  clubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  adminCoreAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  specificClubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
}));

import events from '../src/worker/routes/events';
import { countTags, normalizeTag, parseTags } from '../src/worker/eventTags';

const execCtx = { waitUntil: () => {}, passThroughOnException: () => {} } as any;

function appWith(prisma: unknown) {
  const app = new Hono();
  app.use('*', async (c, next) => {
    c.set('prisma' as never, prisma as never);
    c.set('userId' as never, 'user-1' as never);
    await next();
  });
  app.route('/', events);
  return app;
}

const put = (app: Hono, body: unknown) =>
  app.request(
    '/event/event-1',
    { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) },
    { NODE_ENV: 'test' },
    execCtx
  );

describe('normalizeTag', () => {
  it('lowercases, trims and tidies spaces', () => {
    expect(normalizeTag('  Machine   Learning ')).toBe('machine learning');
    expect(normalizeTag('AI')).toBe('ai');
  });
  it('keeps useful symbols and non-English letters', () => {
    expect(normalizeTag('C++')).toBe('c++');
    expect(normalizeTag('AI/ML')).toBe('ai/ml');
    expect(normalizeTag('R&D')).toBe('r&d');
    expect(normalizeTag('हिंदी')).toBe('हिंदी');
    expect(normalizeTag('বাংলা')).toBe('বাংলা');
  });
  it('strips markup and dangerous characters', () => {
    expect(normalizeTag('<script>alert(1)</script>')).toBe('scriptalert1/script');
    expect(normalizeTag('"; DROP TABLE event; --')).toBe('drop table event');
  });
  it('does not leave leading/trailing dashes or dots', () => {
    expect(normalizeTag('--hack.')).toBe('hack');
  });
});

describe('parseTags', () => {
  it('treats missing as no tags', () => {
    expect(parseTags(undefined)).toEqual({ ok: true, tags: [] });
    expect(parseTags(null)).toEqual({ ok: true, tags: [] });
  });
  it('normalises, drops blanks and removes duplicates keeping order', () => {
    expect(parseTags([' Hackathon ', 'AI', '', 'hackathon', '  '])).toEqual({
      ok: true,
      tags: ['hackathon', 'ai'],
    });
  });
  it('accepts a comma separated string', () => {
    expect(parseTags('Workshop, Coding ,workshop')).toEqual({
      ok: true,
      tags: ['workshop', 'coding'],
    });
  });
  it('allows exactly 5 tags but rejects 6', () => {
    expect(parseTags(['a', 'b', 'c', 'd', 'e']).ok).toBe(true);
    const six = parseTags(['a', 'b', 'c', 'd', 'e', 'f']);
    expect(six).toEqual({ ok: false, msg: 'You can add at most 5 tags.' });
  });
  it('duplicates do not count towards the limit', () => {
    expect(parseTags(['a', 'A', 'b', 'c', 'd', 'e']).ok).toBe(true);
  });
  it('rejects tags over 24 characters, accepts exactly 24', () => {
    expect(parseTags(['x'.repeat(24)]).ok).toBe(true);
    expect(parseTags(['x'.repeat(25)])).toEqual({
      ok: false,
      msg: 'Each tag can be at most 24 characters.',
    });
  });
  it('rejects non-text values', () => {
    expect(parseTags([1, 2]).ok).toBe(false);
    expect(parseTags({ a: 1 }).ok).toBe(false);
    expect(parseTags(['ok', null]).ok).toBe(false);
  });
});

describe('countTags', () => {
  it('ranks by use, then alphabetically, and respects the limit', () => {
    const rows = [
      { tags: ['ai', 'hackathon'] },
      { tags: ['hackathon', 'web'] },
      { tags: ['hackathon', 'ai'] },
      { tags: null },
      {},
    ];
    expect(countTags(rows, 10)).toEqual([
      { tag: 'hackathon', count: 3 },
      { tag: 'ai', count: 2 },
      { tag: 'web', count: 1 },
    ]);
    expect(countTags(rows, 2)).toHaveLength(2);
  });
});

describe('PUT /event/:id with tags', () => {
  const previous = { startDate: '2026-12-01', endDate: '2026-12-02', Venue: 'Hall', EventMode: 'Offline', coreTeamOnly: false, collegeStudentsOnly: true, acceptanceBased: false };

  function prismaFor(update = vi.fn()) {
    update.mockImplementation(async ({ data }: any) => ({
      id: 'event-1', EventName: 'E', ...previous, tags: data.tags ?? [],
    }));
    return {
      update,
      prisma: { event: { findUnique: vi.fn().mockResolvedValue(previous), update } },
    };
  }

  it('saves normalised tags', async () => {
    const { prisma, update } = prismaFor();
    const res = await put(appWith(prisma), { tags: [' Hackathon ', 'AI', 'ai'] });
    expect(res.status).toBe(200);
    expect(update.mock.calls[0][0].data.tags).toEqual(['hackathon', 'ai']);
    const json: any = await res.json();
    expect(json.response.tags).toEqual(['hackathon', 'ai']);
  });

  it('can clear all tags with an empty list', async () => {
    const { prisma, update } = prismaFor();
    const res = await put(appWith(prisma), { tags: [] });
    expect(res.status).toBe(200);
    expect(update.mock.calls[0][0].data.tags).toEqual([]);
  });

  it('rejects more than 5 tags and never touches the database', async () => {
    const { prisma, update } = prismaFor();
    const res = await put(appWith(prisma), { tags: ['a', 'b', 'c', 'd', 'e', 'f'] });
    expect(res.status).toBe(400);
    expect(update).not.toHaveBeenCalled();
  });

  it('does not change tags when the request does not mention them', async () => {
    const { prisma, update } = prismaFor();
    const res = await put(appWith(prisma), { tagline: 'New tagline' });
    expect(res.status).toBe(200);
    expect('tags' in update.mock.calls[0][0].data).toBe(false);
  });

  it('a request with only tags is a valid update', async () => {
    const { prisma } = prismaFor();
    const res = await put(appWith(prisma), { tags: ['x'] });
    expect(res.status).toBe(200);
  });
});

describe('GET /search with tags', () => {
  function searchPrisma() {
    const findMany = vi.fn().mockResolvedValue([]);
    const count = vi.fn().mockResolvedValue(0);
    return { findMany, prisma: { event: { findMany, count } } };
  }
  const get = (app: Hono, url: string) =>
    app.request(url, { method: 'GET' }, { NODE_ENV: 'test' }, execCtx);

  it('filters by an exact normalised tag', async () => {
    const { prisma, findMany } = searchPrisma();
    const res = await get(appWith(prisma), '/search?tag=%20Hackathon%20');
    expect(res.status).toBe(200);
    expect(findMany.mock.calls[0][0].where).toEqual({
      AND: [{ tags: { has: 'hackathon' } }],
    });
  });

  it('a text search also matches events tagged with that word', async () => {
    const { prisma, findMany } = searchPrisma();
    await get(appWith(prisma), '/search?q=Hackathon');
    const or = findMany.mock.calls[0][0].where.AND[0].OR;
    expect(or).toContainEqual({ tags: { has: 'hackathon' } });
    expect(or).toContainEqual({ EventName: { contains: 'Hackathon', mode: 'insensitive' } });
  });

  it('combines the tag filter with other filters', async () => {
    const { prisma, findMany } = searchPrisma();
    await get(appWith(prisma), '/search?tag=ai&isPaid=false');
    const and = findMany.mock.calls[0][0].where.AND;
    expect(and).toContainEqual({ tags: { has: 'ai' } });
    expect(and).toContainEqual({ isPaid: false });
  });

  it('a blank or symbol-only tag adds no filter', async () => {
    const { prisma, findMany } = searchPrisma();
    await get(appWith(prisma), '/search?tag=%3C%3E');
    expect(findMany.mock.calls[0][0].where).toEqual({});
  });
});

describe('GET /tags', () => {
  const rows = [
    { tags: ['ai', 'hackathon'] },
    { tags: ['hackathon', 'hardware'] },
    { tags: ['hackathon', 'ai'] },
  ];
  const get = (url: string) => {
    const prisma = { event: { findMany: vi.fn().mockResolvedValue(rows) } };
    return appWith(prisma).request(url, { method: 'GET' }, { NODE_ENV: 'test' }, execCtx);
  };

  it('returns the most used tags first', async () => {
    const json: any = await (await get('/tags')).json();
    expect(json.tags).toEqual([
      { tag: 'hackathon', count: 3 },
      { tag: 'ai', count: 2 },
      { tag: 'hardware', count: 1 },
    ]);
  });

  it('narrows to a prefix while typing and respects limit', async () => {
    const byPrefix: any = await (await get('/tags?q=Ha')).json();
    expect(byPrefix.tags.map((t: any) => t.tag)).toEqual(['hackathon', 'hardware']);
    const limited: any = await (await get('/tags?limit=1')).json();
    expect(limited.tags).toHaveLength(1);
  });
});
