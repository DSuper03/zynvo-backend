/*
  Warnings:

  - A unique constraint covering the columns `[collegeName]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clubId` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `clubName` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clubName" TEXT DEFAULT 'No Club Joined',
ADD COLUMN     "collegeName" TEXT NOT NULL DEFAULT 'not joined',
ALTER COLUMN "clubId" SET DEFAULT 'No Club Joined';

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "clubId" TEXT NOT NULL,
ADD COLUMN     "clubName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_collegeName_key" ON "User"("collegeName");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
