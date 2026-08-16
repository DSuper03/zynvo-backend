/*
  Warnings:

  - Made the column `redemptionLink` on table `Offer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Offer" ALTER COLUMN "redemptionLink" SET NOT NULL;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "desiredSponsors" TEXT;
