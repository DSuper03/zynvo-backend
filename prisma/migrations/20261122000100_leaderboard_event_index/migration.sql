-- Keep registration writes available on existing databases.
CREATE INDEX CONCURRENTLY "userEvents_eventId_idx" ON "userEvents"("eventId");
