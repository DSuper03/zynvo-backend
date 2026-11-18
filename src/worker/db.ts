import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Create a Prisma client bound to a specific DATABASE_URL.
 *
 * Prisma Accelerate uses HTTP under the hood — fully compatible with
 * the Cloudflare Workers runtime (no TCP sockets needed).
 *
 * Prefer getPrismaClient(): building a client costs ~9 ms CPU and ~5 MB, and
 * its first query also builds the WASM query compiler and fetches connection
 * info. Doing that on every request pushed requests over the Workers CPU /
 * memory limits ("Worker exceeded resource limits", 503).
 */
export function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  }).$extends(withAccelerate());
}

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;

// One client per isolate, rebuilt only if DATABASE_URL changes. Accelerate
// queries are independent HTTP requests, so sharing the client between
// requests holds no connection or stream across request boundaries.
let cached: { url: string; client: AppPrismaClient } | null = null;

export function getPrismaClient(databaseUrl: string): AppPrismaClient {
  if (cached?.url !== databaseUrl) {
    cached = { url: databaseUrl, client: createPrismaClient(databaseUrl) };
  }
  return cached.client;
}
