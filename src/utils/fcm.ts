import { cert, getApps, initializeApp } from 'firebase-admin/app';
import {
  getMessaging,
  type Message,
  type MulticastMessage,
} from 'firebase-admin/messaging';
import { logger } from './logger';

const ALL_USERS_TOPIC = 'all_users';

let initialized = false;

const getPrivateKey = (): string | undefined => {
  const key = process.env.FIREBASE_PRIVATE_KEY;
  if (!key) return undefined;
  // Supports keys pasted with literal \n or real newlines
  return key.replace(/\\n/g, '\n');
};

export const isFcmConfigured = (): boolean => {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
};

export const initFcm = (): boolean => {
  if (initialized) return true;

  if (!isFcmConfigured()) {
    logger.warn('FCM not configured — set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    return false;
  }

  try {
    if (getApps().length === 0) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: getPrivateKey(),
        }),
      });
    }
    initialized = true;
    logger.info('Firebase Admin initialized for FCM');
    return true;
  } catch (error: any) {
    logger.error('Failed to initialize Firebase Admin', { error: error.message });
    return false;
  }
};

export const subscribeToAllUsers = async (token: string): Promise<void> => {
  if (!initFcm()) return;
  await getMessaging().subscribeToTopic(token, ALL_USERS_TOPIC);
};

export const unsubscribeFromAllUsers = async (token: string): Promise<void> => {
  if (!initFcm()) return;
  await getMessaging().unsubscribeFromTopic(token, ALL_USERS_TOPIC);
};

type NewPostNotificationInput = {
  postId: string;
  title: string;
  description: string;
  authorName?: string | null;
  image?: string | null;
};

// Single source of truth for the new-post notification copy, shared by the
// FCM push and the in-app notification that gets persisted to the DB.
export const buildNewPostNotification = (
  input: NewPostNotificationInput
): { title: string; body: string } => {
  const bodyPreview =
    input.description.length > 100
      ? `${input.description.slice(0, 97)}...`
      : input.description;

  const authorLabel = input.authorName?.trim() || 'Someone';

  return {
    title: `${authorLabel} posted something new`,
    body: input.title || bodyPreview,
  };
};

export const notifyAllUsersNewPost = async (input: NewPostNotificationInput): Promise<void> => {
  if (!initFcm()) {
    logger.warn('Skipping new-post push — FCM not configured');
    return;
  }

  const { title, body } = buildNewPostNotification(input);

  const message: Message = {
    topic: ALL_USERS_TOPIC,
    notification: {
      title,
      body,
    },
    data: {
      type: 'new_post',
      postId: input.postId,
      title: input.title,
      description: body,
      ...(input.image ? { image: input.image } : {}),
    },
    android: {
      priority: 'high',
      notification: {
        channelId: 'new_posts',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  const messageId = await getMessaging().send(message);
  logger.info('New-post FCM broadcast sent', { messageId, postId: input.postId });
};

/**
 * A per-device push outcome. `invalidTokens` are registration tokens FCM
 * rejected as no-longer-registered — callers should prune them from the DB.
 */
export type DeviceTokenPushResult = {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
};

// Error codes FCM returns for registration tokens that are stale or malformed.
const INVALID_TOKEN_ERROR_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

const isInvalidTokenError = (error?: { code?: string }): boolean =>
  Boolean(error?.code && INVALID_TOKEN_ERROR_CODES.has(error.code));

/**
 * Send a push notification to a list of device tokens via FCM multicast.
 *
 * - Tokens are chunked (FCM allows max 500 per request).
 * - A single bad token never aborts the batch: failures are reported per token.
 * - Returns which tokens FCM considers unregistered so the caller can clean up.
 */
export const sendToDeviceTokens = async (
  tokens: string[],
  notification: { title: string; body: string },
  data?: Record<string, string>
): Promise<DeviceTokenPushResult> => {
  const empty: DeviceTokenPushResult = {
    successCount: 0,
    failureCount: 0,
    invalidTokens: [],
  };

  if (tokens.length === 0) return empty;

  if (!initFcm()) {
    logger.warn('Skipping device-token push — FCM not configured');
    return { ...empty, failureCount: tokens.length };
  }

  const result: DeviceTokenPushResult = { ...empty };
  const CHUNK_SIZE = 500;

  const baseMessage: Omit<MulticastMessage, 'tokens'> = {
    notification,
    ...(data ? { data } : {}),
    android: {
      priority: 'high',
      notification: {
        channelId: 'waves',
        sound: 'default',
      },
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
        },
      },
    },
  };

  for (let i = 0; i < tokens.length; i += CHUNK_SIZE) {
    const chunk = tokens.slice(i, i + CHUNK_SIZE);

    try {
      const response = await getMessaging().sendEachForMulticast({
        ...baseMessage,
        tokens: chunk,
      });

      result.successCount += response.successCount;
      result.failureCount += response.failureCount;

      response.responses.forEach((r, index) => {
        const token = chunk[index];
        if (!r.success && token && isInvalidTokenError(r.error)) {
          result.invalidTokens.push(token);
        }
      });
    } catch (error: any) {
      // The whole chunk was rejected (e.g. every token is stale) — count each
      // token as failed but keep going so remaining chunks still get delivered.
      logger.warn('FCM multicast chunk rejected', {
        error: error.message,
        chunkSize: chunk.length,
      });
      result.failureCount += chunk.length;
    }
  }

  return result;
};

export { ALL_USERS_TOPIC };
