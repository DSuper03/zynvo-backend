import { describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';

vi.mock('../src/worker/middleware/auth', () => ({
  authMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  clubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  adminCoreAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  specificClubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
}));

import events from '../src/worker/routes/events';

describe('core-team-only registration', () => {
  for (const path of ['/register/event-1', '/registerEvent']) {
    for (const [email, restricted, expected] of [
      ['FOUNDER@example.com', true, 200],
      ['core@example.com', true, 200],
      ['other@example.com', true, 403],
      ['other@example.com', false, 200],
    ] as const) {
      it(`${path} permits ${email} when restricted=${restricted} as expected`, async () => {
        const create = vi.fn().mockResolvedValue({ uniquePassId: 'pass', paymentStatus: 'CONFIRMED' });
        const prisma = {
          event: { findUnique: vi.fn().mockResolvedValue({ id: 'event-1', clubId: 'club-1', coreTeamOnly: restricted, maxParticipants: null, collegeStudentsOnly: false, isPaid: false, acceptanceBased: false, applicationStatus: 'open', applicationEndDate: '', university: 'College', customQuestions: [], _count: { attendees: 0 } }) },
          user: { findUnique: vi.fn().mockResolvedValue({ email }) },
          clubs: { findUnique: vi.fn().mockResolvedValue({ founderEmail: 'founder@example.com', coremember1: 'core@example.com', coremember2: null, coremember3: null }) },
          userEvents: { findUnique: vi.fn().mockResolvedValue(null), create },
          $transaction: vi.fn(async (fn) => fn({ userEvents: { create } })),
        };
        const app = new Hono();
        app.use('*', async (c, next) => { c.set('prisma' as never, prisma as never); c.set('userId' as never, 'user-1' as never); await next(); });
        app.route('/', events);
        const response = await app.request(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId: 'event-1' }) }, { NODE_ENV: 'test' }, { waitUntil: () => {}, passThroughOnException: () => {} } as any);
        expect(response.status === 201 ? 200 : response.status).toBe(expected);
        expect(create).toHaveBeenCalledTimes(expected === 403 ? 0 : 1);
      });
    }
  }
});
