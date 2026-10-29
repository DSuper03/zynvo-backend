import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/ratelimit';
import { generateRequestId, jsonError } from '../utils/response';

const router = new Hono<HonoEnv>();

const TARGET_TYPES = new Set(['post', 'user']);
const REASONS = new Set(['spam', 'harassment', 'hate', 'sexual', 'violence', 'misinformation', 'other']);

// ── POST / — report a post or user for moderation ─────────────
// 409 when the caller already reported this target.

router.post('/', authMiddleware, rateLimiter(20), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { targetType, targetId, reason, details } = body ?? {};
  if (!TARGET_TYPES.has(targetType)) return jsonError(c, requestId, 'targetType must be "post" or "user"', 400);
  if (typeof targetId !== 'string' || !targetId) return jsonError(c, requestId, 'targetId is required', 400);
  if (!REASONS.has(reason)) return jsonError(c, requestId, 'Invalid reason', 400);

  const reporterId = c.get('userId');
  if (targetType === 'user' && targetId === reporterId) {
    return jsonError(c, requestId, 'You cannot report yourself.', 400);
  }

  const prisma = c.get('prisma');
  try {
    const exists = targetType === 'post'
      ? await prisma.createPost.findUnique({ where: { id: targetId }, select: { id: true } })
      : await prisma.user.findUnique({ where: { id: targetId }, select: { id: true } });
    if (!exists) return jsonError(c, requestId, `${targetType} not found`, 404);

    await prisma.contentReport.create({
      data: {
        reporterId,
        targetType,
        targetId,
        reason,
        details: typeof details === 'string' ? details.slice(0, 1000) : null,
      },
    });
    return c.json({ msg: 'Report submitted' }, 201);
  } catch (err: any) {
    if (err?.code === 'P2002') return jsonError(c, requestId, 'You already reported this.', 409);
    return jsonError(c, requestId, 'Internal server error.', 500, err);
  }
});

export default router;
