/**
 * Internal ops endpoints. Every route requires the x-internal-proxy-secret
 * header shared with the website's server (INTERNAL_PROXY_SECRET).
 *
 *   POST /api/v1/ops/report  — the website reports a failure → Telegram alert
 *   POST /api/v1/ops/test    — sends a test Telegram message
 *   POST /api/v1/ops/digest  — sends the daily digest now
 */
import { Hono, type MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { raiseAlert, sendTelegram, isTelegramConfigured } from '../alerts';
import { sendDailyDigest } from '../digest';

const router = new Hono<HonoEnv>();

const timingSafeEqual = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
};

const requireInternalSecret: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const secret = c.env.INTERNAL_PROXY_SECRET;
  const given = c.req.header('x-internal-proxy-secret') ?? '';
  if (!secret || !timingSafeEqual(given, secret)) return c.json({ msg: 'Not found' }, 404);
  await next();
};

router.use('*', requireInternalSecret);

router.post('/report', async (c) => {
  let body: any;
  try { body = await c.req.json(); } catch { return c.json({ msg: 'Invalid JSON' }, 400); }
  const title = typeof body?.title === 'string' ? body.title.slice(0, 200) : '';
  if (!title) return c.json({ msg: 'title is required' }, 400);

  const alert = raiseAlert(c.env, {
    key: typeof body.key === 'string' && body.key ? body.key.slice(0, 300) : title,
    title,
    detail: typeof body.detail === 'string' ? body.detail.slice(0, 2000) : undefined,
    source: typeof body.source === 'string' && body.source ? body.source.slice(0, 40) : 'website',
  });
  c.executionCtx.waitUntil(alert);
  return c.json({ ok: true }, 202);
});

router.post('/test', async (c) => {
  if (!isTelegramConfigured(c.env)) {
    return c.json({ ok: false, msg: 'TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set' }, 500);
  }
  const ok = await sendTelegram(c.env, '✅ Zynvo alerts are connected. You will get errors and a daily report here.');
  return c.json({ ok }, ok ? 200 : 502);
});

router.post('/digest', async (c) => {
  const ok = await sendDailyDigest(c.env);
  return c.json({ ok }, ok ? 200 : 502);
});

export default router;
