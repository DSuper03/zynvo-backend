import { createPrismaClient } from './db';
import { isFcmConfigured, sendToTopic } from './fcm';
import type { CFEnv } from './types';

export async function announcePlayRelease(env: CFEnv, versionCode: number, versionName: string) {
  const kv = env.ALERTS_KV;
  const fcm = {
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY,
  };
  if (!kv || !isFcmConfigured(fcm)) throw new Error('Release notification delivery is not configured');
  const key = `play-release:${versionCode}`;
  if (await kv.get(key)) return false;

  const type = 'play_store_update';
  const copy = {
    title: 'ZynvoSocial update available',
    body: `Version ${versionName} is rolling out on Google Play. Open Google Play to check for the update.`,
  };
  const data = { versionCode: String(versionCode), versionName };
  const prisma = createPrismaClient(env.DATABASE_URL);
  try {
    const pageSize = 400;
    let cursor: string | undefined;
    for (;;) {
      const users: { id: string }[] = await prisma.user.findMany({
        select: { id: true },
        take: pageSize,
        orderBy: { id: 'asc' },
        ...(cursor ? { where: { id: { gt: cursor } } } : {}),
      });
      if (!users.length) break;
      await prisma.notification.createMany({
        skipDuplicates: true,
        data: users.map(({ id: userId }) => ({
          id: `${key}:${userId}`,
          userId,
          type,
          ...copy,
          data,
        })),
      });
      if (users.length < pageSize) break;
      cursor = users[users.length - 1].id;
    }
    await sendToTopic(fcm, 'all_users', copy, { type, ...data });
    await kv.put(key, 'sent');
    return true;
  } finally {
    await prisma.$disconnect().catch(() => {});
  }
}
