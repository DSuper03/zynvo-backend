-- DropForeignKey
ALTER TABLE "CreatePost" DROP CONSTRAINT "CreatePost_collegeId_fkey";

-- AlterTable
ALTER TABLE "CreatePost" ADD COLUMN     "clubName" TEXT NOT NULL DEFAULT 'zync club',
ADD COLUMN     "collegeName" TEXT NOT NULL DEFAULT 'zync college',
ALTER COLUMN "collegeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CreatePost" ADD CONSTRAINT "CreatePost_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "clubs"("collegeId") ON DELETE SET NULL ON UPDATE CASCADE;
