/**
 * FCM via Firebase REST API — replaces firebase-admin which uses Node.js
 * internals. Uses only fetch() so it runs natively in CF Workers.
 *
 * Docs: https://firebase.google.com/docs/cloud-messaging/send-message
 */

import { logger } from './logger';

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
  'INVALID_ARGUMENT',
]);

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
  options?: { channelId?: string },
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
  const BATCH = 20;
  for (let i = 0; i < tokens.length; i += BATCH) {
    const chunk = tokens.slice(i, i + BATCH);

    await Promise.all(
      chunk.map(async (token) => {
        const body = {
          message: {
            token,
            notification,
            ...(data ? { data } : {}),
            android: {
              priority: 'high',
              notification: { channel_id: options?.channelId ?? 'new_posts', sound: 'default' },
            },
            apns: {
              payload: { aps: { sound: 'default', badge: 1 } },
            },
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
            const err = (await res.json()) as { error?: { details?: Array<{ errorCode?: string }> } };
            const code = err?.error?.details?.[0]?.errorCode ?? '';
            if (INVALID_TOKEN_CODES.has(code)) {
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
      android: {
        priority: 'high',
        notification: { channel_id: 'new_posts', sound: 'default' },
      },
      apns: { payload: { aps: { sound: 'default', badge: 1 } } },
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

/**
 * Subscribe / unsubscribe a token to a topic via IID API.
 * Note: HTTP v1 doesn't have a topic-subscription endpoint;
 * we use the legacy IID endpoint which is still supported.
 */
export async function subscribeTokenToTopic(
  cfg: FcmConfig,
  token: string,
  topic: string,
): Promise<void> {
  const accessToken = await getAccessToken(cfg);
  await fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${accessToken}`, access_token_auth: 'true' },
  });
}

export async function unsubscribeTokenFromTopic(
  cfg: FcmConfig,
  token: string,
  topic: string,
): Promise<void> {
  const accessToken = await getAccessToken(cfg);
  await fetch(`https://iid.googleapis.com/iid/v1:batchRemove`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      access_token_auth: 'true',
    },
    body: JSON.stringify({ to: `/topics/${topic}`, registration_tokens: [token] }),
  });
}
