import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Create a Prisma client bound to a specific DATABASE_URL.
 * Called once per request from the app middleware so each request
 * gets a fresh client with the correct Accelerate connection string.
 *
 * Prisma Accelerate uses HTTP under the hood — fully compatible with
 * the Cloudflare Workers runtime (no TCP sockets needed).
 */
export function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    datasourceUrl: databaseUrl,
  }).$extends(withAccelerate());
}

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;
