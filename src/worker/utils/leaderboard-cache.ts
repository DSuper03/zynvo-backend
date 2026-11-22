import type { LeaderboardOptions } from './leaderboard';

/** Do not carry last week's/month's results over an IST period boundary. */
export function leaderboardCacheSeconds(
  options: LeaderboardOptions,
  now = new Date(),
  servedAt = now
): number {
  const elapsed = Math.max(
    0,
    Math.ceil((servedAt.getTime() - now.getTime()) / 1000)
  );
  if (options.period === 'all') return Math.max(0, 30 - elapsed);
  const offset = 330 * 60_000;
  const local = new Date(now.getTime() + offset);
  const next =
    options.period === 'month'
      ? Date.UTC(local.getUTCFullYear(), local.getUTCMonth() + 1, 1) - offset
      : Date.UTC(
          local.getUTCFullYear(),
          local.getUTCMonth(),
          local.getUTCDate() + 7 - ((local.getUTCDay() + 6) % 7)
        ) - offset;
  return Math.max(
    0,
    Math.min(30, Math.floor((next - now.getTime()) / 1000)) - elapsed
  );
}

/** Canonical, viewer-independent cache key. No authorization/cookies are stored. */
export function leaderboardCacheKey(
  url: string,
  options: LeaderboardOptions
): Request {
  const key = new URL('/api/v1/leaderboard', url);
  key.search = new URLSearchParams({
    kind: options.kind,
    period: options.period,
    college: options.college,
    search: options.search,
    page: String(options.page),
  }).toString();
  return new Request(key, { method: 'GET' });
}
