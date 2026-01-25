/*
  Warnings:

  - You are about to drop the column `isPaidEvent` on the `event` table. All the data in the column will be lost.
  - You are about to drop the `eventPayment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "eventPayment" DROP CONSTRAINT "eventPayment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "eventPayment" DROP CONSTRAINT "eventPayment_userId_eventId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "isPaidEvent",
ADD COLUMN     "isPaid" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "userEvents" ADD COLUMN     "paymentScreenshotUrl" TEXT DEFAULT '',
ADD COLUMN     "paymentStatus" TEXT NOT NULL DEFAULT 'CONFIRMED',
ADD COLUMN     "paymentVerifiedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "eventPayment";
