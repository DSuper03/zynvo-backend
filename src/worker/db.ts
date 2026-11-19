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

export type PrismaLease = {
  client: AppPrismaClient;
  /** Give the client back to the pool (unless it was discarded or never connected). */
  release: () => void;
  /** Never reuse this client: something went wrong with it. */
  discard: () => void;
};

// Creating a client immediately starts its connection in the background
// (/connection-info + loading the query compiler), and while that is running
// Prisma makes every caller wait on the same promise. A request that creates
// a client but never queries (a 401, a 429, a health check) used to end with
// that promise still pending and hand the client to the pool; the next
// request to borrow it then waited on a promise that belonged to a finished
// request, which Workers refuse to settle:
//   "This promise was created by a request that has since ended, so it can
//    never settle." (500 on comment counts, following lists, ...)
// So the request that creates a client waits here until it is connected,
// before the client is lent to anyone. A client that fails to connect is
// still lent to its creator (its first query reports the real error) but is
// not pooled.
export async function acquirePrismaClient(databaseUrl: string): Promise<PrismaLease> {
  // Most recently returned first: its connection is the warmest.
  let i = idle.length - 1;
  while (i >= 0 && idle[i].url !== databaseUrl) i--;
  let entry = i >= 0 ? idle.splice(i, 1)[0] : null;
  let poolable = true;

  if (!entry) {
    created++;
    const client = createPrismaClient(databaseUrl);
    entry = { url: databaseUrl, client };
    try {
      await client.$connect();
    } catch {
      poolable = false;
    }
  }

  const leased = entry;
  let done = false;
  return {
    client: leased.client,
    discard: () => {
      poolable = false;
    },
    release: () => {
      if (done) return;
      done = true;
      if (!poolable) return;
      // A changed DATABASE_URL retires old clients; beyond MAX_IDLE they're dropped.
      for (let j = idle.length - 1; j >= 0; j--) if (idle[j].url !== databaseUrl) idle.splice(j, 1);
      if (idle.length < MAX_IDLE) idle.push(leased);
    },
  };
}

/** Pool stats, for tests. */
export const poolStats = () => ({ idle: idle.length, created });
