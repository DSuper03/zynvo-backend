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
