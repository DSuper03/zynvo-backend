import { createPrismaClient } from './db';
import { ALL_USERS_TOPIC, isFcmConfigured, subscribeTokensToTopic } from './fcm';
import type { CFEnv } from './types';

const CURSOR_KEY = 'push:all-users-topic-backfill';
const PAGE_SIZE = 1000;

/** Repair topic subscriptions for devices registered while FCM was unavailable. */
export async function backfillAllUsersTopic(env: CFEnv): Promise<void> {
  const fcm = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  };
  const kv = env.ALERTS_KV;
  if (!kv || !isFcmConfigured(fcm)) return;
  const cursor = await kv.get(CURSOR_KEY);
  if (cursor === 'done') return;

  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const devices = await prisma.deviceToken.findMany({
      where: {
        OR: [{ platform: 'android' }, { platform: null }],
        ...(cursor ? { id: { gt: cursor } } : {}),
      },
      select: { id: true, token: true },
      orderBy: { id: 'asc' },
      take: PAGE_SIZE,
    });
    await subscribeTokensToTopic(fcm, devices.map(({ token }) => token), ALL_USERS_TOPIC);
    await kv.put(CURSOR_KEY, devices.length === PAGE_SIZE ? devices[devices.length - 1].id : 'done');
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
