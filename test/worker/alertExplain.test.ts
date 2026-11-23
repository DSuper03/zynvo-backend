import { describe, it, expect } from 'vitest';
import { explainAlert } from '../../src/worker/alertExplain';

// No AI binding: anything the rules miss would come back as 'generic'. The
// Workers AI fallback once answered a 1102 with "update the Prisma schema".
const env = {} as any;

const ACCELERATE_1102 = [
  'client: website · response 500',
  '[ERROR] Unhandled Worker error: ',
  'Invalid `prisma.speakers.findMany()` invocation:',
  '',
  '',
  'error code: 1102',
  ' {"stack":"PrismaClientKnownRequestError:  | Invalid `prisma.speakers.findMany()` invocation: |  | "}',
].join('\n');

describe('explainAlert', () => {
  it('explains an Accelerate/Cloudflare 1102 by rule, without blaming the schema', async () => {
    const r = await explainAlert(env, '500 GET /api/v1/events/getSpeakers', ACCELERATE_1102);
    expect(r.by).toBe('rule');
    expect(r.fixable).toBe('maybe');
    expect(r.what).toMatch(/Prisma Accelerate/);
    expect(`${r.what} ${r.fix}`).not.toMatch(/update the Prisma schema/i);
  });

  it('matches other Cloudflare error codes from a failed Prisma call', async () => {
    const r = await explainAlert(env, '500 GET /api/v1/clubs/all', 'Invalid `prisma.clubs.findMany()` invocation:\n\nerror code: 1101');
    expect(r.by).toBe('rule');
  });

  it('does not treat a normal Prisma validation error as an Accelerate outage', async () => {
    const r = await explainAlert(env, '500 POST /api/v1/events/create', 'Invalid `prisma.event.create()` invocation:\n\nArgument `name` is missing.');
    expect(r.by).toBe('generic');
  });

  it('friends-going 1102 (prisma.follow.findMany) is the Accelerate rule, not "update the call"', async () => {
    const r = await explainAlert(env, '500 GET /api/v1/events/friends-going: friends-going error',
      '[ERROR] [al8td2w] friends-going error {"error":"\\nInvalid `prisma.follow.findMany()` invocation:\\n\\n\\nerror code: 1102\\n"}');
    expect(r.by).toBe('rule');
    expect(r.what).toMatch(/Prisma Accelerate/);
  });

  it('P2022 (column does not exist) says to apply the migration', async () => {
    const r = await explainAlert(env, '500 GET /api/v1/events/event/:id: Internal Server error',
      '[ERROR] Internal Server error {"error":"\\nInvalid `prisma.event.findUnique()` invocation:\\n\\n\\nThe column `(not available)` does not exist in the current database.","code":"P2022"}');
    expect(r.by).toBe('rule');
    expect(r.fixable).toBe('yes');
    expect(r.fix).toMatch(/migrate deploy/);
  });

  it('"Website cannot reach the backend: fetch failed" is not blamed on Prisma Accelerate', async () => {
    const r = await explainAlert(env, 'Website cannot reach the backend',
      'POST /api/v2/user/auth/checkUserExists failed after 10ms: fetch failed. requestId REQ-5F8E7B149778');
    expect(r.what).toMatch(/website couldn.t connect to the backend/i);
    expect(r.what).not.toMatch(/Prisma/);
  });

  it('still maps constraint errors to their own rule', async () => {
    const r = await explainAlert(env, '500 POST /x', 'P2002 Unique constraint failed');
    expect(r.fix).toMatch(/409/);
  });
});
