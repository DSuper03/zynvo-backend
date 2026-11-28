CREATE TABLE "CuratedKolkataEvent" (
  "id" TEXT PRIMARY KEY,
  "fingerprint" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "venue" TEXT NOT NULL,
  "dateLabel" TEXT NOT NULL,
  "startsAt" TIMESTAMP(3) NOT NULL,
  "endsAt" TIMESTAMP(3) NOT NULL,
  "priceLabel" TEXT,
  "sourceUrl" TEXT NOT NULL,
  "reviewedAt" TIMESTAMP(3),
  "publishedAt" TIMESTAMP(3),
  "reviewMessageId" INTEGER,
  "notifyDay" TEXT UNIQUE
);
CREATE INDEX "CuratedKolkataEvent_publishedAt_endsAt_idx" ON "CuratedKolkataEvent" ("publishedAt", "endsAt");
CREATE TABLE "KolkataAlertSubscriber" (
  "userId" TEXT PRIMARY KEY REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
