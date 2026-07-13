-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "User_collegeName_idx" ON "User"("collegeName");

-- CreateIndex
CREATE INDEX "User_clubId_idx" ON "User"("clubId");

-- CreateIndex
CREATE INDEX "clubs_name_idx" ON "clubs"("name");

-- CreateIndex
CREATE INDEX "clubs_collegeName_idx" ON "clubs"("collegeName");

-- CreateIndex
CREATE INDEX "clubs_name_collegeName_idx" ON "clubs"("name", "collegeName");

-- CreateIndex
CREATE INDEX "event_clubId_idx" ON "event"("clubId");

-- CreateIndex
CREATE INDEX "event_EventType_idx" ON "event"("EventType");

-- CreateIndex
CREATE INDEX "event_EventMode_idx" ON "event"("EventMode");

-- CreateIndex
CREATE INDEX "event_university_idx" ON "event"("university");

-- CreateIndex
CREATE INDEX "event_isPaid_idx" ON "event"("isPaid");

-- CreateIndex
CREATE INDEX "event_startDate_idx" ON "event"("startDate");

-- CreateIndex
CREATE INDEX "event_createdAt_idx" ON "event"("createdAt");
