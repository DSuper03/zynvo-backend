/*
  Warnings:

  - You are about to drop the column `content` on the `CreatePost` table. All the data in the column will be lost.
  - Added the required column `collegeId` to the `CreatePost` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CreatePost" DROP COLUMN "content",
ADD COLUMN     "collegeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "clubId" TEXT;

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "description" TEXT,
    "profilePicUrl" TEXT,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "EventName" TEXT NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clubs_name_key" ON "clubs"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_collegeId_key" ON "clubs"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "event_EventName_key" ON "event"("EventName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "clubs"("collegeId") ON DELETE RESTRICT ON UPDATE CASCADE;
