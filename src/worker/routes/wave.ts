import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import { sendToDeviceTokens, isFcmConfigured, type FcmConfig } from '../fcm';
import { createNotification } from '../utils/notification';

const router = new Hono<HonoEnv>();

const WAVE_RATE_LIMIT_MS = 30 * 60 * 1000;

const getFcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

// ── POST /:userId ─────────────────────────────────────────────

router.post('/:userId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const senderId = c.get('userId');
  const receiverId = c.req.param('userId');

  if (!receiverId) return jsonError(c, requestId, 'userId is required', 400);
  if (senderId === receiverId) return jsonError(c, requestId, 'You cannot wave at yourself.', 400);

  const prisma = c.get('prisma') as any;

  try {
    const [sender, recipient] = await Promise.all([
      prisma.user.findUnique({ where: { id: senderId }, select: { id: true, name: true } }),
      prisma.user.findUnique({ where: { id: receiverId }, select: { id: true, deviceTokens: { select: { id: true, token: true } } } }),
    ]);

    if (!sender) return jsonError(c, requestId, 'Sender not found.', 401);
    if (!recipient) return jsonError(c, requestId, 'Recipient not found.', 404);

    // Rate limit check
    const existingWave = await prisma.wave.findUnique({
      where: { senderId_receiverId: { senderId, receiverId } },
      select: { createdAt: true },
    });
    if (existingWave && Date.now() - existingWave.createdAt.getTime() < WAVE_RATE_LIMIT_MS) {
      return jsonError(c, requestId, 'You already waved recently.', 429);
    }

    // Upsert wave row (rate-limit clock)
    await prisma.wave.upsert({
      where: { senderId_receiverId: { senderId, receiverId } },
      create: { senderId, receiverId },
      update: { createdAt: new Date() },
    });

    const senderName = sender.name?.trim() || 'Someone';
    const fcmCfg = getFcmCfg(c);

    // Persist in-app notification (fire-and-forget)
    void createNotification(prisma, fcmCfg, {
      userId: receiverId, type: 'wave',
      title: '👋 Someone waved at you!', body: `${senderName} waved at you.`,
      data: { senderId, receiverId, route: `/profile/${senderId}` },
    });

    const tokens = recipient.deviceTokens.map((dt: any) => dt.token);
    if (tokens.length === 0) {
      return c.json({ success: true, message: 'User has no registered devices.' }, 200);
    }

    if (!isFcmConfigured(fcmCfg)) {
      return c.json({ success: true, message: 'Wave recorded. FCM not configured.' }, 200);
    }

    const pushResult = await sendToDeviceTokens(
      fcmCfg, tokens,
      { title: '👋 Someone waved at you!', body: `${senderName} waved at you.` },
      { type: 'wave', senderId, receiverId, route: `/profile/${senderId}` },
    );

    // Prune stale tokens
    if (pushResult.invalidTokens.length > 0) {
      void prisma.deviceToken.deleteMany({ where: { token: { in: pushResult.invalidTokens }, userId: receiverId } });
    }

    return c.json({ success: true, message: 'Wave sent successfully.' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] waveUser error`, { error: err.message, senderId, receiverId });
    return jsonError(c, requestId, 'Internal server error.', 500);
  }
});

export default router;
