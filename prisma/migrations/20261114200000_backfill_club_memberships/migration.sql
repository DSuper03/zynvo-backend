-- Backfill UserClubMembership from the legacy single-club pointer (User.clubId).
-- Accounts from before memberships existed only have User.clubId, so their club
-- was missing from membership-based features (profile club list, leaving).
-- Insert-only: existing memberships are untouched (ON CONFLICT DO NOTHING) and
-- pointers to clubs that no longer exist are skipped by the join.
INSERT INTO "UserClubMembership" ("id", "userId", "clubId", "joinedAt")
SELECT gen_random_uuid()::text, u."id", u."clubId", CURRENT_TIMESTAMP
FROM "User" u
JOIN "clubs" c ON c."id" = u."clubId"
WHERE u."clubId" IS NOT NULL
ON CONFLICT ("userId", "clubId") DO NOTHING;
