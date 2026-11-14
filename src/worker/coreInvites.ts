/**
 * Core team "add by email".
 *
 * The core team is still the three `clubs.coremember1..3` slots (holding user
 * emails), so every existing core-member check — event management, participant
 * CSV export, isClubAdmin — keeps working unchanged. This module adds:
 *   - adding verified users straight into a free slot, and
 *   - pending invites (ClubCoreInvite) for emails without a verified account,
 *     converted into a slot when that email signs in verified.
 *
 * Slots are reserved: filled slots + live pending invites never exceed 3, so a
 * pending invite always has a slot waiting when it converts.
 */
import type { Context } from 'hono';
import type { CFEnv, HonoEnv } from './types';
import type { FcmConfig } from './fcm';
import { sendMail } from './mail';
import { createNotification } from './utils/notification';
import { ensureMembership } from './utils/clubAuth';
import { coreTeamAddedEmail, coreTeamInviteEmail } from './emails/coreTeam';
import { logger } from './logger';

export const CORE_SLOTS = ['coremember1', 'coremember2', 'coremember3'] as const;
export const MAX_EMAILS_PER_REQUEST = 20;
export const INVITE_TTL_MS = 14 * 24 * 60 * 60 * 1000;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type ByEmailStatus =
  | 'added'
  | 'invited'
  | 'already_member'
  | 'already_invited'
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

// ── Add by email ──────────────────────────────────────────────

export async function addCoreMembersByEmail(
  c: Context<HonoEnv>,
  club: any,
  inviter: { id: string; name: string | null },
  entries: { raw: string; email: string | null }[],
): Promise<ByEmailResult[]> {
  const prisma = c.get('prisma') as any;
  const env = c.env;
  const now = new Date();
  const inviterName = inviter.name?.trim() || 'Your club head';

  const core = new Set(coreEmailsOf(club));
  const founder = lower(club.founderEmail);

  const pending: { id: string; email: string; expiresAt: Date }[] = await prisma.clubCoreInvite.findMany({
    where: { clubId: club.id, status: 'PENDING' },
    select: { id: true, email: true, expiresAt: true },
  });
  const livePending = new Set(pending.filter((i) => i.expiresAt > now).map((i) => i.email));
  const expiredPending = new Map(pending.filter((i) => i.expiresAt <= now).map((i) => [i.email, i.id]));

  let free = CORE_SLOTS.length - core.size - livePending.size;

  const validEmails = entries.map((e) => e.email).filter((e): e is string => !!e);
  const users: { id: string; email: string; isVerified: boolean | null }[] = validEmails.length
    ? await prisma.user.findMany({
        where: { email: { in: validEmails, mode: 'insensitive' } },
        select: { id: true, email: true, isVerified: true },
      })
    : [];
  const userByEmail = new Map(users.map((u) => [lower(u.email), u]));

  const results: ByEmailResult[] = [];
  for (const entry of entries) {
    const email = entry.email;
    if (!email) { results.push({ email: entry.raw, status: 'invalid' }); continue; }
    if (email === founder || core.has(email)) { results.push({ email, status: 'already_member' }); continue; }
    if (livePending.has(email)) { results.push({ email, status: 'already_invited' }); continue; }
    if (free <= 0) { results.push({ email, status: 'team_full' }); continue; }

    const user = userByEmail.get(email);

    // Verified account → straight onto the core team (same slots + membership
    // as the existing addCoreMembers flow).
    if (user && user.isVerified) {
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
      continue;
    }

    // No (verified) account → pending invite. An expired pending row for the
    // same email is refreshed instead of inserting (unique while pending).
    const expiresAt = new Date(now.getTime() + INVITE_TTL_MS);
    try {
      const expiredId = expiredPending.get(email);
      if (expiredId) {
        await prisma.clubCoreInvite.update({
          where: { id: expiredId },
          data: { expiresAt, invitedById: inviter.id, createdAt: now },
        });
      } else {
        await prisma.clubCoreInvite.create({
          data: { clubId: club.id, email, invitedById: inviter.id, expiresAt },
        });
      }
    } catch (err: any) {
      // Unique (clubId, email) while pending: a concurrent request invited it.
      if (err?.code === 'P2002') { results.push({ email, status: 'already_invited' }); continue; }
      throw err;
    }
    livePending.add(email);
    free--;
    results.push({ email, status: 'invited' });

    const qs = new URLSearchParams({ email, returnTo: `/clubs/${club.id}` });
    const url = `${appOrigin(env)}/auth/signup?${qs.toString()}`;
    const mail = coreTeamInviteEmail({ clubName: club.name, inviterName, url, expiresAt });
    deferTask(c, sendMail(env, { to: email, ...mail }));
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
        data: { clubId: club.id, route: `/admin/${club.id}` },
      });
    }
  } catch (err: any) {
    logger.error('convertPendingCoreInvites failed', { error: err?.message, userId: user.id });
  }
  return joined;
}
