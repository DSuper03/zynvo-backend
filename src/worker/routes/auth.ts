import { Hono, type Handler } from 'hono';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/ratelimit';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

// ── Schemas ───────────────────────────────────────────────────

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().min(1),
  phone: z.string().optional(),
});

const newPWschema = z.object({ password: z.string().min(1) });

// ── POST /signup ──────────────────────────────────────────────

router.post('/signup', rateLimiter(20), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) return jsonError(c, requestId, 'incorrect inputs', 411);

  const { email, password, name, phone } = parsed.data;
  const { collegeName, avatarUrl } = body;
  const prisma = c.get('prisma');

  try {
    const existing = await prisma.user.findUnique({
      where: { email },
      select: { id: true, isVerified: true },
    });

    if (existing) {
      if (!existing.isVerified) return jsonError(c, requestId, 'please verify yourself', 400);
      return jsonError(c, requestId, 'User already exists, please login', 409);
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        collegeName: collegeName ?? 'not joined',
        profileAvatar: avatarUrl,
        phone: phone ?? '',
        isVerified: true, // frontend handles verification
        ValidFor: 86400000,
      },
      select: { id: true, profileAvatar: true, name: true },
    });

    const token = await sign(
      { id: newUser.id, email, pfp: newUser.profileAvatar, name: newUser.name },
      c.env.JWT_SECRET,
    );

    return c.json({ msg: 'account created', token }, 200);
  } catch (err: any) {
    if (err?.code === 'P2002') return jsonError(c, requestId, 'an account with this email already exists', 409);
    logger.error(`[${requestId}] signup error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

// ── POST /login (password fallback) ──────────────────────────

router.post('/password-login', rateLimiter(30), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { email, password } = body;
  if (!email || !password) return jsonError(c, requestId, 'Email and password are required', 400);

  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, isVerified: true, profileAvatar: true, name: true },
    });

    if (!user) return jsonError(c, requestId, 'Invalid email or password', 404);
    if (!user.isVerified) return jsonError(c, requestId, 'please verify yourself', 403);

    let matches = bcrypt.compareSync(password, user.password);
    // Legacy plaintext fallback
    let needsRehash = false;
    if (!matches && password === user.password) { matches = true; needsRehash = true; }

    if (!matches) return jsonError(c, requestId, 'Invalid email or password', 403);

    if (needsRehash) {
      await prisma.user.update({ where: { id: user.id }, data: { password: bcrypt.hashSync(password, 10) } });
    }

    const token = await sign(
      { id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name },
      c.env.JWT_SECRET,
    );
    return c.json({ msg: 'login success', token }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] login error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

// ── POST /login (Clerk-aware — primary login route) ───────────

const loginHandler: Handler<HonoEnv> = async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { email, name, clerkId, collegeName, avatarUrl, imgUrl, password } = body;
  const prisma = c.get('prisma');

  // No clerkId → fall back to password login
  if (!clerkId) {
    if (!email || !password) return jsonError(c, requestId, 'Email and password are required', 400);
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, isVerified: true, profileAvatar: true, name: true },
    });
    if (!user) return jsonError(c, requestId, 'Invalid email or password', 404);
    if (!user.isVerified) return jsonError(c, requestId, 'please verify yourself', 403);
    if (!bcrypt.compareSync(password, user.password)) return jsonError(c, requestId, 'Invalid email or password', 403);
    const token = await sign({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
    return c.json({ msg: 'login success', token }, 200);
  }

  if (!email) return jsonError(c, requestId, 'Missing required fields', 400);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return jsonError(c, requestId, 'Invalid email format', 400);

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user && !collegeName) {
      return jsonError(c, requestId, 'No account found with this email. Please sign up first.', 404);
    }

    if (user) {
      const updateData: Record<string, unknown> = {};
      if (!user.clerkId) updateData.clerkId = clerkId;
      if (collegeName && !['not joined', 'not_joined', 'zync college'].includes(collegeName)) updateData.collegeName = collegeName;
      if (name && name !== user.name) updateData.name = name;
      const pfp = avatarUrl || imgUrl;
      if (pfp && pfp !== user.profileAvatar) updateData.profileAvatar = pfp;
      if (Object.keys(updateData).length > 0) {
        user = await prisma.user.update({ where: { email }, data: updateData });
      }
    } else {
      user = await prisma.user.create({
        data: {
          email, clerkId, name: name || 'New User', collegeName,
          profileAvatar: avatarUrl || imgUrl,
          password: password ? bcrypt.hashSync(password, 10) : '',
          isVerified: true, ValidFor: 86400000,
        },
      });
    }

    const token = await sign({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
    return c.json({ msg: 'login success', token }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] clerkLogin error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
};

router.post('/login', rateLimiter(30), loginHandler);

// ── POST /clerkLogin ──────────────────────────────────────────
// Alias kept for frontend compatibility. Shares the /login handler: a redirect
// breaks behind the Next.js proxy, which cannot replay a streamed POST body.

router.post('/clerkLogin', rateLimiter(30), loginHandler);

// ── POST /checkUserExists ─────────────────────────────────────

router.post('/checkUserExists', async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { email } = body;
  if (!email) return jsonError(c, requestId, 'Email is required', 400);

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, collegeName: true },
  });

  if (!user) return c.json({ exists: false, hasCollege: false }, 200);

  const placeholders = ['not joined', 'not_joined', 'zync college', 'n/a', 'na', 'none', '', 'null', 'undefined'];
  const hasCollege = !!user.collegeName && !placeholders.includes(user.collegeName.trim().toLowerCase());
  return c.json({ exists: true, hasCollege }, 200);
});

// ── POST /syncWithClerk ───────────────────────────────────────

router.post('/syncWithClerk', rateLimiter(20), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { email, password } = body;
  if (!email || !password) return jsonError(c, requestId, 'Email and password are required', 400);

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true, name: true, clerkId: true, isVerified: true, profileAvatar: true },
  });

  if (!user) return jsonError(c, requestId, 'No account found with this email.', 404);
  if (!user.isVerified) return jsonError(c, requestId, 'Please verify your email first', 403);

  let matches = bcrypt.compareSync(password, user.password);
  if (!matches && password === user.password) {
    matches = true;
    await prisma.user.update({ where: { id: user.id }, data: { password: bcrypt.hashSync(password, 10) } });
  }
  if (!matches) return jsonError(c, requestId, 'Invalid email or password', 403);

  const token = await sign({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
  return c.json({ msg: 'login success', token }, 200);
});

// ── POST /verify ──────────────────────────────────────────────

router.post('/verify', async (c) => {
  const requestId = generateRequestId();
  const vToken = c.req.query('vToken');
  if (!vToken) return jsonError(c, requestId, 'bad response, invalid token', 404);

  const prisma = c.get('prisma');
  const user = await prisma.user.findFirst({
    where: { vToken },
    select: { id: true, expiryToken: true, ValidFor: true },
  });

  if (!user) return jsonError(c, requestId, 'no user found, Invalid token', 400);

  const expTime = user.expiryToken as number;
  const currentTime = Math.floor(Date.now() / 1000);
  const validFor = user.ValidFor as number;

  if (currentTime - expTime > validFor / 1000) return jsonError(c, requestId, 'expired', 400);

  const verified = await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true },
    select: { id: true, isVerified: true },
  });

  const token = await sign({ id: verified.id, isVerified: verified.isVerified }, c.env.JWT_SECRET);
  return c.json({ msg: 'Verified successfully', token }, 200);
});

// ── PUT /reset-password ───────────────────────────────────────

router.put('/reset-password', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { password, newPassword } = body;
  if (!password || !newPassword) return jsonError(c, requestId, 'invalid password format', 400);

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, password: true } });
  if (!user) return jsonError(c, requestId, 'invalid user', 404);

  if (!bcrypt.compareSync(password, user.password)) return jsonError(c, requestId, 'Current password is incorrect', 403);

  await prisma.user.update({ where: { id: user.id }, data: { password: bcrypt.hashSync(newPassword, 10) } });
  return c.json({ msg: 'password updated successfully' }, 200);
});

export default router;
