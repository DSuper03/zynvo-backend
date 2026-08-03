import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';
import { sendToDeviceTokens } from '../utils/fcm';
import { sendViaExpo as sendExpoPush } from './expo.service';
import {
  dedupeTokens,
  isExpoToken,
  stringifyData,
} from '../utils/notificationChunks';

// ---------------------------------------------------------------------------
// In-app notification persistence (powers the notification inbox / history)
// ---------------------------------------------------------------------------

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
  input: Omit<NotificationInput, 'userId'> & { userIds?: string[] }
): Promise<void> => {
  try {
    const userIds =
      input.userIds ??
      (await prisma.user.findMany({ select: { id: true } })).map((u) => u.id);
    if (userIds.length === 0) return;

    await prisma.notification.createMany({
      data: userIds.map((u) => ({
        userId: u,
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

// ---------------------------------------------------------------------------
// Push orchestration (single source of truth for ALL notification sends)
// ---------------------------------------------------------------------------

export type PushMessage = {
  title: string;
  body: string;
  imageUrl?: string | null;
  data?: Record<string, unknown> | null;
};

export type ProviderSendResult = {
  successful: number;
  failed: number;
  invalidTokens: string[];
};

export type SendResult = {
  totalTokens: number;
  successful: number;
  failed: number;
  invalidRemoved: number;
};

export type BroadcastResult = {
  success: boolean;
  totalUsers: number;
  totalTokens: number;
  successful: number;
  failed: number;
  invalidRemoved: number;
  durationMs: number;
  providerBreakdown: {
    expo: ProviderSendResult;
    fcm: ProviderSendResult;
  };
};

const emptyProviderResult = (): ProviderSendResult => ({
  successful: 0,
  failed: 0,
  invalidTokens: [],
});

// Push payloads carry plain JSON; the inbox column expects Prisma's InputJsonValue.
const toJsonValue = (data?: Record<string, unknown> | null): Prisma.InputJsonValue | undefined =>
  (data ?? undefined) as Prisma.InputJsonValue | undefined;

/** Send through Firebase Cloud Messaging, chunking handled inside fcm.ts. */
export const sendViaFCM = async (
  tokens: string[],
  message: PushMessage
): Promise<ProviderSendResult> => {
  const baseData = stringifyData(message.data) ?? {};
  const data = message.imageUrl
    ? { ...baseData, imageUrl: message.imageUrl }
    : baseData;

  const result = await sendToDeviceTokens(
    tokens,
    { title: message.title, body: message.body },
    Object.keys(data).length > 0 ? data : undefined,
    { channelId: 'broadcast' }
  );

  return {
    successful: result.successCount,
    failed: result.failureCount,
    invalidTokens: result.invalidTokens,
  };
};

/** Send through the Expo Push API (batched in expo.service.ts). */
export const sendViaExpo = (
  tokens: string[],
  message: PushMessage
): Promise<ProviderSendResult> => sendExpoPush(tokens, message);

type DispatchResult = ProviderSendResult & {
  expo: ProviderSendResult;
  fcm: ProviderSendResult;
};

/**
 * Route a token list to the correct provider (Expo vs FCM), dedupe first,
 * send both in parallel, and merge the per-provider outcomes.
 */
const dispatchTokens = async (
  tokens: string[],
  message: PushMessage
): Promise<DispatchResult> => {
  const distinct = dedupeTokens(tokens);
  const expoTokens = distinct.filter(isExpoToken);
  const fcmTokens = distinct.filter((t) => !isExpoToken(t));

  logger.info('Dispatching push', {
    totalTokens: distinct.length,
    expoTokens: expoTokens.length,
    fcmTokens: fcmTokens.length,
  });

  const [expo, fcm] = await Promise.all([
    expoTokens.length > 0
      ? sendViaExpo(expoTokens, message)
      : Promise.resolve(emptyProviderResult()),
    fcmTokens.length > 0
      ? sendViaFCM(fcmTokens, message)
      : Promise.resolve(emptyProviderResult()),
  ]);

  return {
    successful: expo.successful + fcm.successful,
    failed: expo.failed + fcm.failed,
    invalidTokens: [...expo.invalidTokens, ...fcm.invalidTokens],
    expo,
    fcm,
  };
};

/** Delete tokens the providers reported as stale/unregistered. */
const pruneInvalidTokens = async (tokens: string[]): Promise<number> => {
  if (tokens.length === 0) return 0;
  try {
    const { count } = await prisma.deviceToken.deleteMany({
      where: { token: { in: tokens } },
    });
    if (count > 0) logger.info('Pruned invalid device tokens', { removed: count });
    return count;
  } catch (error: any) {
    logger.error('Failed to prune invalid device tokens', { error: error.message });
    return 0;
  }
};

/**
 * Send a push to one user's registered devices and persist it in their inbox.
 * Future per-user notifications (likes, comments, club invites, ...) reuse this.
 */
export const sendToUser = async (input: {
  userId: string;
  type?: string;
  message: PushMessage;
}): Promise<SendResult> => {
  const devices = await prisma.deviceToken.findMany({
    where: { userId: input.userId },
    select: { token: true },
  });

  const tokens = dedupeTokens(devices.map((d) => d.token));
  const dispatch = await dispatchTokens(tokens, input.message);
  const invalidRemoved = await pruneInvalidTokens(dispatch.invalidTokens);

  void createNotification({
    userId: input.userId,
    type: input.type ?? 'direct',
    title: input.message.title,
    body: input.message.body,
    data: toJsonValue(input.message.data),
  });

  return {
    totalTokens: tokens.length,
    successful: dispatch.successful,
    failed: dispatch.failed,
    invalidRemoved,
  };
};

/**
 * Send a push to many users' devices and persist one inbox row per user.
 * Fetching tokens for all targets is a single query (no N+1).
 */
export const sendToMany = async (input: {
  userIds: string[];
  type?: string;
  message: PushMessage;
}): Promise<SendResult> => {
  if (input.userIds.length === 0) {
    return { totalTokens: 0, successful: 0, failed: 0, invalidRemoved: 0 };
  }

  const devices = await prisma.deviceToken.findMany({
    where: { userId: { in: input.userIds } },
    select: { token: true },
  });

  const tokens = dedupeTokens(devices.map((d) => d.token));
  const dispatch = await dispatchTokens(tokens, input.message);
  const invalidRemoved = await pruneInvalidTokens(dispatch.invalidTokens);

  try {
    await prisma.notification.createMany({
      data: input.userIds.map((userId) => ({
        userId,
        type: input.type ?? 'direct',
        title: input.message.title,
        body: input.message.body,
        data: toJsonValue(input.message.data),
      })),
    });
  } catch (error: any) {
    logger.error('Failed to persist notifications for sendToMany', {
      error: error.message,
    });
  }

  return {
    totalTokens: tokens.length,
    successful: dispatch.successful,
    failed: dispatch.failed,
    invalidRemoved,
  };
};

/**
 * Broadcast a push to every registered device and persist an inbox row for
 * every user. Returns delivery statistics. Never throws for per-token errors —
 * failures are collected and stale tokens are pruned.
 */
export const broadcast = async (message: PushMessage): Promise<BroadcastResult> => {
  const startedAt = Date.now();
  logger.info('Broadcast started', { title: message.title });

  // Two single queries cover everything: tokens (+ their owners) and all users.
  const [tokens, users] = await Promise.all([
    prisma.deviceToken.findMany({ select: { token: true, userId: true } }),
    prisma.user.findMany({ select: { id: true } }),
  ]);

  const distinctTokens = dedupeTokens(tokens.map((t) => t.token));
  const totalUsers = new Set(tokens.map((t) => t.userId)).size;
  const totalTokens = distinctTokens.length;

  const dispatch = await dispatchTokens(distinctTokens, message);
  const invalidRemoved = await pruneInvalidTokens(dispatch.invalidTokens);

  // Persist an in-app notification for every user (best-effort, non-blocking)
  // so the broadcast also shows up in the notification inbox.
  void createBroadcastNotification({
    type: 'broadcast',
    title: message.title,
    body: message.body,
    data: toJsonValue(message.data),
    userIds: users.map((u) => u.id),
  }).catch((error: any) => {
    logger.error('Failed to persist broadcast inbox notifications', {
      error: error.message,
    });
  });

  const durationMs = Date.now() - startedAt;
  logger.info('Broadcast completed', {
    totalTokens,
    successful: dispatch.successful,
    failed: dispatch.failed,
    invalidRemoved,
    durationMs,
  });

  return {
    success: true,
    totalUsers,
    totalTokens,
    successful: dispatch.successful,
    failed: dispatch.failed,
    invalidRemoved,
    durationMs,
    providerBreakdown: {
      expo: dispatch.expo,
      fcm: dispatch.fcm,
    },
  };
};
