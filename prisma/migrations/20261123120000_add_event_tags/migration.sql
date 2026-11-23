-- Free-form tags organisers add to an event (lowercase, max 5, validated in the API).
ALTER TABLE "event" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
