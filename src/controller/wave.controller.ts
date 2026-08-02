import { Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger';
import { generateRequestId } from '../utils/helper';
import { sendWave, WaveError } from '../services/wave.service';


const waveParamsSchema = z.object({
  userId: z.string().min(1, 'userId is required'),
});

export const waveUser = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const senderId = req.id;

  const parsed = waveParamsSchema.safeParse(req.params);
  if (!parsed.success) {
    logger.warn(`[${requestId}] Invalid wave params`, {
      error: parsed.error.message,
      senderId,
    });
    res.status(400).json({
      success: false,
      message: parsed.error.errors[0]?.message ?? 'Invalid request.',
    });
    return;
  }

  const receiverId = parsed.data.userId;

  try {
    const result = await sendWave(senderId, receiverId);

    logger.info(`[${requestId}] Wave sent`, {
      senderId: result.senderId,
      receiverId: result.receiverId,
      tokens: result.tokensCount,
      sent: result.successCount,
      failed: result.failureCount,
    });

    if (!result.hasRegisteredDevices) {
      res
        .status(200)
        .json({ success: true, message: 'User has no registered devices.' });
      return;
    }

    res.status(200).json({ success: true, message: 'Wave sent successfully.' });
  } catch (error) {
    if (error instanceof WaveError) {
      logger.warn(`[${requestId}] Wave request rejected`, {
        senderId,
        receiverId,
        status: error.status,
        reason: error.message,
      });
      res.status(error.status).json({ success: false, message: error.message });
      return;
    }

    logger.error(`[${requestId}] Error sending wave`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      senderId,
      receiverId,
    });
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};
