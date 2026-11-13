/**
 * Raises a Telegram alert for any request that ends in a 5xx, logs an error,
 * or logs a warning marked { notify: true } (e.g. rejected Clerk sessions).
 * Runs the rest of the request inside requestLogs so the alert carries the
 * request's own warn/error lines. Alerts are sent after the response.
 */
import type { MiddlewareHandler } from 'hono';
import type { HonoEnv } from '../types';
import { requestLogs, type RequestLogStore } from '../logger';
import { raiseAlert } from '../alerts';

/** Replaces ids in a path so one broken route is one alert, not one per id. */
export const normalizePath = (path: string) =>
  path
    .split('/')
    .map((seg) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(seg) || /^\d+$/.test(seg) || (seg.length >= 16 && /\d/.test(seg))
        ? ':id'
        : seg,
    )
    .join('/');

/** "[ERROR] [ab12cd3] signup error {...}" → "signup error" */
const messageOf = (entry: string) =>
  entry
    .replace(/^\[\w+\]\s*/, '')
    .replace(/^\[[\w-]+\]\s*/, '')
    .replace(/\s*\{.*$/, '')
    .trim();

export const alertingMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  if (c.req.path.startsWith('/api/v1/ops/')) return next();

  const store: RequestLogStore = { logs: [] };
  await requestLogs.run(store, () => next());

  const status = c.res.status;
  const flagged = store.logs.filter((l) => l.level === 'error' || l.notify);
  if (status < 500 && flagged.length === 0) return;

  const method = c.req.method;
  const path = normalizePath(c.req.path);
  const firstMsg = flagged[0] ? messageOf(flagged[0].entry) : '';
  const fromWebsite =
    !!c.env.INTERNAL_PROXY_SECRET && c.req.header('x-internal-proxy-secret') === c.env.INTERNAL_PROXY_SECRET;

  const title = `${status >= 500 ? `${status} ` : ''}${method} ${path}${firstMsg ? `: ${firstMsg}` : ''}`;
  const detail = [
    `client: ${fromWebsite ? 'website' : 'app / direct'} · response ${status}`,
    ...store.logs.map((l) => l.entry.slice(0, 600)),
  ].join('\n');

  const alert = raiseAlert(c.env, {
    key: `${method} ${path} ${status >= 500 ? status : ''} ${firstMsg.replace(/\d+/g, '#')}`,
    title,
    detail,
    source: 'worker',
  });
  try {
    c.executionCtx.waitUntil(alert);
  } catch {
    await alert; // no execution context (tests)
  }
};
