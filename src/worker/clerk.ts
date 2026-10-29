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

export const isClerkConfigured = (env: CFEnv): boolean => Boolean(env.CLERK_SECRET_KEY);

/** Returns the verified session, or null when the token is invalid or expired. */
export async function verifyClerkSession(env: CFEnv, token: string): Promise<ClerkSession | null> {
  if (!env.CLERK_SECRET_KEY || !token) return null;
  const auth = { headers: { Authorization: `Bearer ${env.CLERK_SECRET_KEY}` } };
  try {
    const payload = await verifyWithJwks(
      token,
      { jwks_uri: `${CLERK_API}/jwks`, allowedAlgorithms: ['RS256'] },
      auth,
    );
    if (typeof payload.sub !== 'string' || !payload.sub) return null;

    const res = await fetch(`${CLERK_API}/users/${encodeURIComponent(payload.sub)}`, auth);
    if (!res.ok) return null;
    const user = (await res.json()) as {
      email_addresses?: { email_address: string; verification?: { status?: string } }[];
    };
    const emails = (user.email_addresses ?? [])
      .filter((e) => e.verification?.status === 'verified')
      .map((e) => e.email_address.toLowerCase());
    return { clerkId: payload.sub, emails };
  } catch {
    return null;
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
