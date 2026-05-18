-- CreateTable
CREATE TABLE "PostUpvote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostUpvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostUpvote_postId_userId_key" ON "PostUpvote"("postId", "userId");

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostUpvote" ADD CONSTRAINT "PostUpvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
