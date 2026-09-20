-- AlterTable: add mentionedUserIds to CreatePost
ALTER TABLE "CreatePost" ADD COLUMN "mentionedUserIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- CreateTable: PostComment
CREATE TABLE "PostComment" (
    "id"        TEXT         NOT NULL,
    "postId"    TEXT         NOT NULL,
    "authorId"  TEXT         NOT NULL,
    "parentId"  TEXT,
    "content"   TEXT         NOT NULL,
    "isDeleted" BOOLEAN      NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable: CommentReport
CREATE TABLE "CommentReport" (
    "id"         TEXT         NOT NULL,
    "commentId"  TEXT         NOT NULL,
    "reporterId" TEXT         NOT NULL,
    "reason"     TEXT         NOT NULL,
    "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Follow
CREATE TABLE "Follow" (
    "followerId"  TEXT         NOT NULL,
    "followingId" TEXT         NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId", "followingId")
);

-- CreateIndex
CREATE INDEX "PostComment_postId_idx"    ON "PostComment"("postId");
CREATE INDEX "PostComment_authorId_idx"  ON "PostComment"("authorId");
CREATE INDEX "PostComment_parentId_idx"  ON "PostComment"("parentId");
CREATE UNIQUE INDEX "CommentReport_commentId_reporterId_key" ON "CommentReport"("commentId", "reporterId");
CREATE INDEX "CommentReport_commentId_idx" ON "CommentReport"("commentId");
CREATE INDEX "Follow_followerId_idx"     ON "Follow"("followerId");
CREATE INDEX "Follow_followingId_idx"    ON "Follow"("followingId");

-- AddForeignKey: PostComment -> CreatePost
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_postId_fkey"
    FOREIGN KEY ("postId") REFERENCES "CreatePost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PostComment -> User (author)
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: PostComment -> PostComment (parent/reply)
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_parentId_fkey"
    FOREIGN KEY ("parentId") REFERENCES "PostComment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey: CommentReport -> User (reporter)
ALTER TABLE "CommentReport" ADD CONSTRAINT "CommentReport_reporterId_fkey"
    FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Follow -> User (follower)
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey"
    FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: Follow -> User (following)
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followingId_fkey"
    FOREIGN KEY ("followingId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
