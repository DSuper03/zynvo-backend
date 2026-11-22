-- One concurrent index per migration: do not wrap this statement in a transaction.
CREATE INDEX CONCURRENTLY "userEvents_joinedAt_eventId_idx" ON "userEvents"("joinedAt", "eventId");
