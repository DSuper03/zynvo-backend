/**
 * Clerk session verification for the worker.
 *
 * Clients send the Clerk session JWT (`getToken()`); it is checked against
 * Clerk's JWKS and the caller's verified email addresses are read from the
 * Clerk Backend API, so the backend never trusts an email or clerkId taken
 * from the request body alone.
 */
import { verifyWithJwks } from 'hono/jwt';
import type { CFEnv } from './types';

const CLERK_API = 'https://api.clerk.com/v1';

export type ClerkSession = { clerkId: string; emails: string[] };

export type ClerkVerifyResult =
  | { ok: true; session: ClerkSession }
  // 'invalid': the token itself is bad or expired; 'unavailable': Clerk could not be reached.
  | { ok: false; reason: 'invalid' | 'unavailable'; detail: string };

export const isClerkConfigured = (env: CFEnv): boolean => Boolean(env.CLERK_SECRET_KEY);

// Clerk session tokens live ~60s and are minted on Clerk's servers, so a token
// fetched right after sign-up can carry an iat/nbf a moment ahead of this
// worker's clock. Hono checks these with zero tolerance; allow some skew.
const CLOCK_SKEW_SECONDS = 30;

/** Verifies a Clerk session token and loads the user's verified emails. */
export async function verifyClerkSession(env: CFEnv, token: string): Promise<ClerkVerifyResult> {
  if (!env.CLERK_SECRET_KEY) return { ok: false, reason: 'unavailable', detail: 'CLERK_SECRET_KEY not set' };
  if (!token) return { ok: false, reason: 'invalid', detail: 'empty token' };
  const auth = { headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` } };

  let payload: Record<string, unknown>;
  try {
    payload = await verifyWithJwks(
      token,
      {
        jwks_uri: `${CLERK_API}/jwks`,
        allowedAlgorithms: ['RS256'],
        // Time claims are checked below, with skew tolerance.
        verification: { exp: false, nbf: false, iat: false },
      },
      auth,
    );
  } catch (err: any) {
    const msg = String(err?.message ?? err);
    // A JWKS fetch failure is Clerk being unreachable, not a bad token.
    if (msg.includes('JWKS')) return { ok: false, reason: 'unavailable', detail: msg };
    return { ok: false, reason: 'invalid', detail: `${err?.name ?? 'Error'}: ${msg}` };
  }

  const now = Math.floor(Date.now() / 1000);
  const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : undefined);
  const exp = num(payload.exp);
  const nbf = num(payload.nbf);
  const iat = num(payload.iat);
  if (exp !== undefined && exp + CLOCK_SKEW_SECONDS <= now) {
    return { ok: false, reason: 'invalid', detail: `expired (exp=${exp}, now=${now})` };
  }
  if (nbf !== undefined && nbf - CLOCK_SKEW_SECONDS > now) {
    return { ok: false, reason: 'invalid', detail: `not yet valid (nbf=${nbf}, now=${now})` };
  }
  if (iat !== undefined && iat - CLOCK_SKEW_SECONDS > now) {
    return { ok: false, reason: 'invalid', detail: `issued in the future (iat=${iat}, now=${now})` };
  }
  if (typeof payload.sub !== 'string' || !payload.sub) {
    return { ok: false, reason: 'invalid', detail: 'missing sub' };
  }

  try {
    const res = await fetch(`${CLERK_API}/users/${encodeURIComponent(payload.sub)}`, auth);
    if (res.status === 404) return { ok: false, reason: 'invalid', detail: 'Clerk user not found' };
    if (!res.ok) return { ok: false, reason: 'unavailable', detail: `Clerk users API ${res.status}` };
    const user = (await res.json()) as {
      email_addresses?: { email_address: string; verification?: { status?: string } }[];
    };
    const emails = (user.email_addresses ?? [])
      .filter((e) => e.verification?.status === 'verified')
      .map((e) => e.email_address.toLowerCase());
    return { ok: true, session: { clerkId: payload.sub, emails } };
  } catch (err: any) {
    return { ok: false, reason: 'unavailable', detail: String(err?.message ?? err) };
  }
}

/**
 * Best-effort: keep the Clerk password in step with the backend one, since
 * web email sign-in checks the backend hash while the app signs in via Clerk.
 */
export async function setClerkPassword(env: CFEnv, clerkId: string, password: string): Promise<boolean> {
  if (!env.CLERK_SECRET_KEY) return false;
  try {
    const res = await fetch(`${CLERK_API}/users/${encodeURIComponent(clerkId)}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}`, 'content-type': 'application/json' },
      body: JSON.stringify({ password, sign_out_of_other_sessions: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
