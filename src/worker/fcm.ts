/**
 * FCM via Firebase REST API — replaces firebase-admin which uses Node.js
 * internals. Uses only fetch() so it runs natively in CF Workers.
 *
 * Docs: https://firebase.google.com/docs/cloud-messaging/send-message
 */

import { logger } from './logger';

export const ALL_USERS_TOPIC = 'all_users';

// ── Types ─────────────────────────────────────────────────────

export type FcmConfig = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};

export type DeviceTokenPushResult = {
  successCount: number;
  failureCount: number;
  invalidTokens: string[];
};

// Error codes FCM returns for stale / invalid tokens
const INVALID_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
  'UNREGISTERED',
]);

function platformAlert(data?: Record<string, string>) {
  const type = data?.type ?? '';
  let channelId = 'new_posts';
  if (type === 'event_registration' || type === 'registration_review_reminder' || type === 'registration_review') {
    channelId = 'event_registrations';
  } else if (type === 'club_event' || type === 'waitlist' || type.startsWith('event_') || type.startsWith('team_')) {
    channelId = 'events';
  } else if (type.startsWith('club_') || type.startsWith('core_')) {
    channelId = 'clubs';
  } else if (type === 'app_update' || type === 'play_store_update') {
    channelId = 'app_updates';
  } else if (['new_post', 'wave', 'comment', 'comment_reply', 'mention', 'follow', 'friend_registered', 'campus_drop'].includes(type)) {
    channelId = 'social';
  }
  return {
    android: { priority: 'high', notification: { channel_id: channelId, sound: 'default' } },
    apns: { payload: { aps: { sound: 'default', badge: 1 } } },
  };
}

// ── JWT helpers for service-account auth ──────────────────────

/**
 * Build a signed JWT for the Google OAuth2 token endpoint using the
 * Web Crypto API (available in CF Workers + all modern runtimes).
 */
async function buildServiceAccountJwt(cfg: FcmConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: cfg.clientEmail,
    sub: cfg.clientEmail,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
  };

  const encode = (obj: object) =>
    btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const signingInput = `${encode(header)}.${encode(payload)}`;

  // Parse PKCS#8 PEM private key
  const pem = cfg.privateKey.replace(/\\n/g, '\n');
  const pemBody = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\n/g, '');
  const keyDer = Uint8Array.from(atob(pemBody), (c) => c.charCodeAt(0));

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    keyDer.buffer,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    new TextEncoder().encode(signingInput),
  );

  const sigB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${signingInput}.${sigB64}`;
}

/**
 * Exchange a service-account JWT for a short-lived Google OAuth2 access token.
 * In production you'd cache this token for up to 1 hour; for Workers the
 * per-request overhead is small enough to skip caching initially.
 */
async function getAccessToken(cfg: FcmConfig): Promise<string> {
  const jwt = await buildServiceAccountJwt(cfg);

  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!resp.ok) {
    throw new Error(`Failed to get access token: ${resp.status} ${await resp.text()}`);
  }

  const data = (await resp.json()) as { access_token: string };
  return data.access_token;
}

// ── Public API ────────────────────────────────────────────────

export const isFcmConfigured = (cfg: Partial<FcmConfig>): boolean =>
  Boolean(cfg.projectId && cfg.clientEmail && cfg.privateKey);

export class FcmNotConfiguredError extends Error {
  readonly status = 503;
  constructor() {
    super('FCM is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY.');
    this.name = 'FcmNotConfiguredError';
  }
}

/**
 * Send a push to a list of device tokens.
 * Tokens are processed individually (FCM HTTP v1 is per-message).
 * Returns counts + invalid tokens to prune from DB.
 */
export async function sendToDeviceTokens(
  cfg: FcmConfig,
  tokens: string[],
  notification: { title: string; body: string },
  data?: Record<string, string>,
): Promise<DeviceTokenPushResult> {
  if (tokens.length === 0) {
    return { successCount: 0, failureCount: 0, invalidTokens: [] };
  }

  const accessToken = await getAccessToken(cfg);
  const url = `https://fcm.googleapis.com/v1/projects/${cfg.projectId}/messages:send`;

  let successCount = 0;
  let failureCount = 0;
  const invalidTokens: string[] = [];

  // FCM HTTP v1 is one message per request — send concurrently in batches of 20
  const BATCH = 5;
  const alert = platformAlert(data);
  for (let i = 0; i < tokens.length; i += BATCH) {
    const chunk = tokens.slice(i, i + BATCH);

    await Promise.all(
      chunk.map(async (token) => {
        const body = {
          message: {
            token,
            notification,
            ...(data ? { data } : {}),
            ...alert,
          },
        };

        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          });

          if (res.ok) {
            successCount++;
          } else {
            failureCount++;
            const err = await res.json().catch(() => null) as { error?: { status?: string; details?: Array<{ errorCode?: string }> } } | null;
            const code = err?.error?.details?.find((detail) => detail.errorCode)?.errorCode;
            logger.warn('FCM rejected a device alert', { status: res.status, code: code ?? err?.error?.status });
            if (code && INVALID_TOKEN_CODES.has(code)) {
              invalidTokens.push(token);
            }
          }
        } catch {
          failureCount++;
        }
      }),
    );
  }

  logger.info('FCM batch complete', { total: tokens.length, successCount, failureCount });
  return { successCount, failureCount, invalidTokens };
}

/**
 * Send to FCM topic (e.g. "all_users").
 */
export async function sendToTopic(
  cfg: FcmConfig,
  topic: string,
  notification: { title: string; body: string },
  data?: Record<string, string>,
): Promise<void> {
  const accessToken = await getAccessToken(cfg);
  const url = `https://fcm.googleapis.com/v1/projects/${cfg.projectId}/messages:send`;

  const body = {
    message: {
      topic,
      notification,
      ...(data ? { data } : {}),
        ...platformAlert(data),
    },
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`FCM topic send failed: ${res.status} ${await res.text()}`);
  }
}

export async function subscribeTokenToTopic(
  cfg: FcmConfig,
  token: string,
  topic: string,
): Promise<void> {
  await manageTopicSubscription(cfg, [token], topic, 'batchAdd', true);
}

/** Subscribe up to 1000 tokens to a topic in one call (IID batchAdd). */
export async function subscribeTokensToTopic(
  cfg: FcmConfig,
  tokens: string[],
  topic: string,
): Promise<void> {
  const batchSize = 1000;
  for (let offset = 0; offset < tokens.length; offset += batchSize) {
    await manageTopicSubscription(cfg, tokens.slice(offset, offset + batchSize), topic, 'batchAdd');
  }
}

export async function unsubscribeTokenFromTopic(
  cfg: FcmConfig,
  token: string,
  topic: string,
): Promise<void> {
  await manageTopicSubscription(cfg, [token], topic, 'batchRemove');
}

async function manageTopicSubscription(
  cfg: FcmConfig,
  tokens: string[],
  topic: string,
  action: 'batchAdd' | 'batchRemove',
  strict = false,
): Promise<void> {
  if (tokens.length === 0) return;
  const accessToken = await getAccessToken(cfg);
  const response = await fetch(`https://iid.googleapis.com/iid/v1:${action}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      access_token_auth: 'true',
    },
    body: JSON.stringify({ to: `/topics/${topic}`, registration_tokens: tokens }),
  });
  if (!response.ok) throw new Error(`FCM ${action} failed for ${topic} (HTTP ${response.status})`);
  const { results } = await response.json() as { results?: Array<{ error?: string }> };
  if (results?.length !== tokens.length) throw new Error(`FCM returned incomplete ${action} results for ${topic}`);
  const errors = results.flatMap(({ error }) => error ? [error] : []);
  const retryable = errors.find((error) => !['NOT_FOUND', 'INVALID_ARGUMENT'].includes(error));
  if (retryable || (strict && errors.length)) {
    throw new Error(`FCM ${action} rejected ${topic}: ${retryable ?? errors[0]}`);
  }
}
