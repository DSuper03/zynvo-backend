/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "expiryToken" TIMESTAMP(3),
ADD COLUMN     "isVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "vToken" TEXT;

-- DropTable
DROP TABLE "VerificationToken";
