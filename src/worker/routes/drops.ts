/**
 * Campus Drop API, mounted at /api/v1/drops.
 *
 *   GET  /live          public: the latest drop and whether it's live (for the website)
 *   GET  /me            signed in: the latest drop, your answer, results if you answered, streak
 *   POST /:id/answer    signed in: answer while it's live, returns results
 *   PUT  /settings      signed in: { enabled } turns Drop notifications on or off
 *
 * Results are only returned to people who answered: that is the hook.
 */

import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import {
  isFcmConfigured,
  subscribeTokensToTopic,
  unsubscribeTokenFromTopic,
  type FcmConfig,
} from '../fcm';
import { buildResults, canAnswer, computeStreak, isLive, type AnswerGroup } from '../campus-drop/policy';
import { DROP_TOPIC } from '../campus-drop/tick';

const router = new Hono<HonoEnv>();

const STREAK_LOOKBACK = 60;

type DropRow = {
  id: string;
  day: string;
  kind: string;
  question: string;
  options: string[];
  sentAt: Date | null;
  closesAt: Date | null;
};

const latestSentDrop = (prisma: any): Promise<DropRow | null> =>
  prisma.campusDrop.findFirst({
    where: { sentAt: { not: null } },
    orderBy: { sentAt: 'desc' },
    select: { id: true, day: true, kind: true, question: true, options: true, sentAt: true, closesAt: true },
  });

const publicDrop = (drop: DropRow, now: Date) => ({
  id: drop.id,
  day: drop.day,
  kind: drop.kind,
  question: drop.question,
  options: drop.options,
  sentAt: drop.sentAt,
  closesAt: drop.closesAt,
  live: isLive(drop, now),
});

async function resultsFor(prisma: any, drop: DropRow, college: string | null) {
  const groups = await prisma.campusDropAnswer.groupBy({
    by: ['option', 'collegeName'],
    where: { dropId: drop.id },
    _count: { _all: true },
  });
  const rows: AnswerGroup[] = groups.map((g: any) => ({
    option: g.option,
    collegeName: g.collegeName,
    count: g._count?._all ?? 0,
  }));
  return buildResults(rows, drop.options.length, college);
}

async function streakFor(prisma: any, userId: string, liveDropId: string | null) {
  const sent: { id: string }[] = await prisma.campusDrop.findMany({
    where: { sentAt: { not: null } },
    orderBy: { sentAt: 'desc' },
    take: STREAK_LOOKBACK,
    select: { id: true },
  });
  if (sent.length === 0) return 0;
  const mine: { dropId: string }[] = await prisma.campusDropAnswer.findMany({
    where: { userId, dropId: { in: sent.map((d) => d.id) } },
    select: { dropId: true },
  });
  return computeStreak(sent.map((d) => d.id), new Set(mine.map((a) => a.dropId)), liveDropId);
}

const collegeOf = async (prisma: any, userId: string): Promise<string | null> =>
  (await prisma.user.findUnique({ where: { id: userId }, select: { collegeName: true } }))?.collegeName ?? null;

/** Everything the app shows for the latest drop, for one user. */
async function stateFor(prisma: any, userId: string, drop: DropRow, now: Date) {
  const [answer, college, answers] = await Promise.all([
    prisma.campusDropAnswer.findUnique({
      where: { dropId_userId: { dropId: drop.id, userId } },
      select: { option: true },
    }),
    collegeOf(prisma, userId),
    prisma.campusDropAnswer.count({ where: { dropId: drop.id } }),
  ]);
  const live = isLive(drop, now);
  return {
    drop: publicDrop(drop, now),
    answers,
    myAnswer: answer?.option ?? null,
    results: answer ? await resultsFor(prisma, drop, college) : null,
    streak: await streakFor(prisma, userId, live ? drop.id : null),
  };
}

// ── GET /live (public) ────────────────────────────────────────

router.get('/live', async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma') as any;
  try {
    const drop = await latestSentDrop(prisma);
    if (!drop) return c.json({ drop: null, answers: 0 });
    const answers = await prisma.campusDropAnswer.count({ where: { dropId: drop.id } });
    c.header('Cache-Control', 'no-store');
    return c.json({ drop: publicDrop(drop, new Date()), answers });
  } catch (err) {
    return jsonError(c, requestId, 'error loading the drop', 500, err);
  }
});

// ── GET /me ───────────────────────────────────────────────────

router.get('/me', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma') as any;
  const userId = c.get('userId');
  try {
    const [drop, optOut] = await Promise.all([
      latestSentDrop(prisma),
      prisma.campusDropOptOut.findUnique({ where: { userId }, select: { userId: true } }),
    ]);
    const enabled = !optOut;
    if (!drop) return c.json({ drop: null, answers: 0, myAnswer: null, results: null, streak: 0, enabled });
    return c.json({ ...(await stateFor(prisma, userId, drop, new Date())), enabled });
  } catch (err) {
    return jsonError(c, requestId, 'error loading the drop', 500, err);
  }
});

// ── POST /:id/answer ──────────────────────────────────────────

// No per-IP rate limit: a whole hostel can share one IP and everyone answers
// at the same moment. One answer per user is enforced by the unique index.
router.post('/:id/answer', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma') as any;
  const userId = c.get('userId');
  const dropId = c.req.param('id');

  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const option = body?.option;
  if (!Number.isInteger(option)) return jsonError(c, requestId, 'option must be a whole number', 400);

  try {
    const drop: DropRow | null = await prisma.campusDrop.findUnique({
      where: { id: dropId },
      select: { id: true, day: true, kind: true, question: true, options: true, sentAt: true, closesAt: true },
    });
    if (!drop || !drop.sentAt) return jsonError(c, requestId, 'Drop not found', 404);
    if (option < 0 || option >= drop.options.length) return jsonError(c, requestId, 'That option does not exist', 400);

    const now = new Date();
    if (!canAnswer(drop, now)) {
      return jsonError(c, requestId, 'This Drop has closed. The next one comes tomorrow.', 410);
    }

    const college = await collegeOf(prisma, userId);
    let alreadyAnswered = false;
    try {
      await prisma.campusDropAnswer.create({
        data: { dropId, userId, option, collegeName: (college ?? '').trim() },
      });
    } catch (err: any) {
      // Answered already (double tap or second device): keep the first answer.
      if (err?.code !== 'P2002') throw err;
      alreadyAnswered = true;
    }
    return c.json({ ...(await stateFor(prisma, userId, drop, now)), alreadyAnswered });
  } catch (err) {
    return jsonError(c, requestId, 'error saving your answer', 500, err);
  }
});

// ── PUT /settings ─────────────────────────────────────────────

const fcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

router.put('/settings', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const prisma = c.get('prisma') as any;
  const userId = c.get('userId');

  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  if (typeof body?.enabled !== 'boolean') return jsonError(c, requestId, 'enabled must be true or false', 400);
  const enabled: boolean = body.enabled;

  try {
    if (enabled) {
      await prisma.campusDropOptOut.deleteMany({ where: { userId } });
    } else {
      await prisma.campusDropOptOut.upsert({ where: { userId }, create: { userId }, update: {} });
    }

    // Move this user's devices on or off the Drop topic. A failure here is
    // logged, not shown: the setting is saved either way.
    const cfg = fcmCfg(c);
    if (isFcmConfigured(cfg)) {
      const devices: { token: string }[] = await prisma.deviceToken.findMany({
        where: { userId },
        select: { token: true },
      });
      const tokens = devices.map((d) => d.token);
      try {
        if (enabled) await subscribeTokensToTopic(cfg, tokens, DROP_TOPIC);
        else await Promise.all(tokens.map((t) => unsubscribeTokenFromTopic(cfg, t, DROP_TOPIC)));
      } catch (err: any) {
        logger.error(`[${requestId}] Drop topic update failed`, { error: String(err?.message ?? err) });
      }
    }
    return c.json({ enabled });
  } catch (err) {
    return jsonError(c, requestId, 'error saving the setting', 500, err);
  }
});

export default router;
