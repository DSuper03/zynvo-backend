-- AlterTable
ALTER TABLE "User" ADD COLUMN     "instagram" TEXT DEFAULT '',
ADD COLUMN     "linkedin" TEXT DEFAULT '',
ADD COLUMN     "twitter" TEXT DEFAULT '';

-- AlterTable
ALTER TABLE "clubs" ADD COLUMN     "wings" TEXT[] DEFAULT ARRAY[]::TEXT[];
