/**
 * Runs every minute from the cron trigger. Plans today's drop (random minute
 * between 07:00 and 01:00 IST), then sends it once that minute arrives.
 *
 * Each minute costs one KV read; the database is only touched when today's
 * drop needs planning or is due. Sending is claimed with an atomic update so
 * two overlapping runs can never push twice.
 */

import { LIVE_MS, dropWindowAt, isDue, pickQuestion, pickSendAt } from './policy';
import { DROP_QUESTIONS, type DropQuestion } from './questions';

export const DROP_TOPIC = 'campus_drop';
export const DROP_ROUTE = '/drop';
export const DROP_TITLE = `🔴 The Drop is live · 10 min`;

type Kv = {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, opts?: { expirationTtl?: number }): Promise<void>;
};

export type TickDeps = {
  prisma: any;
  kv?: Kv | null;
  now: Date;
  random?: () => number;
  send: (notification: { title: string; body: string }, data: Record<string, string>) => Promise<void>;
  questions?: readonly DropQuestion[];
};

export type TickResult = 'quiet' | 'waiting' | 'planned' | 'sent' | 'already-sent';

export const dropKvKey = (day: string) => `campus-drop:${day}`;
const kvKey = dropKvKey;
const TWO_DAYS = 2 * 24 * 60 * 60;

export async function campusDropTick(deps: TickDeps): Promise<TickResult> {
  const { prisma, kv, now } = deps;
  const window = dropWindowAt(now);
  if (!window) return 'quiet';

  // Cheap check first: KV remembers "sent" or the planned send time.
  const cached = kv ? await kv.get(kvKey(window.day)) : null;
  if (cached === 'sent') return 'already-sent';
  if (cached && now.getTime() < Date.parse(cached)) return 'waiting';

  let drop = await prisma.campusDrop.findUnique({ where: { day: window.day } });
  let planned = false;
  if (!drop) {
    const q = pickQuestion(deps.questions ?? DROP_QUESTIONS, window.day);
    try {
      drop = await prisma.campusDrop.create({
        data: {
          day: window.day,
          kind: 'poll',
          question: q.question,
          options: q.options,
          teaser: q.teaser,
          sendAt: pickSendAt(window, now, deps.random),
        },
      });
      planned = true;
    } catch (err: any) {
      // Another run planned it first.
      if (err?.code !== 'P2002') throw err;
      drop = await prisma.campusDrop.findUnique({ where: { day: window.day } });
      if (!drop) throw err;
    }
  }

  if (drop.sentAt) {
    await kv?.put(kvKey(window.day), 'sent', { expirationTtl: TWO_DAYS });
    return 'already-sent';
  }
  if (!isDue(drop, now)) {
    await kv?.put(kvKey(window.day), new Date(drop.sendAt).toISOString(), { expirationTtl: TWO_DAYS });
    return planned ? 'planned' : 'waiting';
  }

  const claimed = await prisma.campusDrop.updateMany({
    where: { id: drop.id, sentAt: null },
    data: { sentAt: now, closesAt: new Date(now.getTime() + LIVE_MS) },
  });
  if (claimed.count !== 1) return 'already-sent';

  try {
    await deps.send(
      { title: DROP_TITLE, body: drop.teaser },
      { type: 'campus_drop', dropId: drop.id, route: DROP_ROUTE },
    );
  } catch (err) {
    // Not sent: release the claim so the next minute tries again.
    await prisma.campusDrop.updateMany({
      where: { id: drop.id },
      data: { sentAt: null, closesAt: null },
    });
    throw err;
  }
  await kv?.put(kvKey(window.day), 'sent', { expirationTtl: TWO_DAYS });
  return 'sent';
}

// ── One-time topic backfill ───────────────────────────────────
// New devices join the topic when they register. Devices registered before
// Campus Drop existed are added here, in pages, a few thousand per minute.

export const BACKFILL_KEY = 'campus-drop:topic-backfill';
const PAGE = 1000;
const PAGES_PER_RUN = 5;

export type BackfillDeps = {
  prisma: any;
  kv: Kv;
  subscribe: (tokens: string[]) => Promise<void>;
};

export async function backfillDropTopic(deps: BackfillDeps): Promise<number> {
  const { prisma, kv } = deps;
  const state = await kv.get(BACKFILL_KEY);
  if (state === 'done') return 0;
  let cursor = state || undefined;
  let added = 0;

  for (let page = 0; page < PAGES_PER_RUN; page++) {
    const rows: { id: string; token: string }[] = await prisma.deviceToken.findMany({
      where: { user: { campusDropOptOut: { is: null } } },
      select: { id: true, token: true },
      orderBy: { id: 'asc' },
      take: PAGE,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    if (rows.length) {
      await deps.subscribe(rows.map((r) => r.token));
      added += rows.length;
      cursor = rows[rows.length - 1].id;
    }
    if (rows.length < PAGE) {
      await kv.put(BACKFILL_KEY, 'done');
      return added;
    }
    await kv.put(BACKFILL_KEY, cursor!);
  }
  return added;
}
