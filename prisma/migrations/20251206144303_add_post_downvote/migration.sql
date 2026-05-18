-- CreateTable
CREATE TABLE "PostDownvote" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostDownvote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostDownvote_postId_userId_key" ON "PostDownvote"("postId", "userId");

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_postId_fkey" FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostDownvote" ADD CONSTRAINT "PostDownvote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
