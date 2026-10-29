import type { PrismaClient } from '@prisma/client';

// ── Cloudflare Worker environment bindings ────────────────────
// These come from wrangler.toml [vars] and `wrangler secret put`
/** Cloudflare Rate Limiting binding (wrangler.toml [[ratelimits]]). */
export type RateLimitBinding = { limit(options: { key: string }): Promise<{ success: boolean }> };

export type CFEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  FE_URL: string;
  ADMIN_EMAILS: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  CLERK_SECRET_KEY: string;
  SENDGRID_API_KEY?: string;
  SENDGRID_FROM?: string;
  SENDGRID_CONTACT_FROM?: string;
  /** 'true' once every client sends a Clerk session token to clerkLogin. */
  REQUIRE_CLERK_TOKEN?: string;
  /** Shared with the Next.js proxy; marks requests whose x-zynvo-client-ip can be trusted. */
  INTERNAL_PROXY_SECRET?: string;
  RL_5?: RateLimitBinding;
  RL_10?: RateLimitBinding;
  RL_20?: RateLimitBinding;
  RL_30?: RateLimitBinding;
  RL_100?: RateLimitBinding;
  NODE_ENV: string;
};

// ── Variables set by middleware within a single request ────────
export type HonoVariables = {
  userId: string;
  isVerified: boolean;
  userEmail: string;
  // club head context (set by clubHeadAuth middleware)
  clubId?: string;
  clubName?: string;
  clubCollege?: string;
  // prisma client bound to this request's DB URL
  prisma: PrismaClient;
};

// ── Top-level Hono env type used throughout all routes ─────────
export type HonoEnv = {
  Bindings: CFEnv;
  Variables: HonoVariables;
};
