/*
  Warnings:

  - Made the column `description` on table `clubs` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "clubType" AS ENUM ('Technology', 'Cultural', 'Business', 'Social', 'Literature', 'Design', 'General');

-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "clubContact" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "facultyEmail" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "founderEmail" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "requirements" TEXT DEFAULT 'none',
ADD COLUMN     "type" "clubType" NOT NULL DEFAULT 'General',
ALTER COLUMN "description" SET NOT NULL;
