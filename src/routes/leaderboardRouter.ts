import { rateLimit } from 'express-rate-limit';
import { Router } from 'express';
import { prisma } from '../db/db';
import {
  getLeaderboard,
  parseLeaderboardOptions,
} from '../worker/utils/leaderboard';
import { logger } from '../utils/logger';
import { leaderboardCacheSeconds } from '../worker/utils/leaderboard-cache';

export const leaderboardRouter = Router();
leaderboardRouter.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  next();
});
leaderboardRouter.get(
  '/',
  rateLimit({
    windowMs: 60_000,
    limit: 30,
    keyGenerator: (req) => {
      const trusted =
        process.env.INTERNAL_PROXY_SECRET &&
        req.get('x-internal-proxy-secret') ===
          process.env.INTERNAL_PROXY_SECRET;
      return (
        (trusted ? req.get('x-zynvo-client-ip') : undefined) ||
        req.ip ||
        'unknown'
      );
    },
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  }),
  async (req, res) => {
    let options;
    try {
      options = parseLeaderboardOptions(
        new URL(req.originalUrl, 'http://localhost').searchParams
      );
    } catch {
      res.status(400).json({ msg: 'Invalid leaderboard filters' });
      return;
    }
    try {
      const data = await getLeaderboard(prisma, options);
      const ttl = leaderboardCacheSeconds(
        options,
        new Date(data.generatedAt),
        new Date()
      );
      res.setHeader(
        'Cache-Control',
        ttl > 0 ? `public, max-age=0, s-maxage=${ttl}` : 'no-store'
      );
      res.json(data);
    } catch (error) {
      logger.error('Leaderboard query failed', {
        error: error instanceof Error ? error.name : 'UnknownError',
      });
      res
        .status(500)
        .json({ msg: 'Unable to load leaderboard. Please try again.' });
    }
  }
);
