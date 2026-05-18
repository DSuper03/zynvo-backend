/*
  Warnings:

  - Added the required column `ValidFor` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "ValidFor" INTEGER NOT NULL,
DROP COLUMN "expiryToken",
ADD COLUMN     "expiryToken" INTEGER NOT NULL;
