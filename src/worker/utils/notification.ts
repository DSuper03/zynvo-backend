/**
 * Worker-safe notification helpers — replaces notification.service.ts
 * No firebase-admin, no ioredis. Uses fetch-based FCM REST client.
 */

import type { AppPrismaClient } from '../db';
import type { FcmConfig } from '../fcm';
import { isFcmConfigured, sendToDeviceTokens } from '../fcm';
import { logger } from '../logger';

const ANDROID_CHANNEL = 'new_posts';

export type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  push?: boolean;
};

// ── pushToUser ────────────────────────────────────────────────

async function pushToUser(
  prisma: AppPrismaClient,
  fcmCfg: FcmConfig,
  input: NotificationInput,
): Promise<void> {
  try {
    if (!isFcmConfigured(fcmCfg)) return;

    const rows = await (prisma as any).deviceToken.findMany({
      where: { userId: input.userId },
      select: { token: true },
    });
    const tokens: string[] = [...new Set<string>(rows.map((r: any) => String(r.token)))];
    if (tokens.length === 0) return;

    const strData: Record<string, string> = { type: input.type };
    for (const [k, v] of Object.entries(input.data ?? {})) {
      if (v != null) strData[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }

    const result = await sendToDeviceTokens(
      fcmCfg,
      tokens,
      { title: input.title, body: input.body },
      strData,
      { channelId: ANDROID_CHANNEL },
    );

    if (result.invalidTokens.length > 0) {
      await (prisma as any).deviceToken.deleteMany({
        where: { token: { in: result.invalidTokens }, userId: input.userId },
      });
    }
  } catch (err: any) {
    logger.error('pushToUser failed', { error: err.message, userId: input.userId });
  }
}

// ── createNotification ────────────────────────────────────────

export async function createNotification(
  prisma: AppPrismaClient,
  fcmCfg: FcmConfig,
  input: NotificationInput,
): Promise<void> {
  try {
    await (prisma as any).notification.create({
      data: {
        userId: input.userId,
        type: input.type,
        title: input.title,
        body: input.body,
        data: input.data ?? undefined,
      },
    });
    if (input.push) void pushToUser(prisma, fcmCfg, input);
  } catch (err: any) {
    logger.error('createNotification failed', { error: err.message, userId: input.userId });
  }
}

// ── sendToMany ────────────────────────────────────────────────

export async function sendToMany(
  prisma: AppPrismaClient,
  fcmCfg: FcmConfig,
  input: {
    userIds: string[];
    type?: string;
    message: { title: string; body: string; data?: Record<string, unknown> | null };
    push?: boolean;
  },
): Promise<void> {
  if (input.userIds.length === 0) return;
  try {
    await (prisma as any).notification.createMany({
      data: input.userIds.map((userId) => ({
        userId,
        type: input.type ?? 'direct',
        title: input.message.title,
        body: input.message.body,
        data: input.message.data ?? undefined,
      })),
    });
  } catch (err: any) {
    logger.error('sendToMany persist failed', { error: err.message });
  }
  if (input.push) {
    for (const userId of input.userIds) {
      void pushToUser(prisma, fcmCfg, {
        userId,
        type: input.type ?? 'direct',
        title: input.message.title,
        body: input.message.body,
        data: input.message.data ?? null,
      });
    }
  }
}

// ── notifyFollowersOfNewPost ──────────────────────────────────

export async function notifyFollowersOfNewPost(
  prisma: AppPrismaClient,
  fcmCfg: FcmConfig,
  input: {
    authorId: string;
    postId: string;
    title: string;
    description: string;
    authorName?: string | null;
    image?: string | null;
  },
): Promise<void> {
  try {
    const follows = await (prisma as any).follow.findMany({
      where: { followingId: input.authorId },
      select: { followerId: true },
    });
    const userIds: string[] = [...new Set<string>(
      follows.map((r: any) => String(r.followerId)),
    )].filter((id) => id !== input.authorId);

    if (userIds.length === 0) return;

    const authorLabel = input.authorName?.trim() || 'Someone';
    const bodyPreview =
      input.description.length > 100
        ? `${input.description.slice(0, 97)}...`
        : input.description;

    await sendToMany(prisma, fcmCfg, {
      userIds,
      type: 'new_post',
      message: {
        title: `${authorLabel} posted something new`,
        body: input.title || bodyPreview,
        data: {
          postId: input.postId,
          route: `/post/${input.postId}`,
          ...(input.image ? { image: input.image } : {}),
        },
      },
      push: true,
    });
  } catch (err: any) {
    logger.error('notifyFollowersOfNewPost failed', { error: err.message });
  }
}

// ── broadcast ─────────────────────────────────────────────────

export async function broadcast(
  prisma: AppPrismaClient,
  input: { title: string; body: string; data?: Record<string, unknown> | null },
): Promise<{ success: boolean; message: string }> {
  const users = await prisma.user.findMany({ select: { id: true } });
  await (prisma as any).notification.createMany({
    data: users.map((u: { id: string }) => ({
      userId: u.id,
      type: 'broadcast',
      title: input.title,
      body: input.body,
      data: input.data ?? undefined,
    })),
  });
  return { success: true, message: 'Broadcast sent successfully' };
}
