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

-- AddForeignKey
ALTER TABLE "eventGallery" ADD CONSTRAINT "eventGallery_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
