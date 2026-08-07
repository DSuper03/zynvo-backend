/*
  Warnings:

  - You are about to drop the column `claimCount` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `couponCode` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `redeemCount` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the `OfferClaim` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[EventName]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "CreatePost" DROP CONSTRAINT "CreatePost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "CreatePost" DROP CONSTRAINT "CreatePost_collegeId_fkey";

-- DropForeignKey
ALTER TABLE "OfferClaim" DROP CONSTRAINT "OfferClaim_offerId_fkey";

-- DropForeignKey
ALTER TABLE "OfferClaim" DROP CONSTRAINT "OfferClaim_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostDownvote" DROP CONSTRAINT "PostDownvote_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostDownvote" DROP CONSTRAINT "PostDownvote_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostUpvote" DROP CONSTRAINT "PostUpvote_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostUpvote" DROP CONSTRAINT "PostUpvote_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMember" DROP CONSTRAINT "TeamMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_clubId_fkey";

-- DropForeignKey
ALTER TABLE "clubAnnouncement" DROP CONSTRAINT "clubAnnouncement_clubId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_clubId_fkey";

-- DropForeignKey
ALTER TABLE "eventAnnouncement" DROP CONSTRAINT "eventAnnouncement_eventId_fkey";

-- DropForeignKey
ALTER TABLE "eventGallery" DROP CONSTRAINT "eventGallery_eventId_fkey";

-- DropForeignKey
ALTER TABLE "judges" DROP CONSTRAINT "judges_eventId_fkey";

-- DropForeignKey
ALTER TABLE "speakers" DROP CONSTRAINT "speakers_eventId_fkey";

-- DropForeignKey
ALTER TABLE "userEvents" DROP CONSTRAINT "userEvents_eventId_fkey";

-- DropForeignKey
ALTER TABLE "userEvents" DROP CONSTRAINT "userEvents_userId_fkey";

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "claimCount",
DROP COLUMN "couponCode",
DROP COLUMN "redeemCount";

-- DropTable
DROP TABLE "OfferClaim";

-- CreateIndex
CREATE UNIQUE INDEX "event_EventName_key" ON "event"("EventName");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "clubs"("collegeId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventAnnouncement" ADD CONSTRAINT "eventAnnouncement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventGallery" ADD CONSTRAINT "eventGallery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubAnnouncement" ADD CONSTRAINT "clubAnnouncement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judges" ADD CONSTRAINT "judges_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
