/**
 * Daily Telegram digest (cron, see wrangler.toml [triggers]).
 *
 * - New accounts in the database over the last 24h.
 * - Clerk sign-ups over the last 24h that never got a database account:
 *   people who created a login but couldn't finish signing up.
 * - Alerts raised over the last 24h.
 */
import type { CFEnv } from './types';
import { createPrismaClient } from './db';
import { recentAlerts, sendTelegram } from './alerts';

const DAY_MS = 24 * 60 * 60 * 1000;
const CLERK_API = 'https://api.clerk.com/v1';
const MAX_CLERK_PAGES = 10;

type ClerkUser = {
  id: string;
  created_at: number;
  primary_email_address_id?: string | null;
  email_addresses?: { id: string; email_address: string }[];
};

/** "anirban@gmail.com" → "an***@gmail.com" */
const maskEmail = (email: string) => {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local.slice(0, 2)}***@${domain}`;
};

async function clerkUsersSince(env: CFEnv, sinceMs: number): Promise<ClerkUser[] | null> {
  if (!env.CLERK_SECRET_KEY) return null;
  const out: ClerkUser[] = [];
  for (let page = 0; page < MAX_CLERK_PAGES; page++) {
    const res = await fetch(`${CLERK_API}/users?limit=100&offset=${page * 100}&order_by=-created_at`, {
      headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as ClerkUser[] | { data?: ClerkUser[] };
    const users = Array.isArray(json) ? json : json.data ?? [];
    for (const u of users) {
      if (u.created_at < sinceMs) return out;
      out.push(u);
    }
    if (users.length < 100) break;
  }
  return out;
}

const primaryEmail = (u: ClerkUser) =>
  (u.email_addresses?.find((e) => e.id === u.primary_email_address_id) ?? u.email_addresses?.[0])
    ?.email_address?.toLowerCase();

export async function buildDailyDigest(env: CFEnv): Promise<string> {
  const now = Date.now();
  const since = now - DAY_MS;
  const lines: string[] = ['📊 Zynvo daily report (last 24h)'];

  const prisma = createPrismaClient(env.DATABASE_URL);
  let newUsers: { email: string; clerkId: string | null }[] = [];
  try {
    newUsers = await prisma.user.findMany({
      where: { createdAt: { gte: new Date(since) } },
      select: { email: true, clerkId: true },
    });
    lines.push(`👤 New accounts: ${newUsers.length}`);
  } catch (err: any) {
    lines.push(`👤 New accounts: unavailable (${String(err?.message ?? err).slice(0, 80)})`);
  }

  const clerkUsers = await clerkUsersSince(env, since).catch(() => null);
  if (clerkUsers === null) {
    lines.push('🔐 Clerk sign-ups: unavailable (Clerk API error)');
  } else {
    const emails = clerkUsers.map(primaryEmail).filter((e): e is string => !!e);
    let stuck: string[] = [];
    try {
      const found = await prisma.user.findMany({
        where: { OR: [{ clerkId: { in: clerkUsers.map((u) => u.id) } }, { email: { in: emails } }] },
        select: { email: true, clerkId: true },
      });
      const foundClerk = new Set(found.map((f) => f.clerkId).filter(Boolean));
      const foundEmail = new Set(found.map((f) => f.email.toLowerCase()));
      stuck = clerkUsers
        .filter((u) => !foundClerk.has(u.id) && !foundEmail.has(primaryEmail(u) ?? ''))
        .map((u) => primaryEmail(u) ?? u.id);
    } catch {
      // Leave stuck empty; the DB line above already reports the failure.
    }
    lines.push(`🔐 Clerk sign-ups: ${clerkUsers.length}`);
    if (stuck.length) {
      lines.push(`⚠️ Signed up in Clerk but no Zynvo account (couldn't finish): ${stuck.length}`);
      for (const e of stuck.slice(0, 15)) lines.push(`   • ${e.includes('@') ? maskEmail(e) : e}`);
      if (stuck.length > 15) lines.push(`   • …and ${stuck.length - 15} more`);
    } else {
      lines.push('✅ Every Clerk sign-up has a Zynvo account');
    }
  }

  const alerts = await recentAlerts(env, since).catch(() => []);
  if (alerts.length === 0) {
    lines.push('🟢 No alerts');
  } else {
    lines.push(`🚨 Alerts: ${alerts.length} distinct problem(s)`);
    for (const a of alerts.slice(0, 10)) lines.push(`   • [${a.s}] ${a.t} (${a.c}×)`);
    if (alerts.length > 10) lines.push(`   • …and ${alerts.length - 10} more`);
  }

  return lines.join('\n');
}

export async function sendDailyDigest(env: CFEnv): Promise<boolean> {
  const text = await buildDailyDigest(env);
  const sent = await sendTelegram(env, text);
  if (!sent) console.log(text);
  return sent;
}
