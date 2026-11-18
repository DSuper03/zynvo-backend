import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Hono } from 'hono';

const notification = vi.hoisted(() => ({ createNotification: vi.fn(), sendToMany: vi.fn() }));
vi.mock('../src/worker/utils/notification', () => notification);
vi.mock('../src/worker/middleware/auth', () => ({
  authMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  clubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  adminCoreAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
  specificClubHeadAuthMiddleware: async (_c: unknown, next: () => Promise<void>) => next(),
}));
import events from '../src/worker/routes/events';

describe('event lifecycle notifications', () => {
  beforeEach(() => vi.clearAllMocks());
  const env = { NODE_ENV: 'test' };
  function setup(prisma: any) {
    const tasks: Promise<unknown>[] = [];
    const app = new Hono();
    app.use('*', async (c, next) => { c.set('prisma' as never, prisma as never); c.set('userId' as never, 'organizer' as never); c.set('clubId' as never, 'club' as never); c.set('clubName' as never, 'Club' as never); c.set('clubCollege' as never, 'College' as never); await next(); });
    app.route('/', events);
    return { app, tasks, ctx: { waitUntil: (task: Promise<unknown>) => tasks.push(task), passThroughOnException: () => {} } as any };
  }
  const post = (body: unknown) => ({ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const put = (body: unknown) => ({ ...post(body), method: 'PUT' });

  it('alerts the other core members only for a core-team event', async () => {
    const prisma = { event: { create: vi.fn().mockResolvedValue({ id: 'e1' }) }, clubs: { findUnique: vi.fn().mockResolvedValue({ founderEmail: 'founder@x.test', coremember1: 'core@x.test', coremember2: null, coremember3: null }) }, user: { findMany: vi.fn().mockResolvedValue([{ id: 'organizer' }, { id: 'core' }, { id: 'core' }]) } };
    const { app, ctx, tasks } = setup(prisma);
    expect((await app.request('/event', post({ eventName: 'Private', coreTeamOnly: true, maxTeamSize: 1 }), env, ctx)).status).toBe(201);
    await Promise.all(tasks);
    expect(notification.sendToMany).toHaveBeenCalledWith(prisma, expect.anything(), expect.objectContaining({ userIds: ['core'], push: true, message: expect.objectContaining({ data: { eventId: 'e1', route: '/events/e1' } }) }));
    tasks.length = 0; vi.clearAllMocks();
    await app.request('/event', post({ eventName: 'Public', coreTeamOnly: false, maxTeamSize: 1 }), env, ctx);
    expect(tasks).toHaveLength(0);
  });

  it('notifies only after a pending approval changes and avoids duplicates', async () => {
    const prisma = { user: { findUnique: vi.fn().mockResolvedValue({ email: 'founder@x.test' }) }, clubs: { findUnique: vi.fn().mockResolvedValue({ founderEmail: 'founder@x.test' }) }, event: { findUnique: vi.fn().mockResolvedValue({ clubId: 'club', EventName: 'Event' }) }, userEvents: { updateMany: vi.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 }) }, eventQueue: { deleteMany: vi.fn() } };
    const { app, ctx, tasks } = setup(prisma);
    expect((await app.request('/eventQueue/e1/approve', put({ userId: 'attendee', accepted: true }), env, ctx)).status).toBe(200);
    await Promise.all(tasks);
    expect(notification.createNotification).toHaveBeenCalledWith(prisma, expect.anything(), expect.objectContaining({ userId: 'attendee', title: 'Registration approved', push: true }));
    expect((await app.request('/eventQueue/e1/approve', put({ userId: 'attendee', accepted: true }), env, ctx)).status).toBe(404);
    expect(notification.createNotification).toHaveBeenCalledTimes(1);
  });

  it('notifies the attendee when a registration is declined', async () => {
    const prisma = { user: { findUnique: vi.fn().mockResolvedValue({ email: 'founder@x.test' }) }, clubs: { findUnique: vi.fn().mockResolvedValue({ founderEmail: 'founder@x.test' }) }, event: { findUnique: vi.fn().mockResolvedValue({ clubId: 'club', EventName: 'Event' }) }, userEvents: { updateMany: vi.fn().mockResolvedValue({ count: 1 }) }, eventQueue: { deleteMany: vi.fn() } };
    const { app, ctx, tasks } = setup(prisma);
    expect((await app.request('/eventQueue/e1/approve', put({ userId: 'attendee', accepted: false }), env, ctx)).status).toBe(200);
    await Promise.all(tasks);
    expect(notification.createNotification).toHaveBeenCalledWith(prisma, expect.anything(), expect.objectContaining({ userId: 'attendee', title: 'Registration declined', data: { eventId: 'e1', route: '/events/e1' } }));
  });

  it('notifies attendees of meaningful changes but not a description edit', async () => {
    const original = { startDate: '2026-12-01', endDate: '2026-12-02', Venue: 'Hall', EventMode: 'offline', coreTeamOnly: false, collegeStudentsOnly: false, acceptanceBased: false };
    const prisma = { event: { findUnique: vi.fn().mockResolvedValue(original), update: vi.fn().mockImplementation(async ({ data }) => ({ ...original, ...data, EventName: 'Event' })) }, userEvents: { findMany: vi.fn().mockResolvedValue([{ userId: 'a' }, { userId: 'a' }, { userId: 'b' }]) } };
    const { app, ctx, tasks } = setup(prisma);
    await app.request('/event/e1', put({ description: 'A typo fix' }), env, ctx);
    expect(tasks).toHaveLength(0);
    await app.request('/event/e1', put({ Venue: 'New hall' }), env, ctx);
    await Promise.all(tasks);
    expect(notification.sendToMany).toHaveBeenCalledWith(prisma, expect.anything(), expect.objectContaining({ userIds: ['a', 'b'], message: expect.objectContaining({ body: expect.stringContaining('venue or mode') }) }));
    notification.sendToMany.mockClear(); tasks.length = 0;
    await app.request('/event/e1', put({ eventStartDate: '2026-12-03' }), env, ctx);
    await Promise.all(tasks);
    expect(prisma.event.update).toHaveBeenLastCalledWith(expect.objectContaining({ data: expect.objectContaining({ startDate: '2026-12-03' }) }));
    expect(notification.sendToMany).toHaveBeenCalledWith(prisma, expect.anything(), expect.objectContaining({ message: expect.objectContaining({ body: expect.stringContaining('date') }) }));
  });
});
