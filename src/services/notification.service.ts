/**
 * notification.service.ts
 *
 * Minimal notification persistence layer.
 * Stores in-app notifications in the Notification table and (optionally) sends
 * push notifications via FCM device tokens.
 *
 * NOTE: Push delivery (sendToDeviceTokens) is a best-effort fire-and-forget.
 * A failure to push never rejects the promise — the inbox row is always written.
 */

import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import {
  buildNewPostNotification,
  isFcmConfigured,
  sendToDeviceTokens,
} from '../utils/fcm';

// ── Types ─────────────────────────────────────────────────────

export type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  /** Also deliver to the user's registered device tokens (best-effort). */
  push?: boolean;
};

// FCM's Android channel must exist on the device or the push is dropped.
// The app creates exactly one: `new_posts` ("Zynvo Notifications").
const ANDROID_CHANNEL_ID = 'new_posts';

// ── pushToUser ────────────────────────────────────────────────
// Best-effort device push for one recipient. Never throws.

const pushToUser = async (input: NotificationInput): Promise<void> => {
  try {
    if (!isFcmConfigured()) return;

    const rows = await (prisma as any).deviceToken.findMany({
      where: { userId: input.userId },
      select: { token: true },
    });
    const tokens: string[] = Array.from(
      new Set<string>(rows.map((row: any) => String(row.token)))
    );
    if (tokens.length === 0) return;

    const data: Record<string, string> = { type: input.type };
    for (const [key, value] of Object.entries(input.data ?? {})) {
      if (value === null || value === undefined) continue;
      data[key] = typeof value === 'string' ? value : JSON.stringify(value);
    }

    const result = await sendToDeviceTokens(
      tokens,
      { title: input.title, body: input.body },
      data,
      { channelId: ANDROID_CHANNEL_ID }
    );

    // Prune tokens FCM flagged as unregistered so later pushes don't retry them.
    if (result.invalidTokens.length > 0) {
      await (prisma as any).deviceToken.deleteMany({
        where: { token: { in: result.invalidTokens }, userId: input.userId },
      });
      logger.info('Removed stale FCM tokens after notification push', {
        userId: input.userId,
        removed: result.invalidTokens.length,
      });
    }
  } catch (error: any) {
    logger.error('Failed to push notification', {
      error: error.message,
      userId: input.userId,
      type: input.type,
    });
  }
};

// ── createNotification ────────────────────────────────────────
// Persist a single in-app notification. Never throws.

export const createNotification = async (input: NotificationInput): Promise<void> => {
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

    if (input.push) {
      void pushToUser(input);
    }
  } catch (error: any) {
    logger.error('Failed to persist notification', {
      error: error.message,
      userId: input.userId,
      type: input.type,
    });
  }
};

// ── sendToMany ────────────────────────────────────────────────
// Persist an in-app notification for multiple users at once.
// Intended for mention notifications, broadcast events, etc.

export const sendToMany = async (input: {
  userIds: string[];
  type?: string;
  message: { title: string; body: string; data?: Record<string, unknown> | null };
  /** Also deliver to each recipient's registered device tokens (best-effort). */
  push?: boolean;
}): Promise<void> => {
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
  } catch (error: any) {
    logger.error('Failed to persist batch notifications (sendToMany)', {
      error: error.message,
      type: input.type,
      count: input.userIds.length,
    });
  }

  if (input.push) {
    for (const userId of input.userIds) {
      void pushToUser({
        userId,
        type: input.type ?? 'direct',
        title: input.message.title,
        body: input.message.body,
        data: input.message.data ?? null,
      });
    }
  }
};

// ── notifyFollowersOfNewPost ──────────────────────────────────
// In-app rows + device push for the author's followers — the same audience the
// follow feed shows, so "new post" lands where the post actually appears.

export const notifyFollowersOfNewPost = async (input: {
  authorId: string;
  postId: string;
  title: string;
  description: string;
  authorName?: string | null;
  image?: string | null;
}): Promise<void> => {
  try {
    const follows = await (prisma as any).follow.findMany({
      where: { followingId: input.authorId },
      select: { followerId: true },
    });

    const userIds: string[] = Array.from(
      new Set<string>(follows.map((row: any) => String(row.followerId)))
    ).filter((id) => id !== input.authorId);

    if (userIds.length === 0) return;

    const { title, body } = buildNewPostNotification({
      postId: input.postId,
      title: input.title,
      description: input.description,
      authorName: input.authorName,
      image: input.image,
    });

    await sendToMany({
      userIds,
      type: 'new_post',
      message: {
        title,
        body,
        data: {
          postId: input.postId,
          route: `/post/${input.postId}`,
          ...(input.image ? { image: input.image } : {}),
        },
      },
      push: true,
    });
  } catch (error: any) {
    logger.error('Failed to notify followers of new post', {
      error: error.message,
      postId: input.postId,
      authorId: input.authorId,
    });
  }
};

// ── broadcast ────────────────────────────────────────────────────
// Send a broadcast notification to all users (admin feature)

export const broadcast = async (input: {
  title: string;
  body: string;
  imageUrl?: string | null;
  data?: Record<string, unknown> | null;
}): Promise<{ success: boolean; message: string }> => {
  try {
    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true },
    });

    // Create notifications for all users
    await (prisma as any).notification.createMany({
      data: users.map((user: { id: string }) => ({
        userId: user.id,
        type: 'broadcast',
        title: input.title,
        body: input.body,
        data: input.data ?? undefined,
      })),
    });

    return { success: true, message: 'Broadcast sent successfully' };
  } catch (error: any) {
    logger.error('Failed to send broadcast notification', {
      error: error.message,
    });
    throw error;
  }
};
