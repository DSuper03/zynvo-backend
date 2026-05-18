/*
  Warnings:

  - You are about to drop the column `eventAttended` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_eventAttended_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "eventAttended";

-- AlterTable
ALTER TABLE "speakers" ADD COLUMN     "profilePic" TEXT;

-- CreateTable
CREATE TABLE "userEvents" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userEvents_pkey" PRIMARY KEY ("userId","eventId")
);

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
