import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getMessaging, type Message } from 'firebase-admin/messaging';
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

export const notifyAllUsersNewPost = async (input: NewPostNotificationInput): Promise<void> => {
  if (!initFcm()) {
    logger.warn('Skipping new-post push — FCM not configured');
    return;
  }

  const bodyPreview =
    input.description.length > 100
      ? `${input.description.slice(0, 97)}...`
      : input.description;

  const authorLabel = input.authorName?.trim() || 'Someone';

  const message: Message = {
    topic: ALL_USERS_TOPIC,
    notification: {
      title: `${authorLabel} posted something new`,
      body: input.title || bodyPreview,
    },
    data: {
      type: 'new_post',
      postId: input.postId,
      title: input.title,
      description: bodyPreview,
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

export { ALL_USERS_TOPIC };
