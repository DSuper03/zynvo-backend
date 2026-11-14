import { Hono, type Handler } from 'hono';
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

// ── POST /:userId, POST /:userId/wave ─────────────────────────
// /:userId/wave is the Express path the mobile app calls.

const waveHandler: Handler<HonoEnv> = async (c) => {
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

    // A user who blocked the sender (or was blocked by them) gets no waves.
    const blocked = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockerId: receiverId, blockedId: senderId },
          { blockerId: senderId, blockedId: receiverId },
        ],
      },
      select: { blockerId: true },
    });
    if (blocked) return jsonError(c, requestId, 'You cannot wave at this user.', 403);

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
};

router.post('/:userId', authMiddleware, waveHandler);
router.post('/:userId/wave', authMiddleware, waveHandler);

// ── POST/DELETE /:userId/block ────────────────────────────────
// Blocking is idempotent and also drops any follow between the two users.

router.post('/:userId/block', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const blockerId = c.get('userId');
  const blockedId = c.req.param('userId');
  if (!blockedId) return jsonError(c, requestId, 'userId is required', 400);
  if (blockerId === blockedId) return jsonError(c, requestId, 'You cannot block yourself.', 400);

  const prisma = c.get('prisma');
  try {
    const target = await prisma.user.findUnique({ where: { id: blockedId }, select: { id: true } });
    if (!target) return jsonError(c, requestId, 'User not found.', 404);

    await prisma.$transaction([
      prisma.userBlock.upsert({
        where: { blockerId_blockedId: { blockerId, blockedId } },
        create: { blockerId, blockedId },
        update: {},
      }),
      prisma.follow.deleteMany({
        where: {
          OR: [
            { followerId: blockerId, followingId: blockedId },
            { followerId: blockedId, followingId: blockerId },
          ],
        },
      }),
    ]);
    return c.json({ msg: 'User blocked', blockedUserId: blockedId }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error.', 500, err);
  }
});

router.delete('/:userId/block', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const blockedId = c.req.param('userId');
  if (!blockedId) return jsonError(c, requestId, 'userId is required', 400);

  const prisma = c.get('prisma');
  try {
    await prisma.userBlock.deleteMany({ where: { blockerId: c.get('userId'), blockedId } });
    return c.json({ msg: 'User unblocked' }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'Internal server error.', 500, err);
  }
});

export default router;
