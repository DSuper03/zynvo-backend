-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT DEFAULT 'Zynvo Community Fresher',
ADD COLUMN     "course" TEXT DEFAULT '',
ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "year" TEXT DEFAULT '';
