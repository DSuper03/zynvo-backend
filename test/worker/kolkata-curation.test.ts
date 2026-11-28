import { Hono } from 'hono';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { parseKolkataDate } from '../../src/worker/kolkata-source';
import { deliverKolkataLunchAlerts } from '../../src/worker/kolkata-lunch';
import { campusArea, lunchWindow } from '../../src/worker/kolkata-areas';
import router from '../../src/worker/routes/kolkata';

const mocks = vi.hoisted(() => ({ telegram: vi.fn(), send: vi.fn(), readEvent: vi.fn(), db: vi.fn() }));
vi.mock('../../src/worker/kolkata-curation', () => ({ KOLKATA_TOPIC: 'kolkata_events', kolkataTelegram: mocks.telegram, kolkataReviewButtons: vi.fn() }));
vi.mock('../../src/worker/kolkata-source', async (load) => ({
  ...(await load<typeof import('../../src/worker/kolkata-source')>()),
  readKccEvent: mocks.readEvent,
}));
vi.mock('../../src/worker/fcm', () => ({ isFcmConfigured: () => true, sendToTopic: mocks.send }));

vi.mock('../../src/worker/db', () => ({ createPrismaClient: mocks.db }));

const event = {
  id: 'kcc-921', title: 'Indha Room', venue: 'KCC Amphitheatre', dateLabel: '29th November, 2026',
  priceLabel: null, sourceUrl: 'https://www.kolkatacentreforcreativity.org/event-details/921/indha-room',
  endsAt: new Date('2099-01-01'), reviewedAt: null, reviewMessageId: 12, fingerprint: 'abc',
};
const records = { findUnique: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn(), findMany: vi.fn(), update: vi.fn() };
const env = { KOLKATA_BOT_TOKEN: 'bot', KOLKATA_REVIEWER_ID: '1', KOLKATA_WEBHOOK_SECRET: 'secret' };

function setup() {
  const app = new Hono();
  const tasks: Promise<unknown>[] = [];
  app.use('*', async (c, next) => {
    c.set('prisma' as never, { curatedKolkataEvent: records } as never);
    await next();
  });
  app.route('/', router);
  const review = (action: string, sender = 1, secret = 'secret') => app.request('/telegram', {
    method: 'POST',
    headers: { 'X-Telegram-Bot-Api-Secret-Token': secret },
    body: JSON.stringify({ callback_query: {
      id: 'callback', data: action + ':kcc-921' + (action === 'notify' ? ':garia' : ''), from: { id: sender }, message: { message_id: 12, chat: { id: 1 } },
    } }),
  }, env, { waitUntil: (task: Promise<unknown>) => tasks.push(task) });
  return { app, review, tasks };
}

beforeEach(() => {
  vi.resetAllMocks();
  records.findUnique.mockResolvedValue(event);
  records.updateMany.mockResolvedValue({ count: 1 });
  mocks.readEvent.mockResolvedValue(event);
  mocks.telegram.mockResolvedValue({});
  mocks.send.mockResolvedValue(undefined);
});

it('uses Kolkata local days and rejects malformed calendar dates', () => {
  const result = parseKolkataDate('10–15 December 2026');
  expect(result?.startsAt.toISOString()).toBe('2026-12-09T18:30:00.000Z');
  expect(result?.endsAt.toISOString()).toBe('2026-12-15T18:30:00.000Z');
  expect(parseKolkataDate('29 February 2026')).toBeNull();
  expect(parseKolkataDate('18 December, 20256')).toBeNull();
});

it('does not let an unauthorized callback publish or notify', async () => {
  const { review } = setup();
  expect((await review('notify', 1, 'wrong')).status).toBe(404);
  await review('notify', 2);
  expect(records.updateMany).not.toHaveBeenCalled();
  expect(mocks.send).not.toHaveBeenCalled();
});

it('ignores the legacy publish-only button and exposes no list', async () => {
  const { app, review } = setup();
  await review('publish');
  expect(records.updateMany).not.toHaveBeenCalled();
  expect(mocks.send).not.toHaveBeenCalled();
  expect(await (await app.request('/')).json()).toEqual({ events: [] });
});

it('records a skipped review without sending an alert', async () => {
  const { review } = setup();
  await review('skip');
  expect(records.updateMany).toHaveBeenCalledWith(expect.objectContaining({
    data: expect.objectContaining({ reviewedAt: expect.any(Date), alertArea: null, notifyDay: null }),
  }));
  expect(mocks.send).not.toHaveBeenCalled();
});

afterEach(() => vi.useRealTimers());

it('queues approval for the next lunch and never sends during review', async () => {
  vi.setSystemTime(new Date('2026-11-28T09:00:00Z'));
  const { review } = setup();
  await review('notify');
  expect(records.updateMany).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ notifyDay: '2026-11-29', alertArea: 'garia' }) }));
  expect(mocks.send).not.toHaveBeenCalled();
});

it('uses campus aliases and opens the queue only from 1 to 2 pm IST', () => {
  expect(campusArea('Netaji Subhash Engineering College, Kolkata')).toBe('garia');
  expect(campusArea('RCCIIT')).toBe('beliaghata');
  expect(campusArea('other college')).toBeNull();
  expect(lunchWindow(new Date('2026-11-28T07:29:59Z')).open).toBe(false);
  expect(lunchWindow(new Date('2026-11-28T07:30:00Z')).open).toBe(true);
  expect(lunchWindow(new Date('2026-11-28T08:30:00Z')).open).toBe(false);
});

it('sends only a claimed lunchtime pick to its campus topic', async () => {
  const now = new Date('2026-11-28T07:45:00Z');
  vi.setSystemTime(now);
  mocks.db.mockReturnValue({ curatedKolkataEvent: records, $disconnect: vi.fn().mockResolvedValue(undefined) });
  records.findMany.mockResolvedValue([{ ...event, alertArea: 'garia' }]);
  records.updateMany.mockResolvedValueOnce({ count: 0 });
  await deliverKolkataLunchAlerts(env as never, now);
  expect(mocks.send).not.toHaveBeenCalled();
  await deliverKolkataLunchAlerts(env as never, now);
  expect(mocks.send).toHaveBeenCalledExactlyOnceWith(expect.anything(), 'kolkata_events_garia', expect.anything(), {
    type: 'kolkata_event', externalUrl: event.sourceUrl, route: '/kolkata-events/kcc-921',
  }, { ttlSeconds: 2700 });
});

it('renders shareable event details with HTML escaping', async () => {
  const { app } = setup();
  records.findFirst.mockResolvedValue({ ...event, title: '<script>alert(1)</script>' });
  const response = await app.request('/kcc-921?view=web');
  expect(response.status).toBe(200);
  const page = await response.text();
  expect(page).toContain('&lt;script&gt;');
  expect(page).toContain('zynvo://kolkata-events/kcc-921');
  expect(page).not.toContain('<script>');
});
