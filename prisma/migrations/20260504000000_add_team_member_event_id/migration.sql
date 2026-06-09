-- AlterTable
ALTER TABLE "TeamMember" ADD COLUMN "eventId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_eventId_userId_key" ON "TeamMember"("eventId", "userId");

-- CreateTable
CREATE TABLE "ScheduleDay" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "ScheduleDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleDay_eventId_day_key" ON "ScheduleDay"("eventId", "day");

-- AddForeignKey
ALTER TABLE "ScheduleDay" ADD CONSTRAINT "ScheduleDay_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "ScheduleSession" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL,
    "speakers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scheduleDayId" TEXT NOT NULL,

    CONSTRAINT "ScheduleSession_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScheduleSession" ADD CONSTRAINT "ScheduleSession_scheduleDayId_fkey" FOREIGN KEY ("scheduleDayId") REFERENCES "ScheduleDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "userEvents" ALTER COLUMN "paymentStatus" SET DEFAULT 'CONFIRMED';
