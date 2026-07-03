-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "clubType" AS ENUM ('Technology', 'Cultural', 'Business', 'Social', 'Literature', 'Design', 'General');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileAvatar" TEXT,
    "isVerified" BOOLEAN DEFAULT false,
    "vToken" TEXT,
    "ValidFor" INTEGER,
    "expiryToken" INTEGER,
    "clubId" TEXT,
    "clubName" TEXT,
    "collegeName" TEXT NOT NULL DEFAULT 'not joined',
    "bio" TEXT DEFAULT 'Zynvo Community Fresher',
    "course" TEXT DEFAULT '',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "year" TEXT DEFAULT '',
    "instagram" TEXT DEFAULT '',
    "linkedin" TEXT DEFAULT '',
    "twitter" TEXT DEFAULT '',
    "phone" TEXT DEFAULT '',
    "clerkId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubs" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "collegeName" TEXT NOT NULL,
    "collegeId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "profilePicUrl" TEXT,
    "clubContact" TEXT NOT NULL DEFAULT 'none',
    "facultyEmail" TEXT NOT NULL DEFAULT 'none',
    "founderEmail" TEXT NOT NULL DEFAULT 'none',
    "requirements" TEXT DEFAULT 'none',
    "coremember1" TEXT DEFAULT 'none',
    "coremember2" TEXT DEFAULT 'none',
    "coremember3" TEXT DEFAULT 'none',
    "type" TEXT NOT NULL DEFAULT 'General',
    "wings" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "instagram" TEXT,
    "linkedin" TEXT,
    "twitter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clubs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreatePost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "collegeId" TEXT,
    "clubName" TEXT NOT NULL DEFAULT 'zync club',
    "collegeName" TEXT NOT NULL DEFAULT 'zync college',

    CONSTRAINT "CreatePost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "speakers" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "profilePic" TEXT,
    "about" TEXT NOT NULL,

    CONSTRAINT "speakers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "EventName" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "clubName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TEXT,
    "eventHeaderImage" TEXT DEFAULT 'none',
    "prizes" TEXT NOT NULL DEFAULT 'no prizes given',
    "EventMode" TEXT NOT NULL DEFAULT 'Hybrid',
    "EventType" TEXT NOT NULL DEFAULT 'general',
    "EventUrl" TEXT DEFAULT '',
    "TeamSize" INTEGER NOT NULL DEFAULT 1,
    "Venue" TEXT NOT NULL DEFAULT '',
    "applicationStatus" TEXT NOT NULL DEFAULT 'open',
    "collegeStudentsOnly" BOOLEAN NOT NULL DEFAULT true,
    "contactEmail" TEXT NOT NULL,
    "contactPhone" TEXT,
    "participationFee" BOOLEAN NOT NULL DEFAULT false,
    "posterUrl" TEXT DEFAULT '',
    "startDate" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "Fees" TEXT DEFAULT 'none',
    "Form" TEXT,
    "link1" TEXT,
    "link2" TEXT,
    "link3" TEXT,
    "whatsappLink" TEXT DEFAULT '',
    "qrCodeUrl" TEXT DEFAULT '',
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "applicationEndDate" TEXT DEFAULT '',
    "applicationStartDate" TEXT DEFAULT '',
    "tagline" TEXT DEFAULT '',
    "maxParticipants" INTEGER,
    "createdById" TEXT,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventAnnouncement" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,

    CONSTRAINT "eventAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eventGallery" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "eventId" TEXT NOT NULL,

    CONSTRAINT "eventGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clubAnnouncement" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),
    "clubId" TEXT NOT NULL,

    CONSTRAINT "clubAnnouncement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "userEvents" (
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uniquePassId" TEXT DEFAULT 'none',
    "paymentScreenshotUrl" TEXT DEFAULT '',
    "paymentStatus" TEXT NOT NULL DEFAULT 'CONFIRMED',
    "paymentVerifiedAt" TIMESTAMP(3),

    CONSTRAINT "userEvents_pkey" PRIMARY KEY ("userId","eventId")
);

-- CreateTable
CREATE TABLE "PostUpvote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostDownvote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostDownvote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleDay" (
    "id" TEXT NOT NULL,
    "day" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "ScheduleDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduleSession" (
    "id" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "location" TEXT NOT NULL,
    "speakers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "scheduleDayId" TEXT NOT NULL,

    CONSTRAINT "ScheduleSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "teamName" TEXT NOT NULL,
    "teamCode" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "judges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "achievement" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "judges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_collegeId_key" ON "clubs"("collegeId");

-- CreateIndex
CREATE UNIQUE INDEX "clubs_founderEmail_key" ON "clubs"("founderEmail");

-- CreateIndex
CREATE UNIQUE INDEX "speakers_email_key" ON "speakers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "event_EventName_key" ON "event"("EventName");

-- CreateIndex
CREATE UNIQUE INDEX "PostUpvote_postId_userId_key" ON "PostUpvote"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PostDownvote_postId_userId_key" ON "PostDownvote"("postId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScheduleDay_eventId_day_key" ON "ScheduleDay"("eventId", "day");

-- CreateIndex
CREATE UNIQUE INDEX "Team_teamCode_key" ON "Team"("teamCode");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_eventId_userId_key" ON "TeamMember"("eventId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamMember_teamId_userId_key" ON "TeamMember"("teamId", "userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "clubs"("collegeId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "speakers" ADD CONSTRAINT "speakers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventAnnouncement" ADD CONSTRAINT "eventAnnouncement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventGallery" ADD CONSTRAINT "eventGallery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubAnnouncement" ADD CONSTRAINT "clubAnnouncement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "userEvents" ADD CONSTRAINT "userEvents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleDay" ADD CONSTRAINT "ScheduleDay_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduleSession" ADD CONSTRAINT "ScheduleSession_scheduleDayId_fkey" FOREIGN KEY ("scheduleDayId") REFERENCES "ScheduleDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "judges" ADD CONSTRAINT "judges_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

