/**
 * Campus Drop: one surprise question a day, pushed to everyone at the same
 * random minute. It stays open for LIVE_MINUTES; only people who answer while
 * it is live see how their campus voted.
 *
 * Everything here is pure (no I/O) so the timing rules are easy to test.
 * Users are almost all in India, so all times are IST (UTC+5:30, no DST).
 */

export const IST_OFFSET_MS = (5 * 60 + 30) * 60 * 1000;

/** Drops go out between 07:00 and 01:00 IST. 01:00-07:00 is sleep time. */
export const WINDOW_START_HOUR = 7;
export const WINDOW_END_HOUR = 1; // next day

export const LIVE_MINUTES = 10;
export const LIVE_MS = LIVE_MINUTES * 60 * 1000;
/** Answers sent a few seconds after closing still count (slow networks). */
export const ANSWER_GRACE_MS = 30 * 1000;
/** A campus result is shown only once this many people there have answered. */
export const MIN_CAMPUS_ANSWERS = 5;

const MINUTE = 60 * 1000;

export type DropWindow = {
  /** IST date the window starts on, e.g. "2026-11-25". */
  day: string;
  start: Date;
  end: Date;
};

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The drop window `now` falls in, or null during quiet hours (01:00-07:00 IST).
 * Between 00:00 and 01:00 IST we are still in the previous day's window.
 */
export function dropWindowAt(now: Date): DropWindow | null {
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const hour = ist.getUTCHours();
  if (hour >= WINDOW_END_HOUR && hour < WINDOW_START_HOUR) return null;

  // Midnight to 01:00 belongs to the window that started yesterday.
  if (hour < WINDOW_END_HOUR) ist.setUTCDate(ist.getUTCDate() - 1);
  const y = ist.getUTCFullYear();
  const m = ist.getUTCMonth();
  const d = ist.getUTCDate();

  return {
    day: `${y}-${pad(m + 1)}-${pad(d)}`,
    start: new Date(Date.UTC(y, m, d, WINDOW_START_HOUR) - IST_OFFSET_MS),
    end: new Date(Date.UTC(y, m, d + 1, WINDOW_END_HOUR) - IST_OFFSET_MS),
  };
}

/**
 * A random whole minute in what is left of the window, at least a minute from
 * now and a minute before it ends. If there is no room left, send right away.
 */
export function pickSendAt(window: DropWindow, now: Date, random: () => number = Math.random): Date {
  const earliest = Math.max(window.start.getTime(), now.getTime() + MINUTE);
  const latest = window.end.getTime() - MINUTE;
  if (earliest >= latest) return new Date(now.getTime());
  const at = earliest + Math.floor(random() * (latest - earliest));
  return new Date(Math.floor(at / MINUTE) * MINUTE);
}

/** True when a planned, unsent drop is due and we're still inside its window. */
export function isDue(drop: { day: string; sendAt: Date; sentAt: Date | null }, now: Date): boolean {
  if (drop.sentAt) return false;
  if (now.getTime() < drop.sendAt.getTime()) return false;
  return dropWindowAt(now)?.day === drop.day;
}

export function isLive(drop: { sentAt: Date | null; closesAt: Date | null }, now: Date): boolean {
  if (!drop.sentAt || !drop.closesAt) return false;
  return now.getTime() >= drop.sentAt.getTime() && now.getTime() < drop.closesAt.getTime();
}

export function canAnswer(drop: { sentAt: Date | null; closesAt: Date | null }, now: Date): boolean {
  if (!drop.sentAt || !drop.closesAt) return false;
  return now.getTime() >= drop.sentAt.getTime() && now.getTime() < drop.closesAt.getTime() + ANSWER_GRACE_MS;
}

/** Days since 2026-01-01, used to rotate through the question bank. */
export function dayNumber(day: string): number {
  return Math.round((Date.parse(`${day}T00:00:00Z`) - Date.UTC(2026, 0, 1)) / (24 * 60 * MINUTE));
}

export function pickQuestion<T>(bank: readonly T[], day: string): T {
  const n = bank.length;
  return bank[((dayNumber(day) % n) + n) % n];
}

// ── Results ────────────────────────────────────────────────────

/** Users who never picked a college have this placeholder name. */
const NO_COLLEGE = new Set(['', 'not joined']);
export const hasCollege = (name: string | null | undefined): name is string =>
  !!name && !NO_COLLEGE.has(name.trim().toLowerCase());

export type AnswerGroup = { option: number; collegeName: string; count: number };

export type Tally = { total: number; counts: number[] };

export type DropResults = {
  overall: Tally;
  /** Null when the user has no college or fewer than MIN_CAMPUS_ANSWERS there answered. */
  campus: (Tally & { name: string }) | null;
};

const emptyTally = (options: number): Tally => ({ total: 0, counts: Array(options).fill(0) });

function add(t: Tally, option: number, count: number) {
  if (option < 0 || option >= t.counts.length) return;
  t.counts[option] += count;
  t.total += count;
}

export function buildResults(groups: AnswerGroup[], options: number, college: string | null): DropResults {
  const overall = emptyTally(options);
  const campus = emptyTally(options);
  const mine = hasCollege(college) ? college.trim().toLowerCase() : null;
  for (const g of groups) {
    add(overall, g.option, g.count);
    if (mine && g.collegeName.trim().toLowerCase() === mine) add(campus, g.option, g.count);
  }
  return {
    overall,
    campus: mine && campus.total >= MIN_CAMPUS_ANSWERS ? { name: college!.trim(), ...campus } : null,
  };
}

// ── Streaks ────────────────────────────────────────────────────

/**
 * How many drops in a row the user answered, newest first. A drop that is
 * still live and not yet answered doesn't break the streak.
 */
export function computeStreak(sentDropIdsNewestFirst: string[], answered: Set<string>, liveDropId?: string | null): number {
  let streak = 0;
  for (const id of sentDropIdsNewestFirst) {
    if (answered.has(id)) streak++;
    else if (id === liveDropId) continue;
    else break;
  }
  return streak;
}
