import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { sendToDeviceTokens } from '../utils/fcm';

// Minimum delay between two waves from the same sender to the same recipient.
const WAVE_RATE_LIMIT_MS = 30 * 60 * 1000;

/**
 * Domain error carrying an HTTP status so controllers can map it to the
 * right response without mixing business rules into the route layer.
 */
export class WaveError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'WaveError';
  }
}

export type SendWaveResult = {
  senderId: string;
  receiverId: string;
  tokensCount: number;
  successCount: number;
  failureCount: number;
  hasRegisteredDevices: boolean;
};

/**
 * Send a "wave" push from `senderId` to `receiverId`.
 *
 * Enforces the business rules in order:
 *   1. no self-waves,
 *   2. recipient must exist,
 *   3. one wave per sender -> receiver every 30 minutes,
 *   4. FCM push to every registered device, skipping (and pruning) bad tokens.
 *
 * The `Wave` row is used as the rate-limit clock: a fresh wave refreshes
 * `createdAt` instead of inserting a duplicate row (unique sender+receiver).
 */
export const sendWave = async (
  senderId: string,
  receiverId: string
): Promise<SendWaveResult> => {
  if (!senderId || !receiverId) {
    throw new WaveError(400, 'User id is required.');
  }

  if (senderId === receiverId) {
    throw new WaveError(400, 'You cannot wave at yourself.');
  }

  const [sender, recipient] = await Promise.all([
    prisma.user.findUnique({
      where: { id: senderId },
      select: { id: true, name: true },
    }),
    prisma.user.findUnique({
      where: { id: receiverId },
      select: {
        id: true,
        deviceTokens: { select: { id: true, token: true } },
      },
    }),
  ]);

  // Authenticated user no longer exists in our DB -> treat as unauthorized.
  if (!sender) {
    throw new WaveError(401, 'Sender not found.');
  }

  if (!recipient) {
    throw new WaveError(404, 'Recipient not found.');
  }

  // Rate limit: reject if the last wave for this pair is still inside the window.
  const existingWave = await prisma.wave.findUnique({
    where: { senderId_receiverId: { senderId, receiverId } },
    select: { createdAt: true },
  });

  const lastWaveAt = existingWave?.createdAt?.getTime() ?? 0;
  if (Date.now() - lastWaveAt < WAVE_RATE_LIMIT_MS) {
    throw new WaveError(429, 'You already waved recently.');
  }

  // Record the wave. A repeat wave just refreshes `createdAt` (resets the
  // rate-limit clock) thanks to the unique (senderId, receiverId) constraint.
  await prisma.wave.upsert({
    where: { senderId_receiverId: { senderId, receiverId } },
    create: { senderId, receiverId },
    update: { createdAt: new Date() },
  });

  const tokens = recipient.deviceTokens.map((dt) => dt.token);

  if (tokens.length === 0) {
    return {
      senderId,
      receiverId,
      tokensCount: 0,
      successCount: 0,
      failureCount: 0,
      hasRegisteredDevices: false,
    };
  }

  const senderName = sender.name?.trim() || 'Someone';

  const pushResult = await sendToDeviceTokens(
    tokens,
    {
      title: '👋 Someone waved at you!',
      body: `${senderName} waved at you.`,
    },
    {
      type: 'wave',
      senderId,
      receiverId,
      route: `/profile/${senderId}`,
    }
  );

  // Prune tokens FCM flagged as unregistered so future waves don't retry them.
  if (pushResult.invalidTokens.length > 0) {
    const cleanup = await prisma.deviceToken.deleteMany({
      where: { token: { in: pushResult.invalidTokens }, userId: receiverId },
    });
    logger.info('Removed stale FCM tokens after wave', {
      receiverId,
      removed: cleanup.count,
    });
  }

  return {
    senderId,
    receiverId,
    tokensCount: tokens.length,
    successCount: pushResult.successCount,
    failureCount: pushResult.failureCount,
    hasRegisteredDevices: true,
  };
};
