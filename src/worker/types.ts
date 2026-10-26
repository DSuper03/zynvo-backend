import type { PrismaClient } from '@prisma/client';

// ── Cloudflare Worker environment bindings ────────────────────
// These come from wrangler.toml [vars] and `wrangler secret put`
export type CFEnv = {
  DATABASE_URL: string;
  JWT_SECRET: string;
  FE_URL: string;
  ADMIN_EMAILS: string;
  FIREBASE_PROJECT_ID: string;
  FIREBASE_CLIENT_EMAIL: string;
  FIREBASE_PRIVATE_KEY: string;
  CLERK_SECRET_KEY: string;
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
