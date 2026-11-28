import { Hono } from 'hono';
import { html } from 'hono/html';
import type { CFEnv, HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { isFcmConfigured, subscribeTokensToTopic, unsubscribeTokenFromTopic } from '../fcm';
import { KOLKATA_TOPIC, kolkataReviewButtons, kolkataTelegram } from '../kolkata-curation';
import { campusArea, isKolkataArea, kolkataAreas, kolkataTopic, kolkataTopics, lunchWindow } from '../kolkata-areas';
import { readKccEvent } from '../kolkata-source';

const router = new Hono<HonoEnv>();
const eventFields = {
  id: true, title: true, venue: true, dateLabel: true, priceLabel: true, sourceUrl: true,
} as const;

const fcmConfig = (env: CFEnv) => ({
  projectId: env.FIREBASE_PROJECT_ID, clientEmail: env.FIREBASE_CLIENT_EMAIL, privateKey: env.FIREBASE_PRIVATE_KEY,
});

// Older app builds still request this collection.
router.get('/', (c) => c.json({ events: [] }));

router.get('/alerts', authMiddleware, async (c) => {
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const [subscription, user] = await Promise.all([
    prisma.kolkataAlertSubscriber.findUnique({ where: { userId } }),
    prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } }),
  ]);
  return c.json({ enabled: !!subscription, area: subscription?.area ?? campusArea(user?.collegeName) });
});

router.put('/alerts', authMiddleware, async (c) => {
  const body = await c.req.json().catch(() => null);
  if (typeof body?.enabled !== 'boolean') return c.json({ msg: 'Choose whether to enable alerts' }, 400);
  const prisma = c.get('prisma');
  const userId = c.get('userId');
  const fcm = fcmConfig(c.env);
  if (!isFcmConfigured(fcm)) return c.json({ msg: 'Push alerts are temporarily unavailable' }, 503);
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } });
    const area = isKolkataArea(body.area) ? body.area : campusArea(user?.collegeName);
    if (body.enabled && !area) return c.json({ msg: 'Choose your campus area first' }, 400);
    const devices = await prisma.deviceToken.findMany({ where: { userId, platform: 'android' }, select: { token: true } });
    const tokens = devices.map(({ token }) => token);
    const target = body.enabled && area ? kolkataTopic(area) : null;
    for (const topic of [KOLKATA_TOPIC, ...kolkataTopics]) {
      if (topic !== target) for (const token of tokens) await unsubscribeTokenFromTopic(fcm, token, topic);
    }
    if (target && area) {
      await subscribeTokensToTopic(fcm, tokens, target);
      await prisma.kolkataAlertSubscriber.upsert({ where: { userId }, create: { userId, area }, update: { area } });
    } else {
      await prisma.kolkataAlertSubscriber.deleteMany({ where: { userId } });
    }
    return c.json({ enabled: body.enabled, area });
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
  const message = update?.message;
  if (reviewer && String(message?.from?.id) === reviewer && String(message?.chat?.id) === reviewer &&
      typeof message.text === 'string' && message.text.startsWith('/spot ')) {
    const [area, title, venue, tip, extra] = message.text.slice(6).split('|').map((part: string) => part.trim());
    if (!isKolkataArea(area) || !title || !venue || !tip || extra || title.length > 80 || venue.length > 120 || tip.length > 110) {
      await kolkataTelegram(c.env, 'sendMessage', {
        chat_id: reviewer, text: 'Use /spot area | title | address | useful tip. Areas: beliaghata, garia, sector-v.',
      });
      return c.json({ ok: true });
    }
    const id = 'spot-' + String(message.message_id);
    const prisma = c.get('prisma');
    const now = new Date();
    await prisma.curatedKolkataEvent.createMany({
      data: [{ id, fingerprint: id, title, venue, dateLabel: tip, startsAt: now,
        endsAt: new Date(now.getTime() + 7 * 86_400_000), alertArea: area,
        sourceUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(title + ', ' + venue) }],
      skipDuplicates: true,
    });
    const listing = await prisma.curatedKolkataEvent.findUnique({ where: { id } });
    if (!listing?.reviewedAt && !listing?.reviewMessageId) {
      const result = await kolkataTelegram(c.env, 'sendMessage', {
        chat_id: reviewer, text: [kolkataAreas[area], title, venue, tip].join('\n'),
        reply_markup: kolkataReviewButtons(id, area),
      });
      await prisma.curatedKolkataEvent.update({ where: { id }, data: { reviewMessageId: result.message_id } });
    }
    return c.json({ ok: true });
  }
  if (!reviewer || String(query?.from?.id) !== reviewer || String(query?.message?.chat?.id) !== reviewer ||
      typeof query.id !== 'string' || typeof query.data !== 'string') return c.json({ ok: true });
  if (/^publish:kcc-\d+$/.test(query.data)) {
    await kolkataTelegram(c.env, 'answerCallbackQuery', {
      callback_query_id: query.id, text: 'Use Publish + Notify or Skip on this older review card.',
    }).catch(() => undefined);
    return c.json({ ok: true });
  }
  const input = /^(notify|skip):((?:kcc|spot)-\d+)(?::([a-z-]+))?$/.exec(query.data);
  if (!input) return c.json({ ok: true });
  const [, action, id, area] = input;
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
  if (action === 'notify' && !isFcmConfigured(fcm)) return answer('Push is unavailable. Try again later.');
  const window = lunchWindow(now);
  if (action === 'notify') {
    if (!isKolkataArea(area)) {
      await kolkataTelegram(c.env, 'editMessageReplyMarkup', {
        chat_id: reviewer, message_id: query.message.message_id, reply_markup: kolkataReviewButtons(id),
      }).catch(() => undefined);
      return answer('Choose the campus area to queue this alert.');
    }
    if (event.alertArea && area !== event.alertArea) return answer('This spot is assigned to a different area.');
    if (event.endsAt <= window.startsAt) return answer('This pick expires before the next lunchtime window.');
  }
  if (action === 'notify' && id.startsWith('kcc-')) {
    const current = await readKccEvent(event.sourceUrl).catch(() => null);
    if (!current || current.endsAt <= window.startsAt) return answer('Could not verify the listing for the next lunchtime window.');
    if (current.fingerprint !== event.fingerprint || current.dateLabel !== event.dateLabel || current.priceLabel !== event.priceLabel) {
      await prisma.curatedKolkataEvent.updateMany({
        where: { id, reviewedAt: null, reviewMessageId: event.reviewMessageId },
        data: { ...current, reviewMessageId: null },
      });
      return answer('The listing changed. A fresh review will be queued.');
    }
  }

  const notifyDay = action === 'notify' ? window.nextDay : null;
  try {
    const result = await prisma.curatedKolkataEvent.updateMany({
      where: { id, reviewedAt: null, reviewMessageId: event.reviewMessageId },
      data: { reviewedAt: now, notifyDay, alertArea: notifyDay ? area : null },
    });
    if (!result.count) return answer('Already reviewed.');
  } catch (error) {
    if (notifyDay && typeof error === 'object' && error && 'code' in error && error.code === 'P2002') {
      return answer('An alert is already queued for this area and date.');
    }
    throw error;
  }

  return answer(notifyDay ? 'Queued for 1–2 pm IST on ' + notifyDay + '.' : 'Skipped.');
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
