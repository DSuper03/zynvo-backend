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

// ── Types ─────────────────────────────────────────────────────

export type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
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
