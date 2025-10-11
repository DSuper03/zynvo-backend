/*
  Warnings:

  - The primary key for the `CreatePost` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_AuthorToCreatePost` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_AuthorToCreatePost" DROP CONSTRAINT "_AuthorToCreatePost_B_fkey";

-- AlterTable
ALTER TABLE "CreatePost" DROP CONSTRAINT "CreatePost_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "CreatePost_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "CreatePost_id_seq";

-- AlterTable
ALTER TABLE "_AuthorToCreatePost" DROP CONSTRAINT "_AuthorToCreatePost_AB_pkey",
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_AuthorToCreatePost_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "_AuthorToCreatePost" ADD CONSTRAINT "_AuthorToCreatePost_B_fkey" FOREIGN KEY ("B") REFERENCES "CreatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
