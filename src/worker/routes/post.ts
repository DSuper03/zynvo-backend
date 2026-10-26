import { Hono } from 'hono';
import { z } from 'zod';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import { createNotification, sendToMany, notifyFollowersOfNewPost } from '../utils/notification';
import type { FcmConfig } from '../fcm';

const router = new Hono<HonoEnv>();

const postSchema = z.object({ title: z.string().min(1), description: z.string().min(1) });

const postSelectBase = {
  id: true, title: true, description: true, collegeId: true, collegeName: true,
  clubName: true, authorId: true, image: true, published: true, mentionedUserIds: true,
  createdAt: true, updatedAt: true,
} as const;

const getFcmCfg = (c: any): FcmConfig => ({
  projectId: c.env.FIREBASE_PROJECT_ID,
  clientEmail: c.env.FIREBASE_CLIENT_EMAIL,
  privateKey: c.env.FIREBASE_PRIVATE_KEY,
});

// ── POST /create ──────────────────────────────────────────────

router.post('/create', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'wrong format for your posts', 500);

  const { collegeName, clubName, image, mentionedUserIds, clubId } = body;
  const prisma = c.get('prisma') as any;

  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
    if (!user) return jsonError(c, requestId, 'no such user found', 404);

    let club: { collegeId: string; name: string } | null = null;
    if (clubId && typeof clubId === 'string') {
      const membership = await prisma.userClubMembership.findUnique({ where: { userId_clubId: { userId, clubId } } });
      if (!membership) return jsonError(c, requestId, 'you are not a member of this club', 403);
      club = await prisma.clubs.findUnique({ where: { id: clubId }, select: { collegeId: true, name: true } });
      if (!club) return jsonError(c, requestId, 'no club found', 404);
    }

    const post = await prisma.createPost.create({
      data: {
        title: parsed.data.title, description: parsed.data.description,
        collegeId: club?.collegeId, collegeName,
        clubName: club?.name || clubName, authorId: userId, image,
        published: true,
        mentionedUserIds: Array.isArray(mentionedUserIds) ? mentionedUserIds : [],
      },
      select: { id: true },
    });

    const fcmCfg = getFcmCfg(c);

    const validMentions: string[] = Array.isArray(mentionedUserIds)
      ? mentionedUserIds.filter((id: any) => typeof id === 'string' && id !== userId)
      : [];

    if (validMentions.length > 0) {
      void sendToMany(prisma, fcmCfg, {
        userIds: validMentions, type: 'mention',
        message: {
          title: 'You were mentioned in a post',
          body: `${user.name ?? 'Someone'} mentioned you: "${parsed.data.title}"`,
          data: { postId: post.id, route: `/post/${post.id}` },
        },
        push: true,
      });
    }

    void notifyFollowersOfNewPost(prisma, fcmCfg, {
      authorId: userId, postId: post.id,
      title: parsed.data.title, description: parsed.data.description,
      authorName: user.name, image: image ?? null,
    });

    return c.json({ msg: 'post created', id: post.id }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] createPost error`, { error: err.message });
    return jsonError(c, requestId, 'error creating post', 500);
  }
});

// ── PUT /edit/:id ─────────────────────────────────────────────

router.put('/edit/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const postId = c.req.param('id');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'incorrect format', 400);
  const prisma = c.get('prisma') as any;
  await prisma.createPost.update({
    where: { id: postId },
    data: {
      title: parsed.data.title, description: parsed.data.description,
      ...(Array.isArray(body.mentionedUserIds) ? { mentionedUserIds: body.mentionedUserIds } : {}),
    },
    select: { id: true },
  });
  return c.json({ msg: 'post updated, changes will reflect shortly' }, 200);
});

// ── GET /all ──────────────────────────────────────────────────

router.get('/all', async (c) => {
  const requestId = generateRequestId();
  const page = parseInt(c.req.query('page') ?? '1') || 1;
  const limit = 30;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  try {
    const [posts, totalData] = await Promise.all([
      prisma.createPost.findMany({
        skip, take: limit, orderBy: { createdAt: 'desc' },
        select: { ...postSelectBase, author: { select: { profileAvatar: true, name: true } }, upvotes: true, downvotes: true },
      }),
      prisma.createPost.count(),
    ]);
    if (!posts || posts.length === 0) return c.json({ msg: 'not enough posts to show' }, 200);
    return c.json({ msg: 'fetched', posts, totalPages: Math.ceil(totalData / limit) }, 200);
  } catch (err: any) {
    return jsonError(c, requestId, 'error getting posts', 500, err);
  }
});

// ── GET /get/:id ──────────────────────────────────────────────

router.get('/get/:id', async (c) => {
  const requestId = generateRequestId();
  const postId = c.req.param('id');
  const prisma = c.get('prisma') as any;
  const post = await prisma.createPost.findUnique({ where: { id: postId }, select: postSelectBase });
  if (!post) return c.json({ msg: 'no such post found' }, 200);
  return c.json({ msg: 'post fetched', response: post }, 200);
});

// ── DELETE /delete/:id ────────────────────────────────────────

router.delete('/delete/:id', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const postId = c.req.param('id');
  const prisma = c.get('prisma') as any;
  try {
    await prisma.createPost.delete({ where: { id: postId }, select: { id: true } });
    return c.json({ msg: 'post deleted' }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return jsonError(c, requestId, 'no such post found', 404);
    return jsonError(c, requestId, 'error deleting post', 500, err);
  }
});

// ── POST /upvote/:id ──────────────────────────────────────────

router.post('/upvote/:id', authMiddleware, async (c) => {
  const postId = c.req.param('id');
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.postUpvote.findUnique({ where: { postId_userId: { postId, userId } } });
    if (existing) {
      const [, upvoteCount, downvoteCount] = await prisma.$transaction([
        prisma.postUpvote.delete({ where: { postId_userId: { postId, userId } } }),
        prisma.postUpvote.count({ where: { postId } }),
        prisma.postDownvote.count({ where: { postId } }),
      ]);
      return c.json({ msg: 'upvote removed', upvoteCount, downvoteCount }, 200);
    }
    const result = await prisma.$transaction(async (tx: any) => {
      await tx.postDownvote.deleteMany({ where: { postId, userId } });
      await tx.postUpvote.create({ data: { postId, userId } });
      const upvoteCount = await tx.postUpvote.count({ where: { postId } });
      const downvotesCount = await tx.postDownvote.count({ where: { postId } });
      return { upvoteCount, downvotesCount };
    });
    return c.json({ msg: 'upvote added', upvoteCount: result.upvoteCount, downvoteCount: result.downvotesCount }, 200);
  } catch (err: any) {
    return c.json({ msg: 'internal server error' }, 500);
  }
});

// ── POST /downvote/:id ────────────────────────────────────────

router.post('/downvote/:id', authMiddleware, async (c) => {
  const postId = c.req.param('id');
  const userId = c.get('userId');
  const prisma = c.get('prisma');
  try {
    const existing = await prisma.postDownvote.findUnique({ where: { postId_userId: { postId, userId } } });
    if (existing) {
      const [, upvoteCount, downvoteCount] = await prisma.$transaction([
        prisma.postDownvote.delete({ where: { postId_userId: { postId, userId } } }),
        prisma.postUpvote.count({ where: { postId } }),
        prisma.postDownvote.count({ where: { postId } }),
      ]);
      return c.json({ msg: 'downvote removed', upvoteCount, downvoteCount }, 200);
    }
    const result = await prisma.$transaction(async (tx: any) => {
      await tx.postUpvote.deleteMany({ where: { postId, userId } });
      await tx.postDownvote.create({ data: { postId, userId } });
      const upvoteCount = await tx.postUpvote.count({ where: { postId } });
      const downvoteCount = await tx.postDownvote.count({ where: { postId } });
      return { upvoteCount, downvoteCount };
    });
    return c.json({ msg: 'downvote added', upvoteCount: result.upvoteCount, downvoteCount: result.downvoteCount }, 200);
  } catch {
    return c.json({ msg: 'internal server error' }, 500);
  }
});

// ── GET /getUpvotes/:id / getDownvotes/:id ────────────────────

router.get('/getUpvotes/:id', authMiddleware, async (c) => {
  const postId = c.req.param('id');
  const prisma = c.get('prisma');
  const upvotes = await prisma.postUpvote.findMany({ where: { postId }, select: { userId: true } });
  return c.json({ msg: 'upvotes fetched', upvotes: upvotes.map((u) => u.userId) }, 200);
});

router.get('/getDownvotes/:id', authMiddleware, async (c) => {
  const postId = c.req.param('id');
  const prisma = c.get('prisma');
  const downvotes = await prisma.postDownvote.findMany({ where: { postId }, select: { userId: true } });
  return c.json({ msg: 'downvotes fetched', downvotes: downvotes.map((d) => d.userId) }, 200);
});

// ── Comments ──────────────────────────────────────────────────

const createCommentSchema = z.object({
  content: z.string().trim().min(1).max(1000),
  parentId: z.string().optional(),
});

const commentSelect = {
  id: true, content: true, isDeleted: true, parentId: true, createdAt: true, updatedAt: true,
  author: { select: { id: true, name: true, profileAvatar: true } },
};

router.get('/:postId/comments/count', async (c) => {
  const postId = c.req.param('postId');
  const prisma = c.get('prisma') as any;
  const count = await prisma.postComment.count({ where: { postId, isDeleted: false } });
  return c.json({ msg: 'count fetched', count }, 200);
});

router.get('/:postId/comments', async (c) => {
  const postId = c.req.param('postId');
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const prisma = c.get('prisma') as any;
  const [comments, total] = await Promise.all([
    prisma.postComment.findMany({
      where: { postId, parentId: null, isDeleted: false },
      orderBy: { createdAt: 'asc' }, skip, take: limit,
      select: { ...commentSelect, replies: { where: { isDeleted: false }, orderBy: { createdAt: 'asc' }, select: commentSelect } },
    }),
    prisma.postComment.count({ where: { postId, parentId: null, isDeleted: false } }),
  ]);
  return c.json({ msg: 'comments fetched', comments, total, totalPages: Math.ceil(total / limit), page }, 200);
});

router.post('/:postId/comments', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const postId = c.req.param('postId');
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const parsed = createCommentSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, parsed.error.errors[0]?.message ?? 'invalid input', 400);
  const { content, parentId } = parsed.data;
  const prisma = c.get('prisma') as any;
  const fcmCfg = getFcmCfg(c);
  try {
    const post = await prisma.createPost.findUnique({ where: { id: postId }, select: { id: true, authorId: true, title: true } });
    if (!post) return jsonError(c, requestId, 'post not found', 404);
    if (parentId) {
      const parent = await prisma.postComment.findUnique({ where: { id: parentId }, select: { id: true, postId: true, authorId: true } });
      if (!parent || parent.postId !== postId) return jsonError(c, requestId, 'parent comment not found', 404);
    }
    const comment = await prisma.postComment.create({
      data: { postId, authorId: userId, content, parentId: parentId ?? null },
      select: commentSelect,
    });
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
    const snippet = content.length > 120 ? `${content.slice(0, 117)}...` : content;
    const commenterName = user?.name?.trim() || 'Someone';
    if (post.authorId !== userId) {
      void createNotification(prisma, fcmCfg, {
        userId: post.authorId, type: 'comment',
        title: 'New comment on your post',
        body: `${commenterName} commented on "${post.title}": "${snippet}"`,
        data: { postId, commentId: comment.id, route: `/post/${postId}` }, push: true,
      });
    }
    return c.json({ msg: 'comment added', comment }, 201);
  } catch (err: any) {
    return jsonError(c, requestId, 'error adding comment', 500, err);
  }
});

router.delete('/comments/:commentId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const commentId = c.req.param('commentId');
  const userId = c.get('userId');
  const prisma = c.get('prisma') as any;
  const comment = await prisma.postComment.findUnique({ where: { id: commentId }, select: { id: true, authorId: true } });
  if (!comment) return jsonError(c, requestId, 'comment not found', 404);
  if (comment.authorId !== userId) return jsonError(c, requestId, 'not authorised', 403);
  await prisma.postComment.updateMany({ where: { OR: [{ id: commentId }, { parentId: commentId }] }, data: { isDeleted: true } });
  return c.json({ msg: 'comment deleted' }, 200);
});

router.post('/comments/:commentId/report', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const commentId = c.req.param('commentId');
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }
  const reason = body?.reason;
  if (!reason) return jsonError(c, requestId, 'reason is required', 400);
  const prisma = c.get('prisma') as any;
  try {
    const comment = await prisma.postComment.findUnique({ where: { id: commentId }, select: { id: true } });
    if (!comment) return jsonError(c, requestId, 'comment not found', 404);
    await prisma.commentReport.create({ data: { commentId, reporterId: userId, reason } });
    return c.json({ msg: 'comment reported' }, 200);
  } catch (err: any) {
    if (err.code === 'P2002') return c.json({ msg: 'you already reported this comment' }, 409);
    return jsonError(c, requestId, 'error reporting comment', 500, err);
  }
});

export default router;
