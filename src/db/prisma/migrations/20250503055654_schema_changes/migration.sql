/*
  Warnings:

  - You are about to drop the `Author` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AuthorToCreatePost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AuthorToCreatePost" DROP CONSTRAINT "_AuthorToCreatePost_A_fkey";

-- DropForeignKey
ALTER TABLE "_AuthorToCreatePost" DROP CONSTRAINT "_AuthorToCreatePost_B_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "eventAttended" TEXT;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "eventHeaderImage" TEXT DEFAULT 'none',
ADD COLUMN     "prizes" TEXT NOT NULL DEFAULT 'no prizes given';

-- DropTable
DROP TABLE "Author";

-- DropTable
DROP TABLE "_AuthorToCreatePost";

-- CreateTable
CREATE TABLE "speakers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "speakers_email_key" ON "speakers"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_eventAttended_fkey" FOREIGN KEY ("eventAttended") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
