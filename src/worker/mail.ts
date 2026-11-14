/**
 * SendGrid over plain fetch — the @sendgrid/mail SDK used by Express depends
 * on Node internals, but the v3 HTTP API works unchanged on Workers.
 */
import type { CFEnv } from './types';

const SENDGRID_URL = 'https://api.sendgrid.com/v3/mail/send';

export const DEFAULT_FROM = 'dsuper03@zynvosocial.com';
export const DEFAULT_CONTACT_FROM = 'dsuper@zynvosocial.com';
export const CONTACT_INBOX = 'Dsuper03.dev@gmail.com';

export async function sendMail(
  env: CFEnv,
  opts: { to: string; subject: string; html: string; from?: string },
): Promise<boolean> {
  if (!env.SENDGRID_API_KEY) return false;
  const res = await fetch(SENDGRID_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${env.SENDGRID_API_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: opts.to }] }],
      from: { email: opts.from ?? env.SENDGRID_FROM ?? DEFAULT_FROM },
      subject: opts.subject,
      content: [
        { type: 'text/plain', value: 'Zynvo it.' },
        { type: 'text/html', value: opts.html },
      ],
    }),
  });
  return res.ok;
}

/** Escape user input before it is interpolated into an email body. */
export const escapeHtml = (value: unknown): string =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] as string
  ));
