-- AlterTable
ALTER TABLE "event" ADD COLUMN     "acceptanceBased" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "userEvents" ADD COLUMN     "approvalStatus" TEXT NOT NULL DEFAULT 'approved';

-- CreateTable
CREATE TABLE "eventQueue" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventQueue_userId_eventId_key" ON "eventQueue"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "eventQueue" ADD CONSTRAINT "eventQueue_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventQueue" ADD CONSTRAINT "eventQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
