/*
  Warnings:

  - A unique constraint covering the columns `[founderEmail]` on the table `clubs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactEmail` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `university` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `about` to the `speakers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "coremember1" TEXT DEFAULT 'none',
ADD COLUMN     "coremember2" TEXT DEFAULT 'none',
ADD COLUMN     "coremember3" TEXT DEFAULT 'none';

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "EventMode" TEXT NOT NULL DEFAULT 'Hybrid',
ADD COLUMN     "EventType" TEXT NOT NULL DEFAULT 'general',
ADD COLUMN     "EventUrl" TEXT DEFAULT '',
ADD COLUMN     "TeamSize" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "Venue" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "applicationStatus" TEXT NOT NULL DEFAULT 'open',
ADD COLUMN     "collegeStudentsOnly" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactPhone" INTEGER,
ADD COLUMN     "participationFee" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "posterUrl" TEXT DEFAULT '',
ADD COLUMN     "startDate" TEXT NOT NULL,
ADD COLUMN     "university" TEXT NOT NULL,
ALTER COLUMN "endDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "speakers" ADD COLUMN     "about" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "userEvents" ADD COLUMN     "uniquePassId" TEXT DEFAULT 'none';

-- CreateIndex
CREATE UNIQUE INDEX "clubs_founderEmail_key" ON "clubs"("founderEmail");
