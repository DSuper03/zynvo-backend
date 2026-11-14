/**
 * Rate limiter for the worker.
 *
 * Uses Cloudflare's Rate Limiting bindings (RL_5 … RL_100, see wrangler.toml)
 * so counts are shared by every isolate; without a binding (local dev) it
 * falls back to an in-memory window per isolate.
 *
 * Counters are kept per route and per client. Website traffic arrives from
 * the Next.js proxy's servers, so for requests carrying the internal proxy
 * secret the real client IP is read from x-zynvo-client-ip.
 */
import type { Context, MiddlewareHandler } from 'hono';
import type { HonoEnv, RateLimitBinding } from '../types';

type WindowEntry = { count: number; resetAt: number };

const store = new Map<string, WindowEntry>();

const FALLBACK_WINDOW_MS = 60 * 1000;

/** Bindings exist for these per-minute limits; a route's limit rounds up to the next one. */
const BINDING_LIMITS = [5, 10, 20, 30, 100] as const;

const bindingFor = (c: Context<HonoEnv>, limit: number): RateLimitBinding | undefined => {
  const size = BINDING_LIMITS.find((l) => l >= limit) ?? 100;
  return c.env[`RL_${size}`];
};

export const clientIp = (c: Context<HonoEnv>): string => {
  const secret = c.env.INTERNAL_PROXY_SECRET;
  if (secret && c.req.header('x-internal-proxy-secret') === secret) {
    const forwarded = c.req.header('x-zynvo-client-ip');
    if (forwarded) return forwarded;
  }
  return c.req.header('cf-connecting-ip') ?? 'unknown';
};

/**
 * @param limit  Max requests per client per minute on this route
 */
export const rateLimiter = (limit = 100): MiddlewareHandler<HonoEnv> => {
  return async (c, next) => {
    const key = `${c.req.method}:${c.req.routePath}:${clientIp(c)}`;

    const binding = bindingFor(c, limit);
    if (binding) {
      const { success } = await binding.limit({ key });
      if (!success) {
        c.header('Retry-After', '60');
        return c.json({ msg: 'Too many requests, please try again later.' }, 429);
      }
      await next();
      return;
    }

    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetAt) {
      store.set(key, { count: 1, resetAt: now + FALLBACK_WINDOW_MS });
      await next();
      return;
    }

    if (entry.count >= limit) {
      c.header('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return c.json({ msg: 'Too many requests, please try again later.' }, 429);
    }

    entry.count++;
    await next();
  };
};
