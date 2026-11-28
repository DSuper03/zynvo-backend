import { createPrismaClient } from './db';
import type { CFEnv } from './types';
import { listKccEvents, readKccEvent } from './kolkata-source';
import { logger } from './logger';

export const KOLKATA_TOPIC = 'kolkata_events';

export async function kolkataTelegram(env: CFEnv, method: string, payload: object) {
  const response = await fetch('https://api.telegram.org/bot' + env.KOLKATA_BOT_TOKEN + '/' + method, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(7_000),
  }).catch(() => null);
  if (!response?.ok) throw new Error('Telegram request failed: ' + (response?.status ?? 'network error'));
  const result = await response.json<{ ok: boolean; result: { message_id: number } }>();
  if (!result.ok) throw new Error('Telegram rejected the request');
  return result.result;
}

export async function scanKolkataEvents(env: CFEnv) {
  if (!env.KOLKATA_BOT_TOKEN || !env.KOLKATA_REVIEWER_ID || !env.KOLKATA_WEBHOOK_SECRET) return;
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const listings = (await listKccEvents()).map((url) => ({
      url, id: 'kcc-' + new URL(url).pathname.split('/')[2],
    }));
    if (!listings.length) return;
    const existing = await prisma.curatedKolkataEvent.findMany({
      where: { id: { in: listings.map(({ id }) => id) } },
      select: { id: true, reviewedAt: true, reviewMessageId: true },
    });
    const known = new Map(existing.map((event) => [event.id, event]));
    let queued = 0;
    for (const { url, id } of listings) {
      if (queued >= 3) break;
      try {
        const previous = known.get(id);
        if (previous?.reviewMessageId || previous?.reviewedAt) continue;
        const event = await readKccEvent(url);
        if (!event || event.endsAt.getTime() <= Date.now()) continue;
        if (previous) {
          const refreshed = await prisma.curatedKolkataEvent.updateMany({
            where: { id, reviewedAt: null, reviewMessageId: null },
            data: event,
          });
          if (!refreshed.count) continue;
        } else {
          const inserted = await prisma.curatedKolkataEvent.createMany({ data: [event], skipDuplicates: true });
          if (!inserted.count) continue;
        }
        const result = await kolkataTelegram(env, 'sendMessage', {
          chat_id: env.KOLKATA_REVIEWER_ID,
          text: [event.title, event.dateLabel, event.venue, event.priceLabel ?? 'Price: see organizer', event.sourceUrl].join('\n'),
          link_preview_options: { is_disabled: true },
          reply_markup: { inline_keyboard: [[
            { text: 'Yes, send alert', callback_data: 'notify:' + event.id },
            { text: 'No, skip', callback_data: 'skip:' + event.id },
          ]] },
        });
        await prisma.curatedKolkataEvent.update({ where: { id: event.id }, data: { reviewMessageId: result.message_id } });
        queued++;
      } catch {
        logger.warn('Kolkata listing could not be queued', { url });
      }
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
