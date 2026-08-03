import { logger } from '../utils/logger';
import {
  mapWithConcurrency,
  splitIntoChunks,
  stringifyData,
} from '../utils/notificationChunks';

/**
 * Expo Push sender.
 *
 * Talks to the Expo push HTTP API (https://exp.host/--/api/v2/push/send)
 * directly instead of depending on `expo-server-sdk`, keeping the dependency
 * tree small. Implements the same constraints Expo recommends:
 *
 * - max 100 messages per HTTP request,
 * - a failed ticket never aborts the batch,
 * - tokens that are no longer registered are reported so the DB can prune them.
 */

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
const EXPO_BATCH_SIZE = 100;
const EXPO_SEND_CONCURRENCY = 5;

export type ExpoPushMessage = {
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

type ExpoTicket = {
  status?: 'ok' | 'error';
  message?: string;
  details?: { error?: string };
};

type ExpoResponse = {
  data?: ExpoTicket[];
  errors?: Array<{ code?: string; message?: string }>;
};

// Per-ticket error codes that mean the token can no longer receive pushes.
const INVALID_TICKET_ERRORS = new Set([
  'DeviceNotRegistered',
  'InvalidCredentials',
  'InvalidReceipt',
  'MessageTooBig',
]);

const emptyResult = (): ProviderSendResult => ({
  successful: 0,
  failed: 0,
  invalidTokens: [],
});

/**
 * Send a push to many Expo tokens, chunked into batches of 100 with bounded
 * concurrency. A failing batch is counted and skipped — the remaining batches
 * still go out.
 */
export const sendViaExpo = async (
  tokens: string[],
  message: ExpoPushMessage
): Promise<ProviderSendResult> => {
  if (tokens.length === 0) return emptyResult();

  const chunks = splitIntoChunks(tokens, EXPO_BATCH_SIZE);
  logger.info('Expo push starting', {
    totalTokens: tokens.length,
    batches: chunks.length,
  });

  const perBatch = await mapWithConcurrency(
    chunks,
    EXPO_SEND_CONCURRENCY,
    async (chunk, batchIndex) => {
      logger.info('Expo batch sending', {
        batch: batchIndex + 1,
        batchSize: chunk.length,
        totalBatches: chunks.length,
      });
      return sendExpoBatch(chunk, message);
    }
  );

  return perBatch.reduce<ProviderSendResult>(
    (acc, batch) => ({
      successful: acc.successful + batch.successful,
      failed: acc.failed + batch.failed,
      invalidTokens: [...acc.invalidTokens, ...batch.invalidTokens],
    }),
    emptyResult()
  );
};

const sendExpoBatch = async (
  tokens: string[],
  message: ExpoPushMessage
): Promise<ProviderSendResult> => {
  const baseData = stringifyData(message.data) ?? {};
  const data = message.imageUrl
    ? { ...baseData, imageUrl: message.imageUrl }
    : baseData;

  const payload = tokens.map((to) => ({
    to,
    title: message.title,
    body: message.body,
    sound: 'default',
    channelId: 'broadcast',
    ...(Object.keys(data).length > 0 ? { data } : {}),
  }));

  try {
    const res = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      // Whole request rejected (rate limit, bad credentials, ...) — count every
      // token as failed and move on; the caller keeps sending other batches.
      logger.warn('Expo push request rejected', {
        status: res.status,
        statusText: res.statusText,
        batchSize: tokens.length,
      });
      return { ...emptyResult(), failed: tokens.length };
    }

    const json = (await res.json()) as ExpoResponse;

    if (json.errors && json.errors.length > 0) {
      logger.warn('Expo push request-level errors', { errors: json.errors });
      return { ...emptyResult(), failed: tokens.length };
    }

    const tickets = json.data ?? [];
    const result = emptyResult();

    tickets.forEach((ticket, index) => {
      const token = tokens[index];
      if (!token) return;

      if (ticket.status === 'ok') {
        result.successful += 1;
        return;
      }

      result.failed += 1;
      const errorCode = ticket.details?.error ?? ticket.message ?? '';
      if (INVALID_TICKET_ERRORS.has(errorCode)) {
        result.invalidTokens.push(token);
      }
    });

    // If Expo returned fewer tickets than we sent (unexpected), the remainder
    // are unaccounted — treat them as failed so stats stay honest.
    result.failed += Math.max(0, tokens.length - tickets.length);

    return result;
  } catch (error: any) {
    logger.warn('Expo push batch failed', {
      error: error.message,
      batchSize: tokens.length,
    });
    return { ...emptyResult(), failed: tokens.length };
  }
};
