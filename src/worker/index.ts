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
import { alertingMiddleware, normalizePath } from './middleware/alerting';
import { invalidateOnWrite } from './cache';
import { logger } from './logger';
import { raiseAlert } from './alerts';
import { sendDailyDigest } from './digest';
import { remindOrganizersOfPendingApprovals } from './pending-registrations';
import kolkataRouter from './routes/kolkata';
import { scanKolkataEvents } from './kolkata-curation';
import { announceLiveAppUpdate } from './app-update';
import { runCampusDrop } from './campus-drop/run';
import { backfillAllUsersTopic } from './push-topic-backfill';

// ── Route imports ─────────────────────────────────────────────
import authRouter from './routes/auth';
import userRouter from './routes/user';
import postRouter from './routes/post';
import eventsRouter from './routes/events';
import clubsRouter from './routes/clubs';
import leaderboardRouter from './routes/leaderboard';
import teamsRouter from './routes/teams';
import offersRouter from './routes/offers';
import notificationsRouter from './routes/notifications';
import waveRouter from './routes/wave';
import adminRouter from './routes/admin';
import contactRouter from './routes/contact';
import reportsRouter from './routes/reports';
import opsRouter from './routes/ops';
import dropsRouter from './routes/drops';

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

// ── Prisma client (shared per isolate) ────────────────────────
app.use('*', prismaMiddleware);

// ── Cache invalidation ────────────────────────────────────────
// Successful writes clear the Accelerate cache tags their data feeds
// (see cache.ts). Coarse on purpose: no write route can be missed.
app.use('/api/v1/events/*', invalidateOnWrite(['events']));
app.use('/api/v1/clubs/*', invalidateOnWrite(['clubs', 'events']));
app.use('/api/v2/admin/*', invalidateOnWrite(['clubs', 'events']));
app.use('/api/v1/user/joinClub/*', invalidateOnWrite(['clubs']));
app.use('/api/v1/user/leaveClub/*', invalidateOnWrite(['clubs']));
app.use('/api/v1/user/deleteAccount', invalidateOnWrite(['clubs', 'events']));

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
app.route('/api/v1/leaderboard', leaderboardRouter);
app.route('/api/v1/teams', teamsRouter);
app.route('/api/v1/offers', offersRouter);
app.route('/api/v1/notifications', notificationsRouter);
app.route('/api/v1/contact', contactRouter);
app.route('/api/v1/reports', reportsRouter);
app.route('/api/v1/drops', dropsRouter);
app.route('/api/v1/kolkata-events', kolkataRouter);
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
/** Everything we can learn about a thrown value, including non-Error throws. */
function describeThrown(err: unknown): string {
  if (err instanceof Error) {
    const extra = Object.entries(err as any)
      .filter(([k]) => !['message', 'stack'].includes(k))
      .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`)
      .join(' ')
      .slice(0, 400);
    return [
      `${err.constructor?.name ?? 'Error'}: ${err.message}`,
      extra && `fields: ${extra}`,
      String(err.stack ?? '').split('\n').slice(1, 6).join('\n'),
    ].filter(Boolean).join('\n');
  }
  let json = '';
  try { json = JSON.stringify(err); } catch { /* circular */ }
  return `non-Error thrown (${typeof err}${err && typeof err === 'object' ? `, ${(err as any).constructor?.name}` : ''}): ${json || String(err)}`.slice(0, 1200);
}

export default {
  // Hono handles errors inside routes (onError → 500 JSON), but anything that
  // escapes it (e.g. a non-Error throw, which Hono re-throws) used to surface
  // as Cloudflare's "Error 1101: Worker threw exception" with no details.
  // Catch it here: the visitor gets a normal 500 and we get the exact cause.
  async fetch(request: Request, env: CFEnv, ctx: ExecutionContext) {
    // Records this request's waitUntil() work so its database client is only
    // handed to another request once that background work is done too.
    const pendingWork: Promise<unknown>[] = [];
    const trackedCtx = Object.assign(Object.create(ctx), {
      waitUntil: (p: Promise<unknown>) => {
        pendingWork.push(p);
        ctx.waitUntil(p);
      },
      passThroughOnException: () => ctx.passThroughOnException(),
      pendingWork,
    }) as ExecutionContext;
    try {
      return await app.fetch(request, env, trackedCtx);
    } catch (err) {
      const url = new URL(request.url);
      const detail = describeThrown(err);
      logger.error(`Uncaught worker exception: ${request.method} ${url.pathname}`, { detail });
      ctx.waitUntil(
        raiseAlert(env, {
          key: `uncaught ${request.method} ${normalizePath(url.pathname)} ${detail.split('\n')[0].slice(0, 120)}`,
          title: `💥 Crash on ${request.method} ${normalizePath(url.pathname)} (was Error 1101)`,
          detail,
          source: 'worker',
        }).catch(() => {}),
      );
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    }
  },
  // Daily digest stays on its 03:30 UTC cron. The hourly cron reminds organizers
  // and announces app updates. The every-minute cron only runs Campus Drop.
  async scheduled(event: ScheduledController, env: CFEnv, ctx: ExecutionContext) {
    if (event.cron === '* * * * *') {
      ctx.waitUntil(
        runCampusDrop(env).catch((err: any) =>
          raiseAlert(env, {
            key: 'campus-drop-failed',
            title: 'Campus Drop failed',
            detail: String(err?.message ?? err),
            source: 'cron',
          }),
        ),
      );
      return;
    }
    if (event.cron === '30 3 * * *') {
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
    }
    ctx.waitUntil(
      remindOrganizersOfPendingApprovals(env).catch((err: any) =>
        logger.error('Pending registration reminder failed', { error: String(err?.message ?? err) }),
      ),
    );
    if (event.cron === '0 * * * *') {
      ctx.waitUntil(scanKolkataEvents(env).catch(() => logger.warn('Kolkata calendar scan failed')));
    }
    ctx.waitUntil(
      announceLiveAppUpdate(env).catch((err: any) =>
        logger.error('App update announcement failed', { error: String(err?.message ?? err) }),
      ),
    );
    ctx.waitUntil(
      backfillAllUsersTopic(env).catch((error) =>
        logger.error('Push topic backfill failed', { error: String(error) }),
      ),
    );
  },
};
