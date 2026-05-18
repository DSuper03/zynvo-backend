-- AlterTable
ALTER TABLE "User" ALTER COLUMN "clubId" SET DEFAULT 'none',
ALTER COLUMN "clubName" SET DEFAULT 'none';

-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "twitter" TEXT;

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "Fees" TEXT DEFAULT 'none',
ADD COLUMN     "Form" TEXT;
