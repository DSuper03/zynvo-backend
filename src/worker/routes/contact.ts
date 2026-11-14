import { Hono } from 'hono';
import type { HonoEnv } from '../types';
import { authMiddleware } from '../middleware/auth';
import { rateLimiter } from '../middleware/ratelimit';
import { generateRequestId, jsonError } from '../utils/response';
import { sendMail, escapeHtml, CONTACT_INBOX, DEFAULT_CONTACT_FROM } from '../mail';
import { logger } from '../logger';

const router = new Hono<HonoEnv>();

// ── POST /contact — public contact form ───────────────────────

router.post('/contact', rateLimiter(5), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { name, email, subject, message } = body ?? {};
  if (!message || !subject) return jsonError(c, requestId, 'subject and message are required', 400);

  try {
    const sent = await sendMail(c.env, {
      to: CONTACT_INBOX,
      from: c.env.SENDGRID_CONTACT_FROM ?? DEFAULT_CONTACT_FROM,
      subject: String(subject),
      html: `
        <h1>Message received from ${escapeHtml(name)} (${escapeHtml(email)})</h1>
        <h3>Message : ${escapeHtml(message)}</h3>
      `,
    });
    if (!sent) return jsonError(c, requestId, 'some error occured', 400);
    return c.json({ msg: 'sent' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] contact error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

// ── POST /feedback — signed-in user feedback ──────────────────

router.post('/feedback', authMiddleware, rateLimiter(5), async (c) => {
  const requestId = generateRequestId();
  let body: any;
  try { body = await c.req.json(); } catch { return jsonError(c, requestId, 'Invalid JSON', 400); }

  const { subject, category, description, improvements } = body ?? {};
  const prisma = c.get('prisma');

  try {
    const user = await prisma.user.findUnique({
      where: { id: c.get('userId') },
      select: { email: true, name: true },
    });
    if (!user) return jsonError(c, requestId, 'user not found', 404);

    const sent = await sendMail(c.env, {
      to: CONTACT_INBOX,
      from: c.env.SENDGRID_CONTACT_FROM ?? DEFAULT_CONTACT_FROM,
      subject: String(subject || 'Feedback'),
      html: `
        <h2>Feedback Received</h2>
        <h3>from ${escapeHtml(user.name)} (${escapeHtml(user.email)})</h3>
        <p><strong>Category:</strong> ${escapeHtml(category)}</p>
        <p><strong>Description:</strong><br>${escapeHtml(description)}</p>
        ${improvements ? `<p><strong>Suggested Improvements:</strong><br>${escapeHtml(improvements)}</p>` : ''}
      `,
    });
    if (!sent) return jsonError(c, requestId, 'some error occured', 400);
    return c.json({ msg: 'sent' }, 200);
  } catch (err: any) {
    logger.error(`[${requestId}] feedback error`, { error: err.message });
    return jsonError(c, requestId, 'internal server error', 500);
  }
});

export default router;
