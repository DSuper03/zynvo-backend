import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware, adminAuthMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import {
  isFcmConfigured,
  subscribeTokenToTopic,
  unsubscribeTokenFromTopic,
  sendToDeviceTokens,
  FcmNotConfiguredError,
  type FcmConfig,
} from '../fcm';
import { broadcast } from '../utils/notification';

const router = new Hono<HonoEnv>();

const ALL_USERS_TOPIC = 'all_users';

const broadcastSchema = z.object({
  title: z.string().trim().min(1).max(100),
  body: z.string().trim().min(1).max(500),
  imageUrl: z.string().nullable().optional(),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
});

const getFcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

// ── POST /register ────────────────────────────────────────────

router.post('/register', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { token, platform } = body;
  if (!token || typeof token !== 'string') return jsonError(c, requestId, 'token is required', 400);

  const normalizedPlatform = typeof platform === 'string' ? platform.toLowerCase().trim() : undefined;
  if (normalizedPlatform && !['android', 'ios', 'web'].includes(normalizedPlatform)) {
    return jsonError(c, requestId, 'platform must be android, ios, or web', 400);
  }

  const prisma = c.get('prisma') as any;
  try {
    const device = await prisma.deviceToken.upsert({
      where: { token },
      create: { token, userId, platform: normalizedPlatform },
      update: { userId, platform: normalizedPlatform },
      select: { id: true, token: true, platform: true },
    });

    const fcmCfg = getFcmCfg(c);
    if (isFcmConfigured(fcmCfg)) {
      try { await subscribeTokenToTopic(fcmCfg, token, ALL_USERS_TOPIC); } catch (err: any) {
        logger.error(`[${requestId}] Failed to subscribe to topic`, { error: err.message });
      }
    }

    return c.json({ msg: 'device registered for notifications', device, fcmConfigured: isFcmConfigured(fcmCfg) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error registering device token', 500, err);
  }
});

// ── POST /unregister ──────────────────────────────────────────

router.post('/unregister', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { token } = body;
  if (!token || typeof token !== 'string') return jsonError(c, requestId, 'token is required', 400);

  const prisma = c.get('prisma') as any;
  const existing = await prisma.deviceToken.findUnique({ where: { token }, select: { id: true, userId: true } });
  if (!existing || existing.userId !== userId) return jsonError(c, requestId, 'device token not found', 404);

  await prisma.deviceToken.delete({ where: { token } });

  const fcmCfg = getFcmCfg(c);
  if (isFcmConfigured(fcmCfg)) {
    try { await unsubscribeTokenFromTopic(fcmCfg, token, ALL_USERS_TOPIC); } catch {}
  }

  return c.json({ msg: 'device unregistered from notifications' }, 200);
});

// ── GET / — notification inbox ────────────────────────────────

router.get('/', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = Math.min(50, Math.max(1, parseInt(c.req.query('limit') ?? '20') || 20));
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  try {
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.notification.count({ where: { userId } }),
      prisma.notification.count({ where: { userId, read: false } }),
    ]);
    return c.json({ msg: 'notifications fetched', notifications, unreadCount, total, totalPages: Math.ceil(total / limit), page, limit }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error fetching notifications', 500, err);
  }
});

// ── POST /read ────────────────────────────────────────────────

router.post('/read', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const { id } = body;
  if (!id || typeof id !== 'string') return jsonError(c, requestId, 'notification id is required', 400);
  const prisma = c.get('prisma') as any;
  const result = await prisma.notification.updateMany({ where: { id, userId }, data: { read: true } });
  if (result.count === 0) return jsonError(c, requestId, 'notification not found', 404);
  return c.json({ msg: 'notification marked as read' }, 200);
});

// ── POST /read-all ────────────────────────────────────────────

router.post('/read-all', authMiddleware, async (c) => {
  const userId = c.get('userId');
  const prisma = c.get('prisma') as any;
  const result = await prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } });
  return c.json({ msg: 'all notifications marked as read', updated: result.count }, 200);
});

// ── POST /test ────────────────────────────────────────────────

router.post('/test', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const fcmCfg = getFcmCfg(c);
  if (!isFcmConfigured(fcmCfg)) return jsonError(c, requestId, 'FCM not configured', 503);

  let body: any;
  try { body = await c.req.json(); } catch { body = {}; }

  const title = body?.title || 'Test notification';
  const notifBody = body?.description || 'If you see this, FCM is working.';

  const userId = c.get('userId');
  const prisma = c.get('prisma') as any;
  const devices = await prisma.deviceToken.findMany({ where: { userId }, select: { token: true } });
  const tokens = devices.map((d: any) => d.token);

  let direct = null;
  if (tokens.length > 0) {
    direct = await sendToDeviceTokens(fcmCfg, tokens, { title, body: notifBody }, { type: 'test', route: '/notifications' }, { channelId: 'new_posts' });
  }

  return c.json({ msg: 'test notification sent', topicSent: false, deviceTokensRegistered: tokens.length, directDelivered: direct?.successCount ?? 0, directFailed: direct?.failureCount ?? 0 }, 200);
});

// ── POST /broadcast (admin) ───────────────────────────────────

router.post('/broadcast', authMiddleware, adminAuthMiddleware, async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const parsed = broadcastSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'invalid broadcast payload', 400);

  const prisma = c.get('prisma');
  try {
    const result = await broadcast(prisma as any, { title: parsed.data.title, body: parsed.data.body, data: parsed.data.data ?? null });
    return c.json(result, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error sending broadcast notification', 500, err);
  }
});

export default router;
