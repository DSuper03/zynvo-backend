/**
 * Telegram alerts for the worker.
 *
 * - raiseAlert(): sends one Telegram message per problem, deduplicated so the
 *   same problem alerts at most once per ALERT_WINDOW_MS; repeats in between
 *   are counted and reported with the next alert.
 * - Every alert is also recorded in ALERTS_KV (48h) for the daily digest.
 * - Without TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID it only logs.
 */
import type { CFEnv } from './types';

export type AlertInput = {
  /** Stable identity of the problem; alerts with the same key are deduplicated. */
  key: string;
  title: string;
  detail?: string;
  /** Where it came from: 'worker', 'website', 'cron'. */
  source?: string;
};

/** Stored as KV metadata so the digest can list alerts without extra reads. */
export type AlertRecord = { t: string; s: string; c: number; f: number; l: number };

const ALERT_WINDOW_MS = 10 * 60 * 1000;
const RECORD_TTL_SECONDS = 48 * 60 * 60;
const TELEGRAM_LIMIT = 4000;

// Occurrences seen by this isolate since its last send, per key. Keeps KV
// writes to one per sent alert while an outage repeats the same error.
const pending = new Map<string, number>();

export const isTelegramConfigured = (env: CFEnv) => Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);

/** Strips tokens and keys that log lines may carry before they leave the worker. */
export function redact(text: string): string {
  return text
    .replace(/eyJ[\w-]{10,}\.[\w-]{10,}\.[\w-]{10,}/g, '<jwt>')
    .replace(/\b(sk|pk)_(live|test)_[\w]+/g, '<clerk-key>')
    .replace(/\bSG\.[\w-]+\.[\w-]+/g, '<sendgrid-key>')
    .replace(/(api_key|password|secret|token)=([^&\s"]+)/gi, '$1=<redacted>');
}

export async function sendTelegram(env: CFEnv, text: string): Promise<boolean> {
  if (!isTelegramConfigured(env)) return false;
  const body = text.length > TELEGRAM_LIMIT ? `${text.slice(0, TELEGRAM_LIMIT)}\n…(truncated)` : text;
  try {
    const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: env.TELEGRAM_CHAT_ID, text: body, disable_web_page_preview: true }),
    });
    if (!res.ok) console.error(`[alerts] telegram ${res.status}: ${(await res.text()).slice(0, 200)}`);
    return res.ok;
  } catch (err: any) {
    console.error(`[alerts] telegram send failed: ${err?.message ?? err}`);
    return false;
  }
}

async function fingerprint(key: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, '0')).join('');
}

const ist = (ms: number) =>
  new Date(ms).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false });

export async function raiseAlert(env: CFEnv, input: AlertInput): Promise<void> {
  const now = Date.now();
  const source = input.source ?? 'worker';
  const fp = await fingerprint(`${source}|${input.key}`);
  const kvKey = `a:${fp}`;
  const seenHere = (pending.get(fp) ?? 0) + 1;

  let record: AlertRecord | null = null;
  let lastSent = 0;
  if (env.ALERTS_KV) {
    try {
      const got = await env.ALERTS_KV.getWithMetadata<AlertRecord>(kvKey, 'text');
      record = got.metadata ?? null;
      lastSent = Number(got.value ?? 0);
    } catch {
      // KV unavailable: fall through and send without dedup.
    }
  }

  if (lastSent && now - lastSent < ALERT_WINDOW_MS) {
    pending.set(fp, seenHere);
    return;
  }
  pending.delete(fp);

  const count = (record?.c ?? 0) + seenHere;
  const next: AlertRecord = { t: input.title.slice(0, 200), s: source, c: count, f: record?.f ?? now, l: now };

  const lines = [
    `🚨 ${input.title}`,
    `source: ${source} · ${ist(now)} IST`,
    count > 1 ? `seen ${count}× since ${ist(next.f)} IST` : '',
    input.detail ? `\n${redact(input.detail)}` : '',
  ].filter(Boolean);
  const sent = await sendTelegram(env, lines.join('\n'));
  if (!sent) console.error(`[alerts] ${input.title}${input.detail ? ` — ${redact(input.detail)}` : ''}`);

  if (env.ALERTS_KV) {
    try {
      await env.ALERTS_KV.put(kvKey, String(now), { expirationTtl: RECORD_TTL_SECONDS, metadata: next });
    } catch {
      // Dedup is best-effort.
    }
  }
}

/** Alerts recorded in the last `sinceMs`, newest first. */
export async function recentAlerts(env: CFEnv, sinceMs: number): Promise<AlertRecord[]> {
  if (!env.ALERTS_KV) return [];
  const out: AlertRecord[] = [];
  let cursor: string | undefined;
  do {
    const page = await env.ALERTS_KV.list<AlertRecord>({ prefix: 'a:', cursor });
    for (const k of page.keys) if (k.metadata && k.metadata.l >= sinceMs) out.push(k.metadata);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  return out.sort((a, b) => b.l - a.l);
}
