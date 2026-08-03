/**
 * Shared helpers for chunking and routing notification payloads.
 *
 * Used by the notification service and the Expo/Firebase senders so that
 * batching, deduplication, token-type detection, and concurrency control live
 * in exactly one place.
 */

/** Expo push tokens always start with this prefix. Anything else is FCM. */
export const isExpoToken = (token: string): boolean =>
  token.startsWith('ExponentPushToken[');

export const isFcmToken = (token: string): boolean => !isExpoToken(token);

/**
 * Normalize a raw token list: drop null/empty values and duplicates.
 * The caller decides whether tokens come from the DB or from a request body.
 */
export const dedupeTokens = (tokens: string[]): string[] =>
  Array.from(
    new Set(tokens.filter((t) => typeof t === 'string' && t.trim().length > 0))
  );

/** Split an array into fixed-size chunks (last chunk may be smaller). */
export const splitIntoChunks = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

/**
 * Run `fn` over `items` with at most `concurrency` promises in flight.
 * Preserves input order in the returned array. Rejects on the first thrown error.
 */
export const mapWithConcurrency = async <T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await fn(items[index], index);
    }
  };

  const workerCount = Math.max(1, Math.min(concurrency, items.length));
  await Promise.all(
    Array.from({ length: workerCount }, () => worker())
  );

  return results;
};

/**
 * FCM `data` and iOS push `data` only accept string values. Coerce every
 * non-string value (numbers, booleans, objects, arrays) to a string so the
 * push never fails validation on the provider side.
 */
export const stringifyData = (
  data?: Record<string, unknown> | null
): Record<string, string> | undefined => {
  if (!data) return undefined;

  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      out[key] = value;
    } else if (value === null || value === undefined) {
      out[key] = '';
    } else {
      out[key] = JSON.stringify(value);
    }
  }
  return out;
};
