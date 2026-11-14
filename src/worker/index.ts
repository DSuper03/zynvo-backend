/**
 * Cloudflare Worker entry point — fully isolated from the Express app.
 * All routes are self-contained under src/worker/.
 * Zero imports from src/index.ts or any Express/Node-specific code.
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import type { CFEnv, HonoEnv } from './types';
import { prismaMiddleware } from './middleware/prisma';
import { alertingMiddleware } from './middleware/alerting';
import { logger } from './logger';
import { raiseAlert } from './alerts';
import { sendDailyDigest } from './digest';

// ── Route imports ─────────────────────────────────────────────
import authRouter from './routes/auth';
import userRouter from './routes/user';
import postRouter from './routes/post';
import eventsRouter from './routes/events';
import clubsRouter from './routes/clubs';
import teamsRouter from './routes/teams';
import offersRouter from './routes/offers';
import notificationsRouter from './routes/notifications';
import waveRouter from './routes/wave';
import adminRouter from './routes/admin';
import contactRouter from './routes/contact';
import reportsRouter from './routes/reports';
import opsRouter from './routes/ops';

const app = new Hono<HonoEnv>();

// ── CORS ──────────────────────────────────────────────────────

app.use('*', async (c, next) => {
  const FE_URL = c.env.FE_URL;
  const origins = [
    FE_URL,
    'http://localhost:3000',
    'https://www.zynvosocial.com',
    'https://zynvosocial.com',
    'https://zynvo-main.vercel.app',
  ].filter(Boolean) as string[];

  return cors({
    origin: origins,
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
  })(c, next);
});

// ── Request logger ────────────────────────────────────────────
app.use('*', honoLogger());

// ── Telegram alerts for 5xx / logged errors ───────────────────
app.use('*', alertingMiddleware);

// ── Prisma client (per-request) ───────────────────────────────
app.use('*', prismaMiddleware);

// ── Health check ──────────────────────────────────────────────
app.get('/health', (c) => c.json({ msg: 'good health', runtime: 'cloudflare-workers' }));

// ── API routes ────────────────────────────────────────────────

// Auth + user (share /api/v1/user prefix, same as Express)
app.route('/api/v1/user', authRouter);
app.route('/api/v1/user', userRouter);

// V2 auth alias
app.route('/api/v2/user/auth', authRouter);

// Resources
app.route('/api/v1/post', postRouter);
app.route('/api/v1/events', eventsRouter);
app.route('/api/v1/clubs', clubsRouter);
app.route('/api/v1/teams', teamsRouter);
app.route('/api/v1/offers', offersRouter);
app.route('/api/v1/notifications', notificationsRouter);
app.route('/api/v1/contact', contactRouter);
app.route('/api/v1/reports', reportsRouter);
app.route('/api/v1/users', waveRouter);    // wave: POST /api/v1/users/:userId

// Admin
app.route('/api/v2/admin', adminRouter);

// Internal ops (alerts from the website, test message, digest) — secret-protected
app.route('/api/v1/ops', opsRouter);

// ── 404 fallback ──────────────────────────────────────────────
app.notFound((c) => c.json({ msg: 'Not found' }, 404));

// ── Error handler ─────────────────────────────────────────────
app.onError((err, c) => {
  // Logged through logger so the alerting middleware includes it in the alert.
  logger.error(`Unhandled Worker error: ${err?.message ?? err}`, {
    stack: String(err?.stack ?? '').split('\n').slice(0, 4).join(' | '),
  });
  return c.json({ error: 'Internal server error' }, 500);
});

// ── CF Worker export ──────────────────────────────────────────
export default {
  fetch: app.fetch,
  // Daily digest (wrangler.toml [triggers] crons).
  async scheduled(_event: ScheduledController, env: CFEnv, ctx: ExecutionContext) {
    ctx.waitUntil(
      sendDailyDigest(env).catch((err: any) =>
        raiseAlert(env, {
          key: 'daily-digest-failed',
          title: 'Daily digest failed',
          detail: String(err?.message ?? err),
          source: 'cron',
        }),
      ),
    );
  },
};
