import { createPrismaClient } from './db';
import { isFcmConfigured, sendToTopic } from './fcm';
import { kolkataAreas, isKolkataArea, kolkataTopic, lunchWindow } from './kolkata-areas';
import { kolkataTelegram } from './kolkata-curation';
import { readKccEvent } from './kolkata-source';
import { logger } from './logger';
import type { CFEnv } from './types';

export async function deliverKolkataLunchAlerts(env: CFEnv, now = new Date()) {
  const window = lunchWindow(now);
  if (!window.open || !env.KOLKATA_BOT_TOKEN || !env.KOLKATA_REVIEWER_ID) return;
  const fcm = {
    projectId: env.FIREBASE_PROJECT_ID, clientEmail: env.FIREBASE_CLIENT_EMAIL, privateKey: env.FIREBASE_PRIVATE_KEY,
  };
  if (!isFcmConfigured(fcm)) return;
  const prisma = createPrismaClient(env.DATABASE_URL);
  async function tellReviewer(text: string) {
    await kolkataTelegram(env, 'sendMessage', { chat_id: env.KOLKATA_REVIEWER_ID, text }).catch(() => undefined);
  }
  try {
    const pending = await prisma.curatedKolkataEvent.findMany({
      where: { notifyDay: window.day, alertArea: { not: null }, claimedAt: null, reviewedAt: { not: null } },
      take: 3,
    });
    for (const event of pending) {
      if (!isKolkataArea(event.alertArea)) continue;
      const claim = await prisma.curatedKolkataEvent.updateMany({
        where: { id: event.id, claimedAt: null },
        data: { claimedAt: now },
      });
      if (!claim.count) continue;
      try {
        const deadline = new Date(window.day + 'T14:00:00+05:30').getTime();
        const current = event.id.startsWith('spot-') ? event : await readKccEvent(event.sourceUrl);
        if (!current || current.endsAt <= now || current.fingerprint !== event.fingerprint ||
            current.dateLabel !== event.dateLabel || current.priceLabel !== event.priceLabel) {
          await tellReviewer('Skipped ' + event.title + ' because its source changed or expired before sending.');
          continue;
        }
        const remainingSeconds = Math.floor((deadline - Date.now()) / 1000);
        if (remainingSeconds < 1) continue;
        await prisma.curatedKolkataEvent.update({ where: { id: event.id }, data: { publishedAt: now } });
        await sendToTopic(fcm, kolkataTopic(event.alertArea), {
          title: kolkataAreas[event.alertArea] + ' · ' + event.title,
          body: [event.venue, event.dateLabel, event.priceLabel].filter(Boolean).join(' · ').slice(0, 250),
        }, {
          type: 'kolkata_event',
          externalUrl: event.sourceUrl,
          route: '/kolkata-events/' + event.id,
        }, { ttlSeconds: remainingSeconds });
      } catch {
        logger.error('Kolkata lunchtime push could not be confirmed', { id: event.id });
        await tellReviewer('Could not confirm delivery for ' + event.title + '.');
      }
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
