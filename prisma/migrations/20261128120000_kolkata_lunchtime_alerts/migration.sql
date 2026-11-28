ALTER TABLE "CuratedKolkataEvent" DROP CONSTRAINT IF EXISTS "CuratedKolkataEvent_notifyDay_key";
DROP INDEX IF EXISTS "CuratedKolkataEvent_notifyDay_key";
ALTER TABLE "CuratedKolkataEvent" ADD COLUMN "alertArea" TEXT, ADD COLUMN "claimedAt" TIMESTAMP(3);
CREATE UNIQUE INDEX "CuratedKolkataEvent_alertArea_notifyDay_key" ON "CuratedKolkataEvent" ("alertArea", "notifyDay");
ALTER TABLE "KolkataAlertSubscriber" ADD COLUMN "area" TEXT;
