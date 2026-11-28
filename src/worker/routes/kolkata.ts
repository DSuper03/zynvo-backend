import { Hono } from 'hono';
import { html } from 'hono/html';
import type { CFEnv, HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { isFcmConfigured, sendToTopic, subscribeTokensToTopic, unsubscribeTokenFromTopic } from '../fcm';
import { KOLKATA_TOPIC, kolkataTelegram } from '../kolkata-curation';
import { readKccEvent } from '../kolkata-source';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();
const eventFields = {
  id: true, title: true, venue: true, dateLabel: true, priceLabel: true, sourceUrl: true,
} as const;

const fcmConfig = (env: CFEnv) => ({
  projectId: env.FIREBASE_PROJECT_ID, clientEmail: env.FIREBASE_CLIENT_EMAIL, privateKey: env.FIREBASE_PRIVATE_KEY,
});

router.get('/', async (c) => {
  const events = await c.get('prisma').curatedKolkataEvent.findMany({
    where: { publishedAt: { not: null }, endsAt: { gt: new Date() } },
    select: eventFields,
    orderBy: [{ startsAt: 'asc' }, { id: 'asc' }],
    take: 50,
  });
  return c.json({ events });
});

router.get('/alerts', authMiddleware, async (c) => {
  const subscription = await c.get('prisma').kolkataAlertSubscriber.findUnique({ where: { userId: c.get('userId') } });
  return c.json({ enabled: !!subscription });
});

router.put('/alerts', authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (typeof body?.enabled !== 'boolean') return c.json({ msg: 'Choose whether to enable alerts' }, 400);
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const fcm = fcmConfig(c.env);
  if (!isFcmConfigured(fcm)) return c.json({ msg: 'Push alerts are temporarily unavailable' }, 503);
  try {
    const devices = await prisma.deviceToken.findMany({ where: { userId, platform: 'android' }, select: { token: true } });
    const tokens = devices.map(({ token }) => token);
    if (body.enabled) {
      await subscribeTokensToTopic(fcm, tokens, KOLKATA_TOPIC);
      await prisma.kolkataAlertSubscriber.upsert({ where: { userId }, create: { userId }, update: {} });
    } else {
      for (const token of tokens) await unsubscribeTokenFromTopic(fcm, token, KOLKATA_TOPIC);
      await prisma.kolkataAlertSubscriber.deleteMany({ where: { userId } });
    }
    return c.json({ enabled: body.enabled });
  } catch {
    return c.json({ msg: 'Could not change Kolkata alerts. Try again.' }, 503);
  }
});

router.post('/telegram', async (c) => {
  const secret = c.env.KOLKATA_WEBHOOK_SECRET;
  if (!secret || !c.env.KOLKATA_BOT_TOKEN || c.req.header('X-Telegram-Bot-Api-Secret-Token') !== secret) {
    return c.notFound();
  }
  const update = await c.req.json().catch(() => null);
  const query = update?.callback_query;
  const reviewer = c.env.KOLKATA_REVIEWER_ID;
  if (!reviewer || String(query?.from?.id) !== reviewer || String(query?.message?.chat?.id) !== reviewer ||
      typeof query.id !== 'string' || typeof query.data !== 'string') return c.json({ ok: true });
  const input = /^(publish|notify|skip):(kcc-\d+)$/.exec(query.data);
  if (!input) return c.json({ ok: true });
  const [, action, id] = input;
  const prisma = c.get('prisma');
  const answer = async (text: string) => {
    await kolkataTelegram(c.env, 'answerCallbackQuery', { callback_query_id: query.id, text }).catch(() => undefined);
    return c.json({ ok: true });
  };
  const event = await prisma.curatedKolkataEvent.findUnique({ where: { id } });
  if (!event || event.reviewedAt || event.reviewMessageId !== query.message.message_id) {
    return answer('This review is no longer pending.');
  }

  const now = new Date();
  const fcm = fcmConfig(c.env);
  if (action === 'notify' && !isFcmConfigured(fcm)) return answer('Push is unavailable. You can still publish.');
  if (action !== 'skip') {
    const current = await readKccEvent(event.sourceUrl).catch(() => null);
    if (!current || current.endsAt <= now) return answer('Could not verify the listing. Check the organizer link.');
    if (current.fingerprint !== event.fingerprint || current.dateLabel !== event.dateLabel || current.priceLabel !== event.priceLabel) {
      await prisma.curatedKolkataEvent.updateMany({
        where: { id, reviewedAt: null, reviewMessageId: event.reviewMessageId },
        data: { ...current, reviewMessageId: null },
      });
      return answer('The listing changed. A fresh review will be queued.');
    }
  }

  // A unique nullable date enforces the Kolkata-local daily cap across Workers.
  const notifyDay = action === 'notify' ? new Date(now.getTime() + 330 * 60_000).toISOString().slice(0, 10) : null;
  try {
    const result = await prisma.curatedKolkataEvent.updateMany({
      where: { id, reviewedAt: null, reviewMessageId: event.reviewMessageId },
      data: { reviewedAt: now, publishedAt: action === 'skip' ? null : now, notifyDay },
    });
    if (!result.count) return answer('Already reviewed.');
  } catch (error) {
    if (notifyDay && typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return answer('One alert has already been approved today. Use Publish to list this event.');
    }
    throw error;
  }

  if (notifyDay) {
    c.executionCtx.waitUntil(sendToTopic(fcm, KOLKATA_TOPIC, {
      title: event.title,
      body: [event.venue, event.dateLabel].join(' · ').slice(0, 200),
    }, { type: 'kolkata_event', route: '/kolkata-events/' + id }).catch(async () => {
      logger.error('Kolkata push could not be confirmed', { id });
      await kolkataTelegram(c.env, 'sendMessage', {
        chat_id: reviewer,
        text: 'Published ' + event.title + '. Firebase delivery could not be confirmed.',
      }).catch(() => undefined);
    }));
  }
  return answer(notifyDay ? 'Published. Alert queued.' : action === 'skip' ? 'Skipped.' : 'Published.');
});

router.get('/:id', async (c) => {
  const event = await c.get('prisma').curatedKolkataEvent.findFirst({
    where: { id: c.req.param('id'), publishedAt: { not: null } },
    select: eventFields,
  });
  if (!event) return c.notFound();
  if (c.req.query('view') !== 'web') return c.json({ event });
  return c.html(html`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${event.title} | Zynvo</title>
        <style>
          body { margin: 3rem auto; padding: 0 1.25rem; max-width: 36rem; background: #111; color: #eee; font: 1.1rem/1.6 system-ui; }
          a { display: inline-block; color: #ffd700; margin: 0 .75rem .5rem 0; }
        </style>
      </head>
      <body><main>
        <h1>${event.title}</h1>
        <p>${event.dateLabel}</p>
        <p>${event.venue}</p>
        <p>${event.priceLabel ?? 'See the organizer for pricing'}</p>
        <p>
          <a href="${event.sourceUrl}">Organizer details</a>
          <a href="zynvo://kolkata-events/${event.id}">Open in Zynvo</a>
          <a href="https://play.google.com/store/apps/details?id=com.zynvosocial.app">Get Zynvo</a>
        </p>
      </main></body>
    </html>`);
});

export default router;
