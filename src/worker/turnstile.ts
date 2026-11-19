/**
 * Cloudflare Turnstile bot checks for public endpoints that send email or
 * accept anonymous input (signup, forgot-password, resend verification,
 * contact form).
 *
 * Clients send the widget token as `turnstileToken` in the JSON body or the
 * `x-turnstile-token` header.
 *
 * - No TURNSTILE_SECRET_KEY: checks are skipped.
 * - Token present: it must verify, or the request gets 403.
 * - Token missing: allowed until TURNSTILE_ENFORCE=true, so app builds and
 *   pages without the widget keep working while clients are updated.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from './types';
import { clientIp } from './middleware/ratelimit';
import { logger } from './logger';

const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export type TurnstileResult = { ok: true } | { ok: false; reason: string };

export async function verifyTurnstile(secret: string, token: string, ip?: string): Promise<TurnstileResult> {
  const form = new FormData();
  form.append('secret', secret);
  form.append('response', token);
  if (ip && ip !== 'unknown') form.append('remoteip', ip);
  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean; 'error-codes'?: string[] };
    if (data.success) return { ok: true };
    return { ok: false, reason: (data['error-codes'] ?? []).join(',') || `HTTP ${res.status}` };
  } catch (err: any) {
    // Turnstile unreachable: fail open so an outage there can't block signups.
    logger.warn('turnstile verify unavailable', { error: String(err?.message ?? err) });
    return { ok: true };
  }
}

async function tokenFrom(c: Parameters<MiddlewareHandler<HonoEnv>>[0]): Promise<string | undefined> {
  const header = c.req.header('x-turnstile-token');
  if (header) return header;
  if (!(c.req.header('content-type') ?? '').includes('application/json')) return undefined;
  // Hono caches the parsed body, so the route handler can still read it.
  const body = await c.req.json().catch(() => null);
  return typeof body?.turnstileToken === 'string' && body.turnstileToken ? body.turnstileToken : undefined;
}

export const turnstileGuard: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const secret = c.env.TURNSTILE_SECRET_KEY;
  if (!secret) return next();

  const token = await tokenFrom(c);
  if (!token) {
    if (c.env.TURNSTILE_ENFORCE === 'true') {
      return c.json({ msg: 'Please complete the verification and try again.' }, 403);
    }
    return next();
  }

  const result = await verifyTurnstile(secret, token, clientIp(c));
  if (!result.ok) {
    logger.warn('turnstile rejected', { path: c.req.path, reason: result.reason });
    return c.json({ msg: 'Verification failed. Please try again.' }, 403);
  }
  return next();
};
