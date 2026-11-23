/**
 * One quick retry for read queries that hit a transient Prisma Accelerate
 * failure. Accelerate runs on Cloudflare Workers too, and under load it can
 * answer a single query with a bare "error code: 1102" (resource limits) that
 * Prisma wraps as an "Invalid `prisma.x.y()` invocation"; the next attempt
 * normally succeeds. Only use it for idempotent reads.
 */
const TRANSIENT = /error code: 1\d{3}\b|P60\d\d|fetch failed|ECONNRESET|ETIMEDOUT|socket hang up/i;

export const isTransientDbError = (err: unknown): boolean =>
  TRANSIENT.test(String((err as any)?.message ?? err ?? ''));

export async function withRetry<T>(
  run: () => Promise<T>,
  { retries = 1, delayMs = 200 }: { retries?: number; delayMs?: number } = {},
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await run();
    } catch (err) {
      if (attempt >= retries || !isTransientDbError(err)) throw err;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}
