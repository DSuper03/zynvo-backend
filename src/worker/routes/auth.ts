import { Hono, type Handler } from 'hono';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/ratelimit';
import { generateRequestId, jsonError } from '../utils/response';
import { logger } from '../logger';
import { sendMail } from '../mail';
import { getResendVerificationEmailHTML, getSignupVerificationEmailHTML } from '../emails/verification';
import { generateResetLinkEmailHtml } from '../emails/password';
import { verifyClerkSession, isClerkConfigured, setClerkPassword } from '../clerk';

const router = new Hono<HonoEnv>();

// Backend JWTs expire after 30 days; clients sign in again (or re-sync from
// their Clerk session) after that.
const TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;

const issueToken = (payload: Record<string, unknown>, secret: string) =>
  sign({ ...payload, exp: Math.floor(Date.now() / 1000) + TOKEN_TTL_SECONDS }, secret);

const MIN_PASSWORD_LENGTH = 8;

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
    const vToken = randomHex(20);

    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        collegeName: collegeName ?? 'not joined',
        profileAvatar: avatarUrl,
        phone: phone ?? '',
        // Unverified until the emailed link is opened (POST /verify).
        isVerified: false,
        vToken,
        expiryToken: Math.floor(Date.now() / 1000),
        ValidFor: 86400000,
      },
      select: { id: true, profileAvatar: true, name: true },
    });

    const url = `${appOrigin(c)}/verification-mail?token=${vToken}&email=${encodeURIComponent(email)}`;
    const sent = await sendMail(c.env, {
      to: email,
      subject: 'Verify your Zynvo account',
      html: getSignupVerificationEmailHTML(newUser.name ?? name, url),
    });
    if (!sent) logger.error(`[${requestId}] signup verification email failed`, { email });

    return c.json({ msg: 'account created', userId: newUser.id }, 200);
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

    if (!bcrypt.compareSync(password, user.password)) return jsonError(c, requestId, 'Invalid email or password', 403);

    const token = await issueToken(
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
    const token = await issueToken({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
    return c.json({ msg: 'login success', token }, 200);
  }

  if (!email) return jsonError(c, requestId, 'Missing required fields', 400);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return jsonError(c, requestId, 'Invalid email format', 400);

  // The body's email/clerkId are only trusted once the caller proves the Clerk
  // session behind them. Clients send `clerkToken` (Clerk getToken()); it must
  // be valid and the email must be one of that Clerk user's verified emails.
  let session: Awaited<ReturnType<typeof verifyClerkSession>> = null;
  if (body.clerkToken && isClerkConfigured(c.env)) {
    session = await verifyClerkSession(c.env, String(body.clerkToken));
    if (!session) return jsonError(c, requestId, 'Your session has expired. Please sign in again.', 401);
    if (!session.emails.includes(String(email).toLowerCase())) {
      return jsonError(c, requestId, 'This email does not belong to your account.', 403);
    }
  } else if (c.env.REQUIRE_CLERK_TOKEN === 'true') {
    return jsonError(c, requestId, 'Please update the app and sign in again.', 401);
  }
  const verifiedClerkId = session?.clerkId ?? clerkId;

  try {
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user && !collegeName) {
      return jsonError(c, requestId, 'No account found with this email. Please sign up first.', 404);
    }

    // Without a verified session (older app builds), only the Clerk account
    // already linked to this user may sign in as them.
    if (user && !session && user.clerkId !== clerkId) {
      return jsonError(c, requestId, 'Please update the app and sign in again.', 401);
    }

    if (user) {
      const updateData: Record<string, unknown> = {};
      if (user.clerkId !== verifiedClerkId) updateData.clerkId = verifiedClerkId;
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
          email, clerkId: verifiedClerkId, name: name || 'New User', collegeName,
          profileAvatar: avatarUrl || imgUrl,
          password: password ? bcrypt.hashSync(password, 10) : '',
          isVerified: true, ValidFor: 86400000,
        },
      });
    }

    const token = await issueToken({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
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

  if (!bcrypt.compareSync(password, user.password)) return jsonError(c, requestId, 'Invalid email or password', 403);

  const token = await issueToken({ id: user.id, email: user.email, pfp: user.profileAvatar, name: user.name }, c.env.JWT_SECRET);
  return c.json({ msg: 'login success', token }, 200);
});

const randomHex = (bytes: number): string =>
  Array.from(crypto.getRandomValues(new Uint8Array(bytes)), (b) => b.toString(16).padStart(2, '0')).join('');

const appOrigin = (c: { env: { FE_URL: string } }) =>
  (c.env.FE_URL || 'https://www.zynvosocial.com').replace(/\/$/, '');

// ── POST /forgot ──────────────────────────────────────────────
// Emails a one-time reset link valid for 30 minutes.

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

const sha256Hex = async (value: string): Promise<string> => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
};

router.post('/forgot', rateLimiter(5), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  if (!email) return jsonError(c, requestId, 'Email is required', 400);

  const prisma = c.get('prisma');
  try {
    // Same answer whether or not the account exists, so this can't be used to
    // probe for registered emails. The password only changes once the owner
    // opens the link (POST /reset-password/confirm).
    const generic = c.json({ msg: 'If an account exists for this email, we sent a reset link.' }, 200);
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true } });
    if (!user) return generic;

    const resetToken = randomHex(32);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetTokenHash: await sha256Hex(resetToken),
        resetTokenExpiry: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const url = `${appOrigin(c)}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    const sent = await sendMail(c.env, {
      to: email,
      subject: 'Reset your Zynvo password',
      html: generateResetLinkEmailHtml(user.name ?? 'User', url),
    });
    if (!sent) return jsonError(c, requestId, 'error in sending mail', 400);
    return generic;
  } catch (err: any) {
    logger.error(`[${requestId}] forgot password error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

// ── POST /reset-password/confirm ──────────────────────────────

router.post('/reset-password/confirm', rateLimiter(10), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const token = typeof body?.token === 'string' ? body.token : '';
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!email || !token) return jsonError(c, requestId, 'This reset link is invalid.', 400);
  if (password.length < MIN_PASSWORD_LENGTH) {
    return jsonError(c, requestId, `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`, 400);
  }

  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, clerkId: true, resetTokenHash: true, resetTokenExpiry: true },
    });
    const valid = user?.resetTokenHash
      && user.resetTokenExpiry
      && user.resetTokenExpiry.getTime() > Date.now()
      && user.resetTokenHash === await sha256Hex(token);
    if (!user || !valid) return jsonError(c, requestId, 'This reset link is invalid or has expired.', 400);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: bcrypt.hashSync(password, 10), resetTokenHash: null, resetTokenExpiry: null },
    });
    if (user.clerkId && !(await setClerkPassword(c.env, user.clerkId, password))) {
      logger.warn(`[${requestId}] could not sync reset password to Clerk`, { userId: user.id });
    }
    return c.json({ msg: 'Password updated. You can sign in now.' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] reset confirm error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

// ── POST /ResendEmail?email= ──────────────────────────────────

router.post('/ResendEmail', rateLimiter(5), async (c) => {
  const requestId = generateRequestId();
  const email = c.req.query('email');
  if (!email) return jsonError(c, requestId, 'Email is required', 400);

  const prisma = c.get('prisma');
  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { name: true } });
    if (!user?.name) return jsonError(c, requestId, 'No user found', 404);

    const vToken = randomHex(20);
    await prisma.user.update({
      where: { email },
      data: { vToken, expiryToken: Math.floor(Date.now() / 1000) },
    });

    const url = `${appOrigin(c)}/verification-mail?token=${vToken}&email=${encodeURIComponent(email)}`;
    const sent = await sendMail(c.env, {
      to: email,
      subject: 'One click away from greatness (seriously, just one)',
      html: getResendVerificationEmailHTML(user.name, url),
    });
    if (!sent) return jsonError(c, requestId, 'Error in sending mail', 400);
    return c.json({ msg: 'Email sent successfully' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] resend email error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
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

  const token = await issueToken({ id: verified.id, isVerified: verified.isVerified }, c.env.JWT_SECRET);
  return c.json({ msg: 'Verified successfully', token }, 200);
});

// ── PUT /reset-password ───────────────────────────────────────

router.put('/reset-password', authMiddleware, async (c) => {
  const requestId = generateRequestId();
  const userId = c.get('userId');
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  // The website sends `oldPassword`; Express read `password`. Accept both.
  const password = body.password ?? body.oldPassword;
  const { newPassword } = body;
  if (!password || !newPassword) return jsonError(c, requestId, 'invalid password format', 400);

  const prisma = c.get('prisma');
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, password: true } });
  if (!user) return jsonError(c, requestId, 'invalid user', 404);

  if (!bcrypt.compareSync(password, user.password)) return jsonError(c, requestId, 'Current password is incorrect', 403);

  await prisma.user.update({ where: { id: user.id }, data: { password: bcrypt.hashSync(newPassword, 10) } });
  return c.json({ msg: 'password updated successfully' }, 200);
});

export default router;
