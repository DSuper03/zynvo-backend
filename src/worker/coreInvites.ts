/**
 * Core team "add by email".
 *
 * The core team is still the three `clubs.coremember1..3` slots (holding user
 * emails), so every existing core-member check — event management, participant
 * CSV export, isClubAdmin — keeps working unchanged.
 *
 * Adding is direct: anyone with a Zynvo account goes straight into a free
 * slot (and becomes a club member). There are no invites; an email without an
 * account is reported as `not_found`. Invites created before this change are
 * settled by settleLegacyClubInvites().
 */
import type { Context } from 'hono';
import type { CFEnv, HonoEnv } from './types';
import type { FcmConfig } from './fcm';
import { sendMail } from './mail';
import { createNotification } from './utils/notification';
import { ensureMembership } from './utils/clubAuth';
import { coreTeamAddedEmail } from './emails/coreTeam';
import { logger } from './logger';

export const CORE_SLOTS = ['coremember1', 'coremember2', 'coremember3'] as const;
export const MAX_EMAILS_PER_REQUEST = 20;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ByEmailStatus =
  | 'added'
  | 'already_member'
  | 'not_found'
  | 'team_full'
  | 'invalid';
export type ByEmailResult = { email: string; status: ByEmailStatus };

const lower = (s: string | null | undefined) => (s ?? '').trim().toLowerCase();
const slotFilled = (v: string | null | undefined) => !!v && v.trim() !== '' && v.trim().toLowerCase() !== 'none';

const fcmCfg = (env: CFEnv): FcmConfig => ({
  projectId: env.FIREBASE_PROJECT_ID,
  clientEmail: env.FIREBASE_CLIENT_EMAIL,
  privateKey: env.FIREBASE_PRIVATE_KEY,
});

const appOrigin = (env: CFEnv) => (env.FE_URL || 'https://www.zynvosocial.com').replace(/\/$/, '');

/** Run work after the response (emails); falls back to fire-and-forget without an execution context. */
export const deferTask = (c: Context<HonoEnv>, task: Promise<unknown>) => {
  const safe = task.catch((err: any) => logger.error('deferred core-invite task failed', { error: err?.message }));
  try {
    c.executionCtx.waitUntil(safe);
  } catch {
    /* no ExecutionContext (tests / local) — the promise still runs */
  }
};

// ── Input ─────────────────────────────────────────────────────

export type ParsedEmails =
  | { ok: true; entries: { raw: string; email: string | null }[] }
  | { ok: false; error: string };

/**
 * Trims, lowercases, validates and dedupes. Entries may themselves contain
 * comma/newline separated lists. Invalid entries are kept (email: null) so the
 * caller can report them.
 */
export function parseEmails(input: unknown): ParsedEmails {
  if (!Array.isArray(input)) return { ok: false, error: 'emails must be an array of strings' };
  const seen = new Set<string>();
  const entries: { raw: string; email: string | null }[] = [];
  for (const item of input) {
    if (typeof item !== 'string') return { ok: false, error: 'emails must be an array of strings' };
    for (const part of item.split(/[,\n\r;]+/)) {
      const raw = part.trim();
      if (!raw) continue;
      const email = raw.toLowerCase();
      if (seen.has(email)) continue;
      seen.add(email);
      entries.push({ raw, email: EMAIL_RE.test(email) && email.length <= 254 ? email : null });
    }
  }
  if (entries.length === 0) return { ok: false, error: 'Provide at least one email' };
  if (entries.length > MAX_EMAILS_PER_REQUEST) {
    return { ok: false, error: `At most ${MAX_EMAILS_PER_REQUEST} emails per request` };
  }
  return { ok: true, entries };
}

// ── Slots ─────────────────────────────────────────────────────

/**
 * Writes `email` into the first empty core slot. Each slot write is a
 * compare-and-set (only if still empty), so concurrent adds can't overwrite
 * each other. Returns false when every slot is taken.
 */
async function fillCoreSlot(prisma: any, clubId: string, email: string): Promise<boolean> {
  for (const slot of CORE_SLOTS) {
    const res = await prisma.clubs.updateMany({
      where: { id: clubId, OR: [{ [slot]: null }, { [slot]: 'none' }, { [slot]: '' }] },
      data: { [slot]: email },
    });
    if (res.count === 1) return true;
  }
  return false;
}

const coreEmailsOf = (club: any) => CORE_SLOTS.map((s) => club[s]).filter(slotFilled).map(lower);

/** Case-insensitive lookup of users by email (one equals filter per address). */
export async function findUsersByEmails(prisma: any, emails: string[]): Promise<{ id: string; email: string }[]> {
  if (emails.length === 0) return [];
  return prisma.user.findMany({
    where: { OR: emails.map((email) => ({ email: { equals: email, mode: 'insensitive' } })) },
    select: { id: true, email: true },
  });
}

/**
 * Invites were removed in favour of direct adding. Settles this club's
 * leftover pending invites: people who now have an account are added to the
 * core team (as their invite promised); the rest are revoked so they can't
 * take a seat later. Runs when the head opens the core team section.
 * Returns how many were added.
 */
export async function settleLegacyClubInvites(prisma: any, env: CFEnv, clubId: string): Promise<number> {
  const pending: { email: string }[] = await prisma.clubCoreInvite.findMany({
    where: { clubId, status: 'PENDING' },
    select: { email: true },
  });
  if (pending.length === 0) return 0;
  let added = 0;
  for (const user of await findUsersByEmails(prisma, pending.map((p) => p.email))) {
    const joined = await convertPendingCoreInvites(prisma, env, user);
    if (joined.includes(clubId)) added++;
  }
  await prisma.clubCoreInvite.updateMany({ where: { clubId, status: 'PENDING' }, data: { status: 'REVOKED' } });
  return added;
}

// ── Add by email ──────────────────────────────────────────────

export async function addCoreMembersByEmail(
  c: Context<HonoEnv>,
  club: any,
  inviter: { id: string; name: string | null },
  entries: { raw: string; email: string | null }[],
): Promise<ByEmailResult[]> {
  const prisma = c.get('prisma') as any;
  const env = c.env;
  const inviterName = inviter.name?.trim() || 'Your club head';

  const core = new Set(coreEmailsOf(club));
  const founder = lower(club.founderEmail);
  let free = CORE_SLOTS.length - core.size;

  const validEmails = entries.map((e) => e.email).filter((e): e is string => !!e);
  const users = await findUsersByEmails(prisma, validEmails);
  const userByEmail = new Map(users.map((u) => [lower(u.email), u]));

  const results: ByEmailResult[] = [];
  for (const entry of entries) {
    const email = entry.email;
    if (!email) { results.push({ email: entry.raw, status: 'invalid' }); continue; }
    if (email === founder || core.has(email)) { results.push({ email, status: 'already_member' }); continue; }

    // Direct add only: there are no invites. Someone without a Zynvo account
    // is reported back so the head can ask them to sign up first.
    const user = userByEmail.get(email);
    if (!user) { results.push({ email, status: 'not_found' }); continue; }
    if (free <= 0) { results.push({ email, status: 'team_full' }); continue; }

    if (!(await fillCoreSlot(prisma, club.id, user.email))) {
      free = 0;
      results.push({ email, status: 'team_full' });
      continue;
    }
    await ensureMembership(prisma, user.id, club.id);
    core.add(email);
    free--;
    results.push({ email, status: 'added' });

    const url = `${appOrigin(env)}/clubs/${club.id}`;
    await createNotification(prisma, fcmCfg(env), {
      userId: user.id,
      type: 'core_team_added',
      title: `You're on the ${club.name} core team`,
      body: `${inviterName} added you to the core team.`,
      data: { clubId: club.id, route: `/clubs/${club.id}` },
      push: true,
    });
    const mail = coreTeamAddedEmail({ clubName: club.name, inviterName, url });
    deferTask(c, sendMail(env, { to: user.email, ...mail }));
  }
  return results;
}

// ── Conversion on verified sign-in ────────────────────────────

/**
 * Converts the user's live pending invites into core slots. Call only once the
 * email is proven verified (verified email link, password login of a verified
 * account, or a Clerk session listing the email). Never throws.
 * Returns the ids of clubs joined.
 */
export async function convertPendingCoreInvites(
  prisma: any,
  env: CFEnv,
  user: { id: string; email: string },
): Promise<string[]> {
  const joined: string[] = [];
  try {
    const email = lower(user.email);
    const invites: { id: string; clubId: string; invitedById: string }[] = await prisma.clubCoreInvite.findMany({
      where: { email, status: 'PENDING', expiresAt: { gt: new Date() } },
      select: { id: true, clubId: true, invitedById: true },
    });

    for (const inv of invites) {
      // Claim first so a concurrent revoke or second login can't double-apply.
      const claimed = await prisma.clubCoreInvite.updateMany({
        where: { id: inv.id, status: 'PENDING' },
        data: { status: 'ACCEPTED' },
      });
      if (claimed.count !== 1) continue;

      const club = await prisma.clubs.findUnique({
        where: { id: inv.clubId },
        select: { id: true, name: true, founderEmail: true, coremember1: true, coremember2: true, coremember3: true },
      });
      if (!club) continue;

      const alreadyCore = lower(club.founderEmail) === email || coreEmailsOf(club).includes(email);
      if (!alreadyCore && !(await fillCoreSlot(prisma, club.id, user.email))) {
        // Slots were taken outside the reservation (legacy addCoreMembers
        // form). Keep the invite pending so the head can free a slot.
        await prisma.clubCoreInvite.updateMany({ where: { id: inv.id, status: 'ACCEPTED' }, data: { status: 'PENDING' } });
        logger.warn('core invite not converted: core team full', { clubId: club.id, inviteId: inv.id });
        continue;
      }
      await ensureMembership(prisma, user.id, club.id);
      joined.push(club.id);

      await createNotification(prisma, fcmCfg(env), {
        userId: user.id,
        type: 'core_team_added',
        title: `You're on the ${club.name} core team`,
        body: 'Your invite was accepted automatically.',
        data: { clubId: club.id, route: `/clubs/${club.id}` },
        push: true,
      });
      await createNotification(prisma, fcmCfg(env), {
        userId: inv.invitedById,
        type: 'core_invite_accepted',
        title: 'Core team invite accepted',
        body: `${user.email} joined the ${club.name} core team.`,
        data: { clubId: club.id, route: `/clubs/${club.id}` },
      });
    }
  } catch (err: any) {
    logger.error('convertPendingCoreInvites failed', { error: err?.message, userId: user.id });
  }
  return joined;
}
