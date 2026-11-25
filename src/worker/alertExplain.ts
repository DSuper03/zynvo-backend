/**
 * Plain-English summaries for Telegram alerts: what happened (1–2 lines) and
 * whether it's something we can fix on our side.
 *
 * Known problems are matched by rules (instant, free, consistent). Anything
 * else is summarised by Workers AI when the AI binding exists; otherwise a
 * generic summary is used. Never throws.
 */
import type { CFEnv } from './types';

export type Fixable = 'yes' | 'no' | 'maybe';
export type Explanation = { what: string; fix: string; fixable: Fixable; by: 'rule' | 'ai' | 'generic' };

type Rule = { test: RegExp; what: string; fix: string; fixable: Fixable };

// First match wins, so specific causes come before broad ones.
const RULES: Rule[] = [
  {
    test: /Cannot perform I\/O on behalf of a different request/i,
    what: 'A database call got mixed up between two visitors’ requests (side effect of the shared database client) and failed.',
    fix: 'Yes — code fix in the shared Prisma client (src/worker/db.ts).',
    fixable: 'yes',
  },
  {
    test: /never generate a response|code had hung|different request context/i,
    what: 'A request got stuck waiting on work that belonged to another visitor’s request (shared database client), so Cloudflare cut it off.',
    fix: 'Yes — give each simultaneous request its own database client (pool in src/worker/db.ts).',
    fixable: 'yes',
  },
  {
    test: /non-Error thrown/i,
    what: 'Something threw an unusual error value that the normal error handler couldn’t catch; the visitor got a plain 500.',
    fix: 'Yes — the details below show what was thrown and where.',
    fixable: 'yes',
  },
  {
    // The worker is deployed from git as soon as a PR merges; the database
    // migration is a separate step, so the code can briefly run ahead of it.
    test: /P2022|column [`'"(].*does not exist|does not exist in the current database/i,
    what: 'The live code expects a database column that isn’t there yet, so every request touching that table fails. A database migration was merged but not applied.',
    fix: 'Yes — run `npx prisma migrate deploy` against the production database (not a schema or code change).',
    fixable: 'yes',
  },
  {
    test: /P2023|Error creating UUID|invalid input syntax for type uuid|Inconsistent column data/i,
    what: 'Someone asked for an ID that isn’t valid (bad link or an old login token), and the server crashed on it instead of saying “not found”.',
    fix: 'Yes — validate IDs and return 400/404 instead of 500 on this route.',
    fixable: 'yes',
  },
  {
    test: /P2002|Unique constraint/i,
    what: 'The database blocked a duplicate (e.g. the same thing submitted twice).',
    fix: 'Yes — return a friendly “already exists” (409) instead of an error.',
    fixable: 'yes',
  },
  {
    test: /P2025|Record to (update|delete) not found|No record was found/i,
    what: 'Something was updated or deleted that no longer exists.',
    fix: 'Yes — return 404 instead of 500 on this route.',
    fixable: 'yes',
  },
  {
    // Before the Accelerate rules: that alert's text says "fetch failed" too, but
    // here it is the website → backend hop, not the database.
    test: /cannot reach the backend|Website cannot reach/i,
    what: 'The website couldn’t connect to the backend at all.',
    fix: 'Check that the worker is up; one-offs are usually network blips.',
    fixable: 'maybe',
  },
  {
    // Prisma Accelerate runs on Cloudflare too; when it is overloaded Prisma wraps
    // Cloudflare's bare "error code: 1102" (or 1101…) page as an "Invalid
    // `prisma.x.y()` invocation". It carries no P-code and is not a schema problem.
    test: /Invalid `prisma[^`]*` invocation:[\s\S]*?error code: 1\d{3}\b/i,
    what: 'The database service (Prisma Accelerate) ran out of capacity on Cloudflare (error 1102/1101) and refused the query, so this page failed for that visitor.',
    fix: 'Partly — nothing in the Prisma schema needs changing. Read routes cache and retry once to ride it out; if it repeats across routes, check Prisma Accelerate limits and status.',
    fixable: 'maybe',
  },
  {
    test: /P60\d\d|Accelerate|ECONNRESET|fetch failed|socket hang up|connection (reset|closed|refused)|ETIMEDOUT/i,
    what: 'The database service (Prisma Accelerate) had a brief hiccup, so this request failed.',
    fix: 'Usually no — it’s on Prisma’s side. Only worth acting on if it keeps repeating.',
    fixable: 'no',
  },
  {
    test: /exceeded resource limits|Worker exceeded|exceededCpu|exceededMemory/i,
    what: 'A request used more CPU/memory than the Cloudflare Free plan allows, so Cloudflare cut it off.',
    fix: 'Maybe — make that route lighter, or move to Workers Paid ($5/mo) for higher limits.',
    fixable: 'maybe',
  },
  {
    test: /Backend crashed \(\d{3}\)/i,
    what: 'Cloudflare stopped the backend before it could answer, so the visitor got an error page.',
    fix: 'Maybe — if it repeats on the same route, that route needs optimising.',
    fixable: 'maybe',
  },
  {
    test: /Backend timed out|timed out|timeout/i,
    what: 'The website waited 15 seconds for the backend and gave up; the visitor saw “request timed out”.',
    fix: 'If it’s a one-off: no (network blip). If it repeats: yes — that route or the database is slow.',
    fixable: 'maybe',
  },
  {
    test: /signing key not in JWKS|different Clerk instance/i,
    what: 'Sign-ins are failing because the backend’s Clerk key belongs to a different Clerk instance than the app.',
    fix: 'Yes — config: set CLERK_SECRET_KEY to the production (sk_live_) key.',
    fixable: 'yes',
  },
  {
    test: /clerk session rejected/i,
    what: 'A sign-in was rejected because its session token was invalid or expired.',
    fix: 'One-off: no, that’s normal. Many in a row: yes — sign-in is broken, investigate.',
    fixable: 'maybe',
  },
  {
    test: /Clerk users API|JWKS|Clerk.*unavailable/i,
    what: 'Clerk (the sign-in provider) was unreachable, so sign-ins briefly failed.',
    fix: 'No — on Clerk’s side; it recovers by itself.',
    fixable: 'no',
  },
  {
    test: /verification email failed|error in sending mail|sendgrid|send.*mail/i,
    what: 'An email (verification, reset or notification) could not be sent.',
    fix: 'Maybe — check the SendGrid key/quota if it repeats.',
    fixable: 'maybe',
  },
  {
    test: /backup failed/i,
    what: 'Last night’s database backup didn’t finish.',
    fix: 'Yes — open the GitHub Actions run linked below to see why.',
    fixable: 'yes',
  },
  {
    test: /Daily digest failed/i,
    what: 'The daily report couldn’t be built.',
    fix: 'Yes — likely a database or Clerk API error; see details.',
    fixable: 'yes',
  },
];

// The 8B model contradicted itself ("No — we need to fix…"); the 70B one gave
// correct, plain answers in testing at ~16 neurons per alert (free: 10,000/day,
// and alerts are deduplicated to one per problem per 10 minutes).
const AI_MODEL = '@cf/meta/llama-3.3-70b-instruct-fp8-fast';
const AI_TIMEOUT_MS = 6000;

function byRule(text: string): Explanation | null {
  const rule = RULES.find((r) => r.test.test(text));
  return rule ? { what: rule.what, fix: rule.fix, fixable: rule.fixable, by: 'rule' } : null;
}

async function byAi(env: CFEnv, title: string, detail: string): Promise<Explanation | null> {
  if (!env.AI) return null;
  const prompt = [
    'You explain production errors from a student social app (Cloudflare Worker + Prisma + Postgres) to its non-technical founder.',
    'Reply with exactly two lines and nothing else:',
    'WHAT: <one or two short plain-English sentences: what happened and who was affected>',
    'FIX: <start with "Yes" (we can fix it in our code or config), "No" (outside our control, e.g. a provider outage) or "Maybe", then a dash and the concrete next step>',
    'Facts: a bare "error code: 1xxx" inside a Prisma "invocation" error is a Cloudflare error from the database provider (Prisma Accelerate), not a schema or code bug. Only suggest schema or query changes when the details name a Prisma P-code or a validation message.',
    '',
    `Alert: ${title}`,
    `Details: ${detail.slice(0, 1500)}`,
  ].join('\n');
  try {
    const out: any = await Promise.race([
      (env.AI as any).run(AI_MODEL, { messages: [{ role: 'user', content: prompt }], max_tokens: 160 }),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), AI_TIMEOUT_MS)),
    ]);
    const text = String(out?.response ?? '');
    const what = text.match(/WHAT:\s*(.+)/i)?.[1]?.trim();
    const fix = text.match(/FIX:\s*(.+)/i)?.[1]?.trim();
    if (!what || !fix) return null;
    const lead = fix.toLowerCase();
    const fixable: Fixable = lead.startsWith('yes') ? 'yes' : lead.startsWith('no') ? 'no' : 'maybe';
    return { what: what.slice(0, 300), fix: fix.slice(0, 200), fixable, by: 'ai' };
  } catch {
    return null;
  }
}

export async function explainAlert(env: CFEnv, title: string, detail = ''): Promise<Explanation> {
  const text = `${title}\n${detail}`;
  return (
    byRule(text) ??
    (await byAi(env, title, detail)) ?? {
      what: 'An unexpected server error happened on this route.',
      fix: 'Maybe — check the details below; repeated alerts mean a real bug to fix.',
      fixable: 'maybe',
      by: 'generic',
    }
  );
}
