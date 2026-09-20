import { Request, Response } from 'express';
import { prisma } from '../db/db';
import { logger } from '../utils/logger';
import { generateRequestId, sendErrorResponse } from '../utils/helper';
import { z } from 'zod';
import { createNotification } from '../services/notification.service';

// Until `prisma generate` is run with the updated schema the generated client
// won't have .postComment or .commentReport. Casting to `any` keeps the code
// compilable in the meantime; after the migration + generate these casts can
// be removed.
const db = prisma as any;

// Normalize Express params that can be string | string[]
const normalizeParam = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

// ── Validation schemas ────────────────────────────────────────

const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'content is required').max(1000, 'max 1000 chars'),
  parentId: z.string().optional(),
});

const reportCommentSchema = z.object({
  reason: z.string().trim().min(1, 'reason is required').max(500, 'max 500 chars'),
});

// ── Shared comment select ─────────────────────────────────────

const commentSelect = {
  id: true,
  content: true,
  isDeleted: true,
  parentId: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      id: true,
      name: true,
      profileAvatar: true,
    },
  },
};

// ── createComment ─────────────────────────────────────────────
// POST /post/:postId/comments
// Body: { content, parentId? }

export const createComment = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const postId = normalizeParam(req.params.postId);
  const userId = req.id;

  if (!postId) {
    sendErrorResponse(res, requestId, 'post id required', 400);
    return;
  }

  const parsed = createCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    sendErrorResponse(res, requestId, parsed.error.errors[0]?.message ?? 'invalid input', 400);
    return;
  }

  const { content, parentId } = parsed.data;

  try {
    // Verify post exists
    const post = await (prisma as any).createPost.findUnique({
      where: { id: postId },
      select: { id: true, authorId: true, title: true },
    });

    if (!post) {
      sendErrorResponse(res, requestId, 'post not found', 404);
      return;
    }

    // If replying, verify parent comment belongs to this post
    if (parentId) {
      const parent = await db.postComment.findUnique({
        where: { id: parentId },
        select: { id: true, postId: true, authorId: true },
      });
      if (!parent || parent.postId !== postId) {
        sendErrorResponse(res, requestId, 'parent comment not found on this post', 404);
        return;
      }
    }

    const comment = await db.postComment.create({
      data: { postId, authorId: userId, content, parentId: parentId ?? null },
      select: commentSelect,
    });

    logger.info(`[${requestId}] Comment created`, { commentId: comment.id, postId, userId });

    // Notify post author (skip self-comment)
    if (post.authorId !== userId) {
      const commenter = await prisma.user.findUnique({
        where: { id: userId },
        select: { name: true },
      });

      void createNotification({
        userId: post.authorId,
        type: 'comment',
        title: 'New comment on your post',
        body: `${commenter?.name ?? 'Someone'} commented on "${post.title}"`,
        data: { postId, commentId: comment.id, route: `/post/${postId}` },
      });
    }

    // Notify parent comment author on reply
    if (parentId) {
      const parent = await db.postComment.findUnique({
        where: { id: parentId },
        select: { authorId: true },
      });

      if (parent && parent.authorId !== userId && parent.authorId !== post.authorId) {
        const commenter = await prisma.user.findUnique({
          where: { id: userId },
          select: { name: true },
        });

        void createNotification({
          userId: parent.authorId,
          type: 'comment_reply',
          title: 'Someone replied to your comment',
          body: `${commenter?.name ?? 'Someone'} replied to your comment`,
          data: { postId, commentId: comment.id, route: `/post/${postId}` },
        });
      }
    }

    res.status(201).json({ msg: 'comment added', comment });
  } catch (error: any) {
    logger.error(`[${requestId}] Error creating comment`, { error: error.message, postId, userId });
    sendErrorResponse(res, requestId, 'error adding comment', 500);
  }
};

// ── getComments ───────────────────────────────────────────────
// GET /post/:postId/comments?page=1

export const getComments = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const postId = normalizeParam(req.params.postId);

  if (!postId) {
    sendErrorResponse(res, requestId, 'post id required', 400);
    return;
  }

  const page = Math.max(1, parseInt(req.query.page as string, 10) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  try {
    const [comments, total] = await Promise.all([
      db.postComment.findMany({
        where: { postId, parentId: null },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
        select: {
          ...commentSelect,
          replies: {
            where: { isDeleted: false },
            orderBy: { createdAt: 'asc' },
            select: commentSelect,
          },
        },
      }),
      db.postComment.count({ where: { postId, parentId: null } }),
    ]);

    res.status(200).json({
      msg: 'comments fetched',
      comments,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching comments`, { error: error.message, postId });
    sendErrorResponse(res, requestId, 'error fetching comments', 500);
  }
};

// ── deleteComment ─────────────────────────────────────────────
// DELETE /post/comments/:commentId  — soft-delete, preserves replies

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const commentId = normalizeParam(req.params.commentId);
  const userId = req.id;

  if (!commentId) {
    sendErrorResponse(res, requestId, 'comment id required', 400);
    return;
  }

  try {
    const comment = await db.postComment.findUnique({
      where: { id: commentId },
      select: { id: true, authorId: true },
    });

    if (!comment) {
      sendErrorResponse(res, requestId, 'comment not found', 404);
      return;
    }

    if (comment.authorId !== userId) {
      sendErrorResponse(res, requestId, 'not authorised to delete this comment', 403);
      return;
    }

    await db.postComment.update({
      where: { id: commentId },
      data: { isDeleted: true, content: '[deleted]' },
    });

    logger.info(`[${requestId}] Comment soft-deleted`, { commentId, userId });
    res.status(200).json({ msg: 'comment deleted' });
  } catch (error: any) {
    logger.error(`[${requestId}] Error deleting comment`, { error: error.message, commentId });
    sendErrorResponse(res, requestId, 'error deleting comment', 500);
  }
};

// ── reportComment ─────────────────────────────────────────────
// POST /post/comments/:commentId/report  Body: { reason }

export const reportComment = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const commentId = normalizeParam(req.params.commentId);
  const userId = req.id;

  if (!commentId) {
    sendErrorResponse(res, requestId, 'comment id required', 400);
    return;
  }

  const parsed = reportCommentSchema.safeParse(req.body);
  if (!parsed.success) {
    sendErrorResponse(res, requestId, parsed.error.errors[0]?.message ?? 'invalid input', 400);
    return;
  }

  try {
    const comment = await db.postComment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      sendErrorResponse(res, requestId, 'comment not found', 404);
      return;
    }

    await db.commentReport.create({
      data: { commentId, reporterId: userId, reason: parsed.data.reason },
    });

    logger.info(`[${requestId}] Comment reported`, { commentId, reporterId: userId });
    res.status(200).json({ msg: 'comment reported' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ msg: 'you already reported this comment' });
      return;
    }
    logger.error(`[${requestId}] Error reporting comment`, { error: error.message, commentId });
    sendErrorResponse(res, requestId, 'error reporting comment', 500);
  }
};

// ── getCommentCount ───────────────────────────────────────────
// GET /post/:postId/comments/count — lightweight count for feed cards

export const getCommentCount = async (req: Request, res: Response): Promise<void> => {
  const requestId = generateRequestId();
  const postId = normalizeParam(req.params.postId);

  if (!postId) {
    sendErrorResponse(res, requestId, 'post id required', 400);
    return;
  }

  try {
    const count = await db.postComment.count({
      where: { postId, isDeleted: false },
    });

    res.status(200).json({ msg: 'count fetched', count });
  } catch (error: any) {
    logger.error(`[${requestId}] Error fetching comment count`, { error: error.message, postId });
    sendErrorResponse(res, requestId, 'error fetching count', 500);
  }
};
