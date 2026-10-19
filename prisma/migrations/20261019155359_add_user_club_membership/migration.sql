-- CreateTable
CREATE TABLE "UserClubMembership" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "clubId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserClubMembership_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserClubMembership_userId_idx" ON "UserClubMembership"("userId");

-- CreateIndex
CREATE INDEX "UserClubMembership_clubId_idx" ON "UserClubMembership"("clubId");

-- CreateIndex
CREATE UNIQUE INDEX "UserClubMembership_userId_clubId_key" ON "UserClubMembership"("userId", "clubId");

-- AddForeignKey
ALTER TABLE "UserClubMembership" ADD CONSTRAINT "UserClubMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserClubMembership" ADD CONSTRAINT "UserClubMembership_clubId_fkey" FOREIGN KEY ("clubId") REFERENCES "clubs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
