/*
  Warnings:

  - The `type` column on the `clubs` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "clubs" DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'General';
