import { Request, Response } from 'express';
import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { generateRequestId, sendErrorResponse } from '../utils/helper';
import { createNotification } from '../services/notification.service';

// Until `prisma generate` is run the generated client won't have .follow.
// Casting to `any` keeps code compilable; remove after migration + generate.
const db = prisma as any;

const normalizeParam = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

// ── followUser ────────────────────────────────────────────────
// POST /user/follow/:targetId

export const followUser = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const followerId = req.id;
  const followingId = normalizeParam(req.params.targetId);

  if (!followingId) {
    sendErrorResponse(res, requestId, 'target user id required', 400);
    return;
  }

  if (followerId === followingId) {
    sendErrorResponse(res, requestId, 'you cannot follow yourself', 400);
    return;
  }

  try {
    const target = await prisma.user.findUnique({
      where: { id: followingId },
      select: { id: true, name: true },
    });

    if (!target) {
      sendErrorResponse(res, requestId, 'user not found', 404);
      return;
    }

    await db.follow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    });

    logger.info(`[${requestId}] User followed`, { followerId, followingId });

    const follower = await prisma.user.findUnique({
      where: { id: followerId },
      select: { name: true },
    });

    void createNotification({
      userId: followingId,
      type: 'follow',
      title: 'New follower',
      body: `${follower?.name ?? 'Someone'} started following you`,
      data: { followerId, route: `/profile/${followerId}` },
      push: true,
    });

    res.status(200).json({ msg: 'following' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error following user`, {
      error: error.message,
      followerId,
      followingId,
    });
    sendErrorResponse(res, requestId, 'error following user', 500);
  }
};

// ── unfollowUser ──────────────────────────────────────────────
// DELETE /user/follow/:targetId

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const followerId = req.id;
  const followingId = normalizeParam(req.params.targetId);

  if (!followingId) {
    sendErrorResponse(res, requestId, 'target user id required', 400);
    return;
  }

  try {
    await db.follow.deleteMany({
      where: { followerId, followingId },
    });

    logger.info(`[${requestId}] User unfollowed`, { followerId, followingId });
    res.status(200).json({ msg: 'unfollowed' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error unfollowing user`, { error: error.message });
    sendErrorResponse(res, requestId, 'error unfollowing user', 500);
  }
};

// ── getFollowers ──────────────────────────────────────────────
// GET /user/:userId/followers?page=1

export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = normalizeParam(req.params.userId);

  if (!userId) {
    sendErrorResponse(res, requestId, 'user id required', 400);
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = 30;
  const skip = (page - 1) * limit;

  try {
    const [rows, total] = await Promise.all([
      db.follow.findMany({
        where: { followingId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          follower: {
            select: {
              id: true,
              name: true,
              profileAvatar: true,
              collegeName: true,
              bio: true,
            },
          },
          createdAt: true,
        },
      }),
      db.follow.count({ where: { followingId: userId } }),
    ]);

    res.status(200).json({
      msg: 'followers fetched',
      followers: rows.map((r: any) => ({ ...r.follower, followedAt: r.createdAt })),
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching followers`, { error: error.message, userId });
    sendErrorResponse(res, requestId, 'error fetching followers', 500);
  }
};

// ── getFollowing ──────────────────────────────────────────────
// GET /user/:userId/following?page=1

export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = normalizeParam(req.params.userId);

  if (!userId) {
    sendErrorResponse(res, requestId, 'user id required', 400);
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = 30;
  const skip = (page - 1) * limit;

  try {
    const [rows, total] = await Promise.all([
      db.follow.findMany({
        where: { followerId: userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          following: {
            select: {
              id: true,
              name: true,
              profileAvatar: true,
              collegeName: true,
              bio: true,
            },
          },
          createdAt: true,
        },
      }),
      db.follow.count({ where: { followerId: userId } }),
    ]);

    res.status(200).json({
      msg: 'following fetched',
      following: rows.map((r: any) => ({ ...r.following, followedAt: r.createdAt })),
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching following`, { error: error.message, userId });
    sendErrorResponse(res, requestId, 'error fetching following', 500);
  }
};

// ── getFollowStatus ───────────────────────────────────────────
// GET /user/follow/status/:targetId

export const getFollowStatus = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const followerId = req.id;
  const followingId = normalizeParam(req.params.targetId);

  if (!followingId) {
    sendErrorResponse(res, requestId, 'target user id required', 400);
    return;
  }

  try {
    const row = await db.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } },
      select: { createdAt: true },
    });

    res.status(200).json({ isFollowing: !!row, since: row?.createdAt ?? null });
  } catch (error: any) {
    logger.error(`[${requestId}] Error checking follow status`, { error: error.message });
    sendErrorResponse(res, requestId, 'error checking follow status', 500);
  }
};

// ── getFollowFeed ─────────────────────────────────────────────
// GET /user/feed?page=1 — posts from followed users, newest first

export const getFollowFeed = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const userId = req.id;
  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const follows: Array<{ followingId: string }> = await db.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true },
    });

    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      res.status(200).json({
        msg: 'follow some people to see their posts here',
        posts: [],
        total: 0,
        totalPages: 0,
        page,
      });
      return;
    }

    const postModel = prisma as any;

    const [posts, total] = await Promise.all([
      postModel.createPost.findMany({
        where: { authorId: { in: followingIds }, published: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          description: true,
          image: true,
          clubName: true,
          collegeName: true,
          authorId: true,
          createdAt: true,
          author: {
            select: { id: true, name: true, profileAvatar: true },
          },
          upvotes: true,
          downvotes: true,
        },
      }),
      postModel.createPost.count({
        where: { authorId: { in: followingIds }, published: true },
      }),
    ]);

    res.status(200).json({
      msg: 'feed fetched',
      posts,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching follow feed`, { error: error.message, userId });
    sendErrorResponse(res, requestId, 'error fetching feed', 500);
  }
};
