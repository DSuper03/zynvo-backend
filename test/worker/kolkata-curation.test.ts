import { Hono } from 'hono';
import { beforeEach, expect, it, vi } from 'vitest';
import { parseKolkataDate, readKccEvent } from '../../src/worker/kolkata-source';
import router from '../../src/worker/routes/kolkata';

const mocks = vi.hoisted(() => ({ telegram: vi.fn(), send: vi.fn(), readEvent: vi.fn() }));
vi.mock('../../src/worker/kolkata-curation', () => ({ KOLKATA_TOPIC: 'kolkata_events', kolkataTelegram: mocks.telegram }));
vi.mock('../../src/worker/kolkata-source', async (load) => ({
  ...(await load<typeof import('../../src/worker/kolkata-source')>()),
  readKccEvent: mocks.readEvent,
}));
vi.mock('../../src/worker/fcm', () => ({ isFcmConfigured: () => true, sendToTopic: mocks.send }));

const event = {
  id: 'kcc-921', title: 'Indha Room', venue: 'KCC Amphitheatre', dateLabel: '29th November, 2026',
  priceLabel: null, sourceUrl: 'https://www.kolkatacentreforcreativity.org/event-details/921/indha-room',
  endsAt: new Date('2099-01-01'), reviewedAt: null, reviewMessageId: 12, fingerprint: 'abc',
};
const records = { findUnique: vi.fn(), updateMany: vi.fn(), findFirst: vi.fn() };
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
      id: 'callback', data: action + ':kcc-921', from: { id: sender }, message: { message_id: 12, chat: { id: 1 } },
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

it('publishes without sending when the reviewer chooses Publish', async () => {
  const { review } = setup();
  await review('publish');
  expect(readKccEvent).toHaveBeenCalledWith(event.sourceUrl);
  expect(records.updateMany).toHaveBeenCalledWith(expect.objectContaining({
    data: expect.objectContaining({ publishedAt: expect.any(Date), notifyDay: null }),
  }));
  expect(mocks.send).not.toHaveBeenCalled();
});

it('only sends after winning the atomic review and daily cap', async () => {
  const { review, tasks } = setup();
  records.updateMany.mockResolvedValueOnce({ count: 0 }).mockRejectedValueOnce({ code: 'P2002' });
  await review('notify');
  await review('notify');
  expect(mocks.send).not.toHaveBeenCalled();
  await review('notify');
  await Promise.all(tasks);
  expect(mocks.send).toHaveBeenCalledExactlyOnceWith(expect.anything(), 'kolkata_events', expect.anything(), {
    type: 'kolkata_event', route: '/kolkata-events/kcc-921',
  });
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
