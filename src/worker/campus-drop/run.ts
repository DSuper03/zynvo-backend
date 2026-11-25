import { createPrismaClient } from '../db';
import type { CFEnv } from '../types';
import { isFcmConfigured, sendToTopic, subscribeTokensToTopic, type FcmConfig } from '../fcm';
import { logger } from '../logger';
import { dropWindowAt } from './policy';
import { BACKFILL_KEY, DROP_TOPIC, backfillDropTopic, campusDropTick, dropKvKey } from './tick';

/** True when KV says today's drop is sent or not due yet, and the backfill is done. */
async function nothingToDo(kv: KVNamespace, day: string, now: Date): Promise<boolean> {
  const [plan, backfill] = await Promise.all([kv.get(dropKvKey(day)), kv.get(BACKFILL_KEY)]);
  if (backfill !== 'done' || !plan) return false;
  return plan === 'sent' || now.getTime() < Date.parse(plan);
}

/** Every-minute cron entry. Does nothing unless CAMPUS_DROP_ENABLED is 'true'. */
export async function runCampusDrop(env: CFEnv, now = new Date()): Promise<void> {
  if (env.CAMPUS_DROP_ENABLED !== 'true') return;
  // Quiet hours (01:00-07:00 IST): no database, no push.
  const window = dropWindowAt(now);
  if (!window) return;

  const fcm: FcmConfig = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  };
  if (!isFcmConfigured(fcm)) {
    logger.error('Campus Drop skipped, FCM is not configured');
    return;
  }

  // Skip the database entirely when KV already says we're waiting or done.
  const kv = env.ALERTS_KV ?? null;
  if (kv && (await nothingToDo(kv, window.day, now))) return;

  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const result = await campusDropTick({
      prisma,
      kv,
      now,
      send: (notification, data) => sendToTopic(fcm, DROP_TOPIC, notification, data),
    });
    if (result === 'sent' || result === 'planned') logger.info(`Campus Drop ${result}`);

    if (kv) {
      const added = await backfillDropTopic({
        prisma,
        kv,
        subscribe: (tokens) => subscribeTokensToTopic(fcm, tokens, DROP_TOPIC),
      });
      if (added) logger.info('Campus Drop topic backfill', { added });
    }
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
