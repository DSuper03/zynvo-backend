import { Request, Response } from 'express';
import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { generateRequestId, sendErrorResponse } from '../utils/helper';
import {
  isFcmConfigured,
  subscribeToAllUsers,
  unsubscribeFromAllUsers,
  notifyAllUsersNewPost,
} from '../utils/fcm';

export const registerDeviceToken = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;
  const { token, platform } = req.body as { token?: string; platform?: string };

  if (!token || typeof token !== 'string') {
    sendErrorResponse(res, requestId, 'token is required', 400);
    return;
  }

  const normalizedPlatform =
    typeof platform === 'string' ? platform.toLowerCase().trim() : undefined;

  if (normalizedPlatform && !['android', 'ios', 'web'].includes(normalizedPlatform)) {
    sendErrorResponse(res, requestId, 'platform must be android, ios, or web', 400);
    return;
  }

  try {
    const device = await prisma.deviceToken.upsert({
      where: { token },
      create: {
        token,
        userId,
        platform: normalizedPlatform,
      },
      update: {
        userId,
        platform: normalizedPlatform,
      },
      select: { id: true, token: true, platform: true },
    });

    try {
      await subscribeToAllUsers(token);
    } catch (error: any) {
      logger.warn(`[${requestId}] Failed to subscribe token to all_users topic`, {
        error: error.message,
        userId,
      });
    }

    res.status(200).json({
      msg: 'device registered for notifications',
      device,
      fcmConfigured: isFcmConfigured(),
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error registering device token`, {
      error: error.message,
      userId,
    });
    sendErrorResponse(res, requestId, 'error registering device token', 500);
  }
};

export const unregisterDeviceToken = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;
  const { token } = req.body as { token?: string };

  if (!token || typeof token !== 'string') {
    sendErrorResponse(res, requestId, 'token is required', 400);
    return;
  }

  try {
    const existing = await prisma.deviceToken.findUnique({
      where: { token },
      select: { id: true, userId: true },
    });

    if (!existing || existing.userId !== userId) {
      sendErrorResponse(res, requestId, 'device token not found', 404);
      return;
    }

    await prisma.deviceToken.delete({ where: { token } });

    try {
      await unsubscribeFromAllUsers(token);
    } catch (error: any) {
      logger.warn(`[${requestId}] Failed to unsubscribe token from all_users topic`, {
        error: error.message,
        userId,
      });
    }

    res.status(200).json({ msg: 'device unregistered from notifications' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error unregistering device token`, {
      error: error.message,
      userId,
    });
    sendErrorResponse(res, requestId, 'error unregistering device token', 500);
  }
};

export const testPushNotification = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();

  if (!isFcmConfigured()) {
    sendErrorResponse(
      res,
      requestId,
      'FCM not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY',
      503
    );
    return;
  }

  try {
    await notifyAllUsersNewPost({
      postId: 'test',
      title: req.body?.title || 'Test notification',
      description: req.body?.description || 'If you see this, FCM is working.',
      authorName: 'Zynvo',
    });

    res.status(200).json({ msg: 'test notification sent to all_users topic' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error sending test push`, { error: error.message });
    sendErrorResponse(res, requestId, 'error sending test notification', 500, error);
  }
};

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string, 10) || 20));
  const skip = (page - 1) * limit;

  logger.info(`[${requestId}] GET /notifications - fetching inbox`, {
    userId,
    page,
    limit,
  });

  try {
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);

    res.status(200).json({
      msg: 'notifications fetched',
      notifications,
      unreadCount,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching notifications`, {
      error: error.message,
      userId,
    });
    sendErrorResponse(res, requestId, 'error fetching notifications', 500, error);
  }
};

export const markNotificationRead = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;
  const { id } = req.body as { id?: string };

  if (!id || typeof id !== 'string') {
    sendErrorResponse(res, requestId, 'notification id is required', 400);
    return;
  }

  try {
    const result = await prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });

    if (result.count === 0) {
      sendErrorResponse(res, requestId, 'notification not found', 404);
      return;
    }

    res.status(200).json({ msg: 'notification marked as read' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error marking notification as read`, {
      error: error.message,
      userId,
    });
    sendErrorResponse(res, requestId, 'error marking notification as read', 500, error);
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;

  try {
    const result = await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });

    res.status(200).json({
      msg: 'all notifications marked as read',
      updated: result.count,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error marking all notifications as read`, {
      error: error.message,
      userId,
    });
    sendErrorResponse(res, requestId, 'error marking notifications as read', 500, error);
  }
};
