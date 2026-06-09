-- AlterTable
ALTER TABLE "event" ADD COLUMN     "maxParticipants" INTEGER;

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

-- AddForeignKey
ALTER TABLE "judges" ADD CONSTRAINT "judges_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TeamMember_eventId_fkey'
  ) THEN
    ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_eventId_fkey" 
      FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
  END IF;
END $$;