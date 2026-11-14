
-- CreateEnum
CREATE TYPE "CoreInviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED');

-- CreateTable
CREATE TABLE "ClubCoreInvite" (
    "id" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "invitedById" TEXT NOT NULL,
    "status" "CoreInviteStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClubCoreInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ClubCoreInvite_email_status_idx" ON "ClubCoreInvite"("email", "status");

-- CreateIndex
CREATE INDEX "ClubCoreInvite_clubId_status_idx" ON "ClubCoreInvite"("clubId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ClubCoreInvite_clubId_email_pending_key" ON "ClubCoreInvite"("clubId", "email") WHERE (status = 'PENDING');

-- AddForeignKey
ALTER TABLE "ClubCoreInvite" ADD CONSTRAINT "ClubCoreInvite_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClubCoreInvite" ADD CONSTRAINT "ClubCoreInvite_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

