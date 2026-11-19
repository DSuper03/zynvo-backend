import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

/**
 * Create a Prisma client bound to a specific DATABASE_URL.
 *
 * Prisma Accelerate uses HTTP under the hood — fully compatible with
 * the Cloudflare Workers runtime (no TCP sockets needed).
 *
 * Prefer acquirePrismaClient(): building a client costs ~9 ms CPU and ~5 MB,
 * and creating one immediately starts its connection (/connection-info).
 * Building one per request pushed requests over the Workers CPU / memory
 * limits ("Worker exceeded resource limits", 503).
 */
export function createPrismaClient(databaseUrl: string) {
  return new PrismaClient({
    accelerateUrl: databaseUrl,
  }).$extends(withAccelerate());
}

export type AppPrismaClient = ReturnType<typeof createPrismaClient>;

// ── Per-isolate client pool ───────────────────────────────────
//
// One client shared by every request crashed some requests (Error 1101 /
// 500s on dashboards): the client's connection is started by whichever
// request created it, and Workers don't let one request wait on another
// request's I/O. A request that arrived while it was still pending (or whose
// work got merged with another request's) hung or failed.
//
// So each request borrows a client for itself and gives it back when it —
// including its waitUntil() background work — is done. Simultaneous requests
// never share a client; requests one after another reuse the same few
// clients, so the per-request build cost doesn't come back.

const MAX_IDLE = 4; // clients kept for reuse per isolate
const idle: { url: string; client: AppPrismaClient }[] = [];
let created = 0; // for tests / diagnostics

export type PrismaLease = { client: AppPrismaClient; release: () => void };

export function acquirePrismaClient(databaseUrl: string): PrismaLease {
  // Most recently returned first: its connection is the warmest.
  let i = idle.length - 1;
  while (i >= 0 && idle[i].url !== databaseUrl) i--;
  const entry = i >= 0 ? idle.splice(i, 1)[0] : { url: databaseUrl, client: (created++, createPrismaClient(databaseUrl)) };
  let released = false;
  return {
    client: entry.client,
    release: () => {
      if (released) return;
      released = true;
      // A changed DATABASE_URL retires old clients; beyond MAX_IDLE they're dropped.
      for (let j = idle.length - 1; j >= 0; j--) if (idle[j].url !== databaseUrl) idle.splice(j, 1);
      if (idle.length < MAX_IDLE) idle.push(entry);
    },
  };
}

/** Pool stats, for tests. */
export const poolStats = () => ({ idle: idle.length, created });
