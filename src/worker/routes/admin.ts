import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { generateRequestId, jsonError } from '../utils/response';

const router = new Hono<HonoEnv>();

// ── Inline admin check (re-used locally) ─────────────────────

const isAdmin = async (userId: string, adminEmails: string, prisma: any): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) return false;
  const emails = [
    'zynvosocial@gmail.com', 'rishirajnatj@gmail.com',
    ...(adminEmails ?? '').split(',').map((e: string) => e.trim()).filter(Boolean),
  ].map((e: string) => e.toLowerCase());
  return emails.includes(user.email.toLowerCase());
};

// ── DELETE /clubs/:clubId/members — remove member ─────────────

router.delete('/clubs/:clubId/members', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const id = c.get('userId');
  const clubId = c.req.param('clubId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { member } = body;
  if (!member || typeof member !== 'string') return jsonError(c, requestId, 'member id is required', 400);
  if (!clubId) return jsonError(c, requestId, 'clubId is required', 400);

  const prisma = c.get('prisma') as any;
  try {
    const userEmail = await prisma.user.findUnique({ where: { id }, select: { email: true } });
    if (!userEmail) return jsonError(c, requestId, 'unauthorized id', 404);

    const founder = await prisma.clubs.findUnique({ where: { id: clubId, founderEmail: userEmail.email } });
    if (!founder) return jsonError(c, requestId, "You're not the club president", 403);

    await prisma.userClubMembership.delete({
      where: { userId_clubId: { userId: member, clubId } },
    });
    await prisma.user.update({
      where: { id: member },
      data: { clubId: null, clubName: null },
      select: { id: true },
    });

    return c.json({ msg: 'member removed' }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return jsonError(c, requestId, 'member not found', 404);
    return jsonError(c, requestId, 'internal server error', 500, err);
  }
});

// ── GET /users — list all users (admin only) ──────────────────

router.get('/users', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  const prisma = c.get('prisma') as any;
  if (!(await isAdmin(userId, c.env.ADMIN_EMAILS, prisma))) {
    return jsonError(c, requestId, 'Access denied', 403);
  }
  const page = Math.max(1, parseInt(c.req.query('page') ?? '1') || 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, email: true, collegeName: true, clubName: true, createdAt: true, isVerified: true } }),
    prisma.user.count(),
  ]);
  return c.json({ users, total, totalPages: Math.ceil(total / limit), page }, 200);
});

// ── DELETE /users/:userId — delete any user (admin only) ──────

router.delete('/users/:userId', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const adminId = c.get('userId');
  const targetId = c.req.param('userId');
  const prisma = c.get('prisma') as any;
  if (!(await isAdmin(adminId, c.env.ADMIN_EMAILS, prisma))) {
    return jsonError(c, requestId, 'Access denied', 403);
  }
  try {
    await prisma.$transaction(async (tx: any) => {
      await tx.team.deleteMany({ where: { createdById: targetId } });
      await tx.teamMember.deleteMany({ where: { userId: targetId } });
      await tx.userEvents.deleteMany({ where: { userId: targetId } });
      await tx.registrationAnswer.deleteMany({ where: { userId: targetId } });
      await tx.eventQueue.deleteMany({ where: { userId: targetId } });
      await tx.postUpvote.deleteMany({ where: { userId: targetId } });
      await tx.postDownvote.deleteMany({ where: { userId: targetId } });
      await tx.deviceToken.deleteMany({ where: { userId: targetId } });
      await tx.notification.deleteMany({ where: { userId: targetId } });
      await tx.wave.deleteMany({ where: { OR: [{ senderId: targetId }, { receiverId: targetId }] } });
      await tx.createPost.deleteMany({ where: { authorId: targetId } });
      await tx.user.delete({ where: { id: targetId } });
    });
    return c.json({ success: true }, 200);
  } catch (err: any) {
    if (err.code === 'P2025') return c.json({ success: true }, 200);
    return jsonError(c, requestId, 'Internal server error', 500);
  }
});

export default router;
