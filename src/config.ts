import dotenv from 'dotenv';
import path from 'path';

// Load .env file from project root
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

console.log('📁 Loading .env from:', envPath);

/** Web origin for links in emails (no trailing slash). Override with FE_URL. */
const rawFe = process.env.FE_URL || 'https://www.zynvosocial.com';
export const PUBLIC_APP_ORIGIN = rawFe.replace(/\/$/, '');

/** Verified Sender in SendGrid (override if needed). */
export const SENDGRID_FROM =
  process.env.SENDGRID_FROM || 'dsuper03@zynvosocial.com';

/** From address for contact-form notification emails. */
export const SENDGRID_CONTACT_FROM =
  process.env.SENDGRID_CONTACT_FROM || 'dsuper@zynvosocial.com';
