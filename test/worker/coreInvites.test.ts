import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import type { HonoEnv } from '../../src/worker/types';
import authRouter from '../../src/worker/routes/auth';
import clubsRouter from '../../src/worker/routes/clubs';
import eventsRouter from '../../src/worker/routes/events';
import adminRouter from '../../src/worker/routes/admin';
import { createFakePrisma, type FakePrisma } from './fakePrisma';

const JWT_SECRET = 'test-secret';
const ENV = {
  JWT_SECRET,
  FE_URL: 'https://app.test',
  NODE_ENV: 'test',
  SENDGRID_API_KEY: 'sg-test',
} as any;

let db: FakePrisma;
let app: Hono<HonoEnv>;
let sentMail: { to: string; subject: string; html: string }[];
let ipCounter = 0;

function buildApp(prisma: FakePrisma) {
  const a = new Hono<HonoEnv>();
  a.use('*', async (c, next) => { c.set('prisma', prisma as any); await next(); });
  a.route('/api/v1/user', authRouter);
  a.route('/api/v1/clubs', clubsRouter);
  a.route('/api/v1/events', eventsRouter);
  a.route('/api/v2/admin', adminRouter);
  return a;
}

/** Calls the app and waits for any waitUntil work (emails). */
async function call(method: string, path: string, opts: { token?: string; body?: unknown } = {}) {
  const pending: Promise<unknown>[] = [];
  const ctx = { waitUntil: (p: Promise<unknown>) => pending.push(p), passThroughOnException() {} } as any;
  const headers: Record<string, string> = { 'cf-connecting-ip': `10.0.0.${++ipCounter}` };
  if (opts.token) headers.authorization = `Bearer ${opts.token}`;
  if (opts.body !== undefined) headers['content-type'] = 'application/json';
  const res = await app.request(
    path,
    { method, headers, body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined },
    ENV,
    ctx,
  );
  await Promise.all(pending);
  return res;
}

const tokenFor = (id: string) => sign({ id, exp: Math.floor(Date.now() / 1000) + 3600 }, JWT_SECRET);
const PASSWORD = 'Passw0rd!';
const HASH = bcrypt.hashSync(PASSWORD, 4);

async function makeUser(email: string, opts: { verified?: boolean; name?: string } = {}) {
  return db.user.create({
    data: { email, name: opts.name ?? email.split('@')[0], password: HASH, isVerified: opts.verified ?? true },
  });
}

async function makeClub(name: string, founderEmail: string) {
  return db.clubs.create({ data: { name, collegeName: 'Test College', description: '', founderEmail } });
}

async function makeEvent(clubId: string, createdById: string) {
  return db.event.create({ data: { clubId, createdById, EventName: 'Hackathon' } });
}

const csvPath = (eventId: string) => `/api/v1/events/participants/${eventId}?format=csv`;
const byEmail = (clubId: string) => `/api/v1/clubs/${clubId}/core-members/by-email`;

beforeEach(() => {
  db = createFakePrisma();
  app = buildApp(db);
  sentMail = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string, init: any) => {
    if (String(url).includes('sendgrid')) {
      const body = JSON.parse(init.body);
      sentMail.push({
        to: body.personalizations[0].to[0].email,
        subject: body.subject,
        html: body.content.find((x: any) => x.type === 'text/html').value,
      });
      return new Response(null, { status: 202 });
    }
    throw new Error(`unexpected fetch ${url}`);
  }));
});

afterEach(() => { vi.unstubAllGlobals(); });

// ─────────────────────────────────────────────────────────────

describe('POST /clubs/:clubId/core-members/by-email — head only', () => {
  it('rejects a non-head (regular user and existing core member) with 403 and changes nothing', async () => {
    const head = await makeUser('head@x.com');
    const core = await makeUser('core@x.com');
    const outsider = await makeUser('outsider@x.com');
    const club = await makeClub('Robotics', head.email);
    await db.clubs.update({ where: { id: club.id }, data: { coremember1: core.email } });

    for (const caller of [outsider, core]) {
      const res = await call('POST', byEmail(club.id), { token: await tokenFor(caller.id), body: { emails: ['new@x.com'] } });
      expect(res.status).toBe(403);
    }
    // list + revoke are head-only too
    expect((await call('GET', `/api/v1/clubs/${club.id}/core-invites`, { token: await tokenFor(core.id) })).status).toBe(403);
    const inv = await db.clubCoreInvite.create({
      data: { clubId: club.id, email: 'p@x.com', invitedById: head.id, expiresAt: new Date(Date.now() + 1e9) },
    });
    expect((await call('DELETE', `/api/v1/clubs/${club.id}/core-invites/${inv.id}`, { token: await tokenFor(core.id) })).status).toBe(403);

    expect(db.clubCoreInvite.rows).toHaveLength(1);
    expect(db.clubCoreInvite.rows[0].status).toBe('PENDING');
    expect((await db.clubs.findUnique({ where: { id: club.id } }))!.coremember2).toBe('none');
    expect(sentMail).toHaveLength(0);
  });

  it('requires authentication', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    expect((await call('POST', byEmail(club.id), { body: { emails: ['a@x.com'] } })).status).toBe(401);
  });

  it('rejects more than 20 emails and a non-array body', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    const token = await tokenFor(head.id);
    const emails = Array.from({ length: 21 }, (_, i) => `u${i}@x.com`);
    expect((await call('POST', byEmail(club.id), { token, body: { emails } })).status).toBe(400);
    expect((await call('POST', byEmail(club.id), { token, body: { emails: 'a@x.com' } })).status).toBe(400);
  });
});

describe('existing verified user', () => {
  it('is added to the core team, notified, and can then download the club CSV', async () => {
    const head = await makeUser('head@x.com', { name: 'Hana Head' });
    const member = await makeUser('Member@X.com');
    const club = await makeClub('Robotics', head.email);
    const event = await makeEvent(club.id, head.id);
    const memberToken = await tokenFor(member.id);

    // Before: not core → CSV denied
    expect((await call('GET', csvPath(event.id), { token: memberToken })).status).toBe(403);

    const res = await call('POST', byEmail(club.id), {
      token: await tokenFor(head.id),
      body: { emails: ['  MEMBER@x.com ', 'member@x.com', 'not-an-email', 'head@x.com'] },
    });
    expect(res.status).toBe(200);
    const json: any = await res.json();
    expect(json.results).toEqual([
      { email: 'member@x.com', status: 'added' },
      { email: 'not-an-email', status: 'invalid' },
      { email: 'head@x.com', status: 'already_member' },
    ]);

    const updated = await db.clubs.findUnique({ where: { id: club.id } });
    expect(updated!.coremember1).toBe('Member@X.com'); // stored as the account's email
    expect(db.userClubMembership.rows.some((m) => m.userId === member.id && m.clubId === club.id)).toBe(true);
    expect(db.notification.rows.some((n) => n.userId === member.id && n.type === 'core_team_added')).toBe(true);
    expect(sentMail.map((m) => m.to)).toEqual(['Member@X.com']);
    expect(db.clubCoreInvite.rows).toHaveLength(0);

    // After: CSV allowed
    const csv = await call('GET', csvPath(event.id), { token: memberToken });
    expect(csv.status).toBe(200);
    expect(csv.headers.get('content-type')).toContain('text/csv');

    // Adding again → already_member, no duplicate slot
    const again: any = await (await call('POST', byEmail(club.id), { token: await tokenFor(head.id), body: { emails: ['member@x.com'] } })).json();
    expect(again.results).toEqual([{ email: 'member@x.com', status: 'already_member' }]);
    expect(updated!.coremember2).toBe('none');
  });

  it('loses CSV access immediately when removed from the core team', async () => {
    const head = await makeUser('head@x.com');
    const member = await makeUser('member@x.com');
    const club = await makeClub('Robotics', head.email);
    const event = await makeEvent(club.id, head.id);
    await call('POST', byEmail(club.id), { token: await tokenFor(head.id), body: { emails: ['member@x.com'] } });
    const memberToken = await tokenFor(member.id);
    expect((await call('GET', csvPath(event.id), { token: memberToken })).status).toBe(200);

    const rm = await call('POST', `/api/v2/admin/removeCoremembers/${club.id}`, {
      token: await tokenFor(head.id), body: { coremember1: 'member@x.com' },
    });
    expect(rm.status).toBe(200);
    // Same (still valid) token, next request → denied
    expect((await call('GET', csvPath(event.id), { token: memberToken })).status).toBe(403);
  });
});

describe('unknown email → pending invite', () => {
  it('creates an invite with a deep link email and converts on verified signup', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    const event = await makeEvent(club.id, head.id);
    const headToken = await tokenFor(head.id);

    const json: any = await (await call('POST', byEmail(club.id), { token: headToken, body: { emails: ['New@Person.com'] } })).json();
    expect(json.results).toEqual([{ email: 'new@person.com', status: 'invited' }]);

    const [invite] = db.clubCoreInvite.rows;
    expect(invite).toMatchObject({ clubId: club.id, email: 'new@person.com', invitedById: head.id, status: 'PENDING' });
    const days = (invite.expiresAt.getTime() - Date.now()) / 86_400_000;
    expect(days).toBeGreaterThan(13.9);
    expect(days).toBeLessThanOrEqual(14);
    expect(sentMail).toHaveLength(1);
    expect(sentMail[0].to).toBe('new@person.com');
    expect(sentMail[0].html).toContain('https://app.test/auth/signup?email=new%40person.com&amp;returnTo=%2Fclubs%2F' + club.id);

    // Re-inviting → already_invited, no duplicate
    const again: any = await (await call('POST', byEmail(club.id), { token: headToken, body: { emails: ['new@person.com'] } })).json();
    expect(again.results).toEqual([{ email: 'new@person.com', status: 'already_invited' }]);
    expect(db.clubCoreInvite.rows).toHaveLength(1);

    // Head sees it in the pending list
    const list: any = await (await call('GET', `/api/v1/clubs/${club.id}/core-invites`, { token: headToken })).json();
    expect(list.invites.map((i: any) => i.email)).toEqual(['new@person.com']);

    // Sign up: account exists but unverified → no conversion, cannot log in
    const signup = await call('POST', '/api/v1/user/signup', { body: { email: 'new@person.com', password: PASSWORD, name: 'New' } });
    expect(signup.status).toBe(200);
    expect(db.clubCoreInvite.rows[0].status).toBe('PENDING');
    expect((await call('POST', '/api/v1/user/password-login', { body: { email: 'new@person.com', password: PASSWORD } })).status).toBe(403);

    // Verify email → invite converts
    const newUser = (await db.user.findFirst({ where: { email: 'new@person.com' } }))!;
    const verify = await call('POST', `/api/v1/user/verify?vToken=${newUser.vToken}`);
    expect(verify.status).toBe(200);

    expect(db.clubCoreInvite.rows[0].status).toBe('ACCEPTED');
    const updated = await db.clubs.findUnique({ where: { id: club.id } });
    expect(updated!.coremember1).toBe('new@person.com');
    expect(db.userClubMembership.rows.some((m) => m.userId === newUser.id && m.clubId === club.id)).toBe(true);
    expect(db.notification.rows.some((n) => n.userId === head.id && n.type === 'core_invite_accepted')).toBe(true);

    expect((await call('GET', csvPath(event.id), { token: await tokenFor(newUser.id) })).status).toBe(200);
  });

  it('treats an existing but unverified account as an invite, converted on verified login', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    const unverified = await makeUser('pending@x.com', { verified: false });

    const json: any = await (await call('POST', byEmail(club.id), { token: await tokenFor(head.id), body: { emails: ['pending@x.com'] } })).json();
    expect(json.results).toEqual([{ email: 'pending@x.com', status: 'invited' }]);
    expect((await db.clubs.findUnique({ where: { id: club.id } }))!.coremember1).toBe('none');

    await db.user.update({ where: { id: unverified.id }, data: { isVerified: true } });
    const login = await call('POST', '/api/v1/user/password-login', { body: { email: 'pending@x.com', password: PASSWORD } });
    expect(login.status).toBe(200);
    expect((await db.clubs.findUnique({ where: { id: club.id } }))!.coremember1).toBe('pending@x.com');
  });

  it('does not convert an expired invite', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    await db.clubCoreInvite.create({
      data: { clubId: club.id, email: 'late@x.com', invitedById: head.id, expiresAt: new Date(Date.now() - 1000) },
    });
    await makeUser('late@x.com');
    expect((await call('POST', '/api/v1/user/password-login', { body: { email: 'late@x.com', password: PASSWORD } })).status).toBe(200);
    expect(db.clubCoreInvite.rows[0].status).toBe('PENDING');
    expect((await db.clubs.findUnique({ where: { id: club.id } }))!.coremember1).toBe('none');
  });
});

describe('revoked invite', () => {
  it('does not convert on verified signup', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    const headToken = await tokenFor(head.id);
    await call('POST', byEmail(club.id), { token: headToken, body: { emails: ['gone@x.com'] } });
    const inviteId = db.clubCoreInvite.rows[0].id;

    const revoke = await call('DELETE', `/api/v1/clubs/${club.id}/core-invites/${inviteId}`, { token: headToken });
    expect(revoke.status).toBe(200);
    expect(db.clubCoreInvite.rows[0].status).toBe('REVOKED');
    // revoking twice → 404
    expect((await call('DELETE', `/api/v1/clubs/${club.id}/core-invites/${inviteId}`, { token: headToken })).status).toBe(404);

    await call('POST', '/api/v1/user/signup', { body: { email: 'gone@x.com', password: PASSWORD, name: 'Gone' } });
    const u = (await db.user.findFirst({ where: { email: 'gone@x.com' } }))!;
    expect((await call('POST', `/api/v1/user/verify?vToken=${u.vToken}`)).status).toBe(200);

    expect(db.clubCoreInvite.rows[0].status).toBe('REVOKED');
    const updated = await db.clubs.findUnique({ where: { id: club.id } });
    expect([updated!.coremember1, updated!.coremember2, updated!.coremember3]).toEqual(['none', 'none', 'none']);
    // Revoked invite frees its slot and no longer blocks a new invite
    const re: any = await (await call('POST', byEmail(club.id), { token: headToken, body: { emails: ['gone@x.com'] } })).json();
    expect(re.results).toEqual([{ email: 'gone@x.com', status: 'added' }]);
  });

  it("cannot be revoked through another club's head", async () => {
    const headA = await makeUser('a@x.com');
    const headB = await makeUser('b@x.com');
    const clubA = await makeClub('A', headA.email);
    const clubB = await makeClub('B', headB.email);
    await call('POST', byEmail(clubA.id), { token: await tokenFor(headA.id), body: { emails: ['p@x.com'] } });
    const inviteId = db.clubCoreInvite.rows[0].id;

    const res = await call('DELETE', `/api/v1/clubs/${clubB.id}/core-invites/${inviteId}`, { token: await tokenFor(headB.id) });
    expect(res.status).toBe(404);
    expect(db.clubCoreInvite.rows[0].status).toBe('PENDING');
  });
});

describe('slot reservation (3 core slots)', () => {
  it('counts pending invites against the 3 slots and reports team_full', async () => {
    const head = await makeUser('head@x.com');
    const club = await makeClub('Robotics', head.email);
    await makeUser('one@x.com');
    const json: any = await (await call('POST', byEmail(club.id), {
      token: await tokenFor(head.id),
      body: { emails: ['one@x.com\ntwo@x.com, three@x.com', 'four@x.com'] },
    })).json();
    expect(json.results).toEqual([
      { email: 'one@x.com', status: 'added' },
      { email: 'two@x.com', status: 'invited' },
      { email: 'three@x.com', status: 'invited' },
      { email: 'four@x.com', status: 'team_full' },
    ]);
    expect(json.summary).toEqual({ added: 1, invited: 2, team_full: 1 });
  });
});

describe('cross-club CSV access', () => {
  it('denies a core member of club A on club B files', async () => {
    const headA = await makeUser('a@x.com');
    const headB = await makeUser('b@x.com');
    const member = await makeUser('member@x.com');
    const clubA = await makeClub('A', headA.email);
    const clubB = await makeClub('B', headB.email);
    const eventA = await makeEvent(clubA.id, headA.id);
    const eventB = await makeEvent(clubB.id, headB.id);

    await call('POST', byEmail(clubA.id), { token: await tokenFor(headA.id), body: { emails: ['member@x.com'] } });
    const token = await tokenFor(member.id);

    expect((await call('GET', csvPath(eventA.id), { token })).status).toBe(200);
    expect((await call('GET', csvPath(eventB.id), { token })).status).toBe(403);
    expect((await call('GET', `/api/v1/events/participants/${eventB.id}`, { token })).status).toBe(403);
  });
});
