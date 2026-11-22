import { createPrismaClient } from './db';
import type { CFEnv } from './types';
import type { FcmConfig } from './fcm';
import { isFcmConfigured, sendToTopic } from './fcm';
import { logger } from './logger';
import { appUpdateCopy, parseExpoManifest, shouldAnnounceAppUpdate, type LiveAppUpdate } from './app-update-policy';

const UPDATE_URL = 'https://u.expo.dev/eea89837-7373-4009-8103-74a513cfa853';
const CHANNEL = 'production';
const RUNTIME = '1.0.4';
const PAGE = 400;

async function fetchLiveUpdate(env: CFEnv): Promise<LiveAppUpdate | null> {
  const url = env.EXPO_UPDATES_URL || UPDATE_URL;
  const channel = env.EXPO_UPDATE_CHANNEL || CHANNEL;
  const runtime = env.EXPO_RUNTIME_VERSION || RUNTIME;
  for (const platform of ['android', 'ios']) {
    const res = await fetch(url, {
      headers: {
        accept: 'multipart/mixed,application/expo+json,application/json',
        'expo-protocol-version': '1',
        'expo-platform': platform,
        'expo-runtime-version': runtime,
        'expo-channel-name': channel,
        'expo-current-update-id': '00000000-0000-0000-0000-000000000000',
      },
    });
    if (res.status === 204) continue;
    if (!res.ok) {
      logger.warn('App update check failed', { status: res.status, platform });
      continue;
    }
    const update = parseExpoManifest(await res.text());
    if (update) return update;
  }
  return null;
}

async function writeInbox(prisma: any, update: LiveAppUpdate, copy: { title: string; body: string }) {
  const data = { updateId: update.id, ...(update.version ? { version: update.version } : {}) };
  let cursor: string | undefined;
  for (;;) {
    const users = await prisma.user.findMany({
      select: { id: true },
      take: PAGE,
      orderBy: { id: 'asc' },
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    if (users.length === 0) return;
    await prisma.notification.createMany({
      data: users.map((user: { id: string }) => ({
        userId: user.id,
        type: 'app_update',
        title: copy.title,
        body: copy.body,
        data,
      })),
    });
    cursor = users[users.length - 1].id;
    if (users.length < PAGE) return;
  }
}

/** When a production app update is published, tell every user once. */
export async function announceLiveAppUpdate(env: CFEnv): Promise<void> {
  if (!env.ALERTS_KV) {
    logger.error('App update check skipped, ALERTS_KV is missing');
    return;
  }
  const channel = env.EXPO_UPDATE_CHANNEL || CHANNEL;
  const key = `app-update:${channel}`;
  const update = await fetchLiveUpdate(env);
  const previousId = await env.ALERTS_KV.get(key);
  if (!update) return;
  if (!shouldAnnounceAppUpdate(previousId, update)) {
    if (previousId !== update.id) await env.ALERTS_KV.put(key, update.id);
    return;
  }

  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const already = await prisma.notification.findFirst({
      where: { type: 'app_update', data: { path: ['updateId'], equals: update.id } },
      select: { id: true },
    });
    if (already) {
      await env.ALERTS_KV.put(key, update.id);
      return;
    }
    const copy = appUpdateCopy(update);
    await writeInbox(prisma, update, copy);
    const fcm: FcmConfig = {
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: env.FIREBASE_PRIVATE_KEY,
    };
    if (isFcmConfigured(fcm)) {
      await sendToTopic(fcm, 'all_users', copy, { type: 'app_update', updateId: update.id });
    }
    await env.ALERTS_KV.put(key, update.id);
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
