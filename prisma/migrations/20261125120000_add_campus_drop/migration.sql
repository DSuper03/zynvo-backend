-- Campus Drop: one surprise question a day (src/worker/campus-drop).
-- Only new tables; no existing table changes. Safe to run more than once.

CREATE TABLE IF NOT EXISTS "CampusDrop" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'poll',
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "teaser" TEXT NOT NULL,
    "sendAt" TIMESTAMP(3) NOT NULL,
    "sentAt" TIMESTAMP(3),
    "closesAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampusDrop_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "CampusDrop_day_key" ON "CampusDrop"("day");
CREATE INDEX IF NOT EXISTS "CampusDrop_sentAt_idx" ON "CampusDrop"("sentAt");

CREATE TABLE IF NOT EXISTS "CampusDropAnswer" (
    "id" TEXT NOT NULL,
    "dropId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "option" INTEGER NOT NULL,
    "collegeName" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampusDropAnswer_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "CampusDropAnswer_dropId_fkey" FOREIGN KEY ("dropId") REFERENCES "CampusDrop"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "CampusDropAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "CampusDropAnswer_dropId_userId_key" ON "CampusDropAnswer"("dropId", "userId");
CREATE INDEX IF NOT EXISTS "CampusDropAnswer_dropId_collegeName_idx" ON "CampusDropAnswer"("dropId", "collegeName");
CREATE INDEX IF NOT EXISTS "CampusDropAnswer_userId_idx" ON "CampusDropAnswer"("userId");

CREATE TABLE IF NOT EXISTS "CampusDropOptOut" (
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CampusDropOptOut_pkey" PRIMARY KEY ("userId"),
    CONSTRAINT "CampusDropOptOut_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
