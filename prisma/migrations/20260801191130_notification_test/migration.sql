/*
  Warnings:

  - You are about to drop the `DeviceToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DeviceToken" DROP CONSTRAINT "DeviceToken_userId_fkey";

-- DropTable
DROP TABLE "DeviceToken";
