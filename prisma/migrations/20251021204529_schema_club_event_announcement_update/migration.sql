-- CreateTable
CREATE TABLE "eventAnnouncement" (
    "id" TEXT NOT NULL,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "eventAnnouncement_pkey" PRIMARY KEY ("id")
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

-- AddForeignKey
ALTER TABLE "eventAnnouncement" ADD CONSTRAINT "eventAnnouncement_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clubAnnouncement" ADD CONSTRAINT "clubAnnouncement_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
