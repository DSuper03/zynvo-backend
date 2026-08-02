-- CreateTable
CREATE TABLE "Wave" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Wave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Wave_senderId_idx" ON "Wave"("senderId");

-- CreateIndex
CREATE INDEX "Wave_receiverId_idx" ON "Wave"("receiverId");

-- CreateIndex
CREATE UNIQUE INDEX "Wave_senderId_receiverId_key" ON "Wave"("senderId", "receiverId");

-- AddForeignKey
ALTER TABLE "Wave" ADD CONSTRAINT "Wave_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wave" ADD CONSTRAINT "Wave_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
