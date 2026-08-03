import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

export type NotificationInput = {
  userId: string;
  type: string;
  title: string;
  body: string;
  data?: Prisma.InputJsonValue | null;
};

// Persist one in-app notification. Never throws — failures are logged so the
// surrounding flow (e.g. sending a wave) is not affected.
export const createNotification = async (input: NotificationInput): Promise<void> => {
  try {
    await prisma.notification.create({
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

// Persist an in-app notification for every user. Used for the new-post
// broadcast so the whole community sees it in their inbox.
export const createBroadcastNotification = async (
  input: Omit<NotificationInput, 'userId'>
): Promise<void> => {
  try {
    const userIds = await prisma.user.findMany({ select: { id: true } });
    if (userIds.length === 0) return;

    await prisma.notification.createMany({
      data: userIds.map((u) => ({
        userId: u.id,
        type: input.type,
        title: input.title,
        body: input.body,
        data: input.data ?? undefined,
      })),
    });
  } catch (error: any) {
    logger.error('Failed to persist broadcast notification', {
      error: error.message,
      type: input.type,
    });
  }
};
