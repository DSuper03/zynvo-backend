import { Prisma } from '@prisma/client';

export type LeaderboardPeriod = 'week' | 'month' | 'all';
export type LeaderboardKind = 'clubs' | 'events';
export interface LeaderboardOptions {
  period: LeaderboardPeriod;
  kind: LeaderboardKind;
  college: string;
  search: string;
  page: number;
}
export interface LeaderboardEntry {
  id: string;
  name: string;
  college: string;
  image: string | null;
  clubName: string | null;
  registrations: number;
  uniqueStudents: number;
  eventsCount: number;
  rank: number;
}
export interface LeaderboardData {
  entries: LeaderboardEntry[];
  colleges: string[];
  totals: {
    registrations: number;
    uniqueStudents: number;
    eventsCount: number;
    rankedCount: number;
  };
}

export const LEADERBOARD_PAGE_SIZE = 25;
export const LEADERBOARD_MAX_PAGE = 1000;

const IST_OFFSET = 330 * 60 * 1000;
/** Calendar weeks begin Monday at 00:00 Asia/Kolkata; ranges are [start, now). */
export function leaderboardWindow(period: LeaderboardPeriod, now = new Date()) {
  const local = new Date(now.getTime() + IST_OFFSET);
  let start: Date | null = null;
  if (period !== 'all') {
    const day =
      period === 'month'
        ? 1
        : local.getUTCDate() - ((local.getUTCDay() + 6) % 7);
    start = new Date(
      Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), day) - IST_OFFSET
    );
  }
  return { start, end: now };
}

export function parseLeaderboardOptions(
  params: URLSearchParams
): LeaderboardOptions {
  const period = params.get('period') ?? 'week';
  const kind = params.get('kind') ?? 'clubs';
  const page = params.get('page') ?? '1';
  const college = (params.get('college') ?? '').trim();
  const search = (params.get('search') ?? '').trim();
  const allowed = new Set(['period', 'kind', 'page', 'college', 'search']);
  for (const key of params.keys()) {
    if (!allowed.has(key) || params.getAll(key).length !== 1) {
      throw new Error('Invalid leaderboard filters');
    }
  }
  if (
    !['week', 'month', 'all'].includes(period) ||
    !['clubs', 'events'].includes(kind) ||
    !/^[1-9]\d{0,4}$/.test(page) ||
    Number(page) > LEADERBOARD_MAX_PAGE ||
    college.length > 200 ||
    search.length > 100 ||
    /[\u0000-\u001f\u007f]/.test(college + search)
  ) {
    throw new Error('Invalid leaderboard filters');
  }
  return {
    period: period as LeaderboardPeriod,
    kind: kind as LeaderboardKind,
    page: Number(page),
    college,
    search,
  };
}

export function leaderboardQuery(options: LeaderboardOptions, now: Date) {
  const { start, end } = leaderboardWindow(options.period, now);
  const isClubs = options.kind === 'clubs';
  const identity = isClubs ? Prisma.sql`c.id` : Prisma.sql`e.id`;
  const name = isClubs ? Prisma.sql`c.name` : Prisma.sql`e."EventName"`;
  const image = isClubs
    ? Prisma.sql`c."profilePicUrl"`
    : Prisma.sql`e."posterUrl"`;
  // Escape LIKE metacharacters so search is a literal substring, never a pattern.
  const search = '%' + options.search.replace(/[\\%_]/g, '\\$&') + '%';
  return Prisma.sql`
    WITH eligible AS (
      SELECT ${identity} AS id, ${name} AS name, ${image} AS image,
        c."collegeName" AS college, c.name AS "clubName",
        u."userId", u."eventId"
      FROM "userEvents" u
      JOIN event e ON e.id = u."eventId"
      JOIN clubs c ON c.id = e."clubId"
      WHERE LOWER(TRIM(u."approvalStatus")) = 'approved'
        -- Express historically records APPROVED; Workers record CONFIRMED.
        -- A screenshot alone is not verification in either runtime.
        AND (NOT e."isPaid" OR (UPPER(TRIM(u."paymentStatus")) IN ('CONFIRMED', 'APPROVED') AND u."paymentVerifiedAt" IS NOT NULL))
        AND NOT e."coreTeamOnly"
        AND LOWER(TRIM(e."applicationStatus")) NOT IN ('cancelled', 'canceled', 'draft')
        AND u."joinedAt" < ${end}
        ${start ? Prisma.sql`AND u."joinedAt" >= ${start}` : Prisma.empty}
        ${options.college ? Prisma.sql`AND c."collegeName" = ${options.college}` : Prisma.empty}
    ), grouped AS (
      SELECT id, name, image, college, "clubName", COUNT(*)::int AS registrations,
        COUNT(DISTINCT "userId")::int AS "uniqueStudents",
        COUNT(DISTINCT "eventId")::int AS "eventsCount"
      FROM eligible GROUP BY id, name, image, college, "clubName"
    ), ranked AS (
      SELECT *, RANK() OVER (ORDER BY registrations DESC)::int AS rank FROM grouped
    ), filtered AS (
      SELECT * FROM ranked
      WHERE name ILIKE ${search} OR college ILIKE ${search}
    ), page AS (
      SELECT * FROM filtered ORDER BY rank, LOWER(name), id
      LIMIT ${LEADERBOARD_PAGE_SIZE} OFFSET ${(options.page - 1) * LEADERBOARD_PAGE_SIZE}
    )
    SELECT json_build_object(
      'entries', COALESCE((SELECT json_agg(page ORDER BY rank, LOWER(name), id) FROM page), '[]'::json),
      'colleges', COALESCE((SELECT json_agg(college ORDER BY college) FROM
        (SELECT DISTINCT "collegeName" AS college FROM clubs WHERE TRIM("collegeName") <> '') colleges), '[]'::json),
      'totals', json_build_object(
        'rankedCount', (SELECT COUNT(*)::int FROM filtered),
        'registrations', (SELECT COUNT(*)::int FROM eligible WHERE id IN (SELECT id FROM filtered)),
        'uniqueStudents', (SELECT COUNT(DISTINCT "userId")::int FROM eligible WHERE id IN (SELECT id FROM filtered)),
        'eventsCount', (SELECT COUNT(DISTINCT "eventId")::int FROM eligible WHERE id IN (SELECT id FROM filtered))
      )
    ) AS data
  `;
}

export async function getLeaderboard(
  db: { $queryRaw<T = unknown>(query: Prisma.Sql): Promise<T> },
  options: LeaderboardOptions,
  now = new Date()
) {
  const result = await db.$queryRaw<{ data: LeaderboardData }[]>(
    leaderboardQuery(options, now)
  );
  const window = leaderboardWindow(options.period, now);
  return {
    ...result[0].data,
    period: options.period,
    kind: options.kind,
    college: options.college,
    page: options.page,
    pageSize: LEADERBOARD_PAGE_SIZE,
    maxPage: LEADERBOARD_MAX_PAGE,
    timezone: 'Asia/Kolkata',
    start: window.start?.toISOString() ?? null,
    end: window.end.toISOString(),
    generatedAt: now.toISOString(),
  };
}
