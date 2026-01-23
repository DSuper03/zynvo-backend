-- AlterTable
ALTER TABLE "event" ADD COLUMN     "isPaidEvent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qrCodeUrl" TEXT DEFAULT '';

-- CreateTable
CREATE TABLE "eventPayment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "paymentScreenshotUrl" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eventPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "eventPayment_userId_eventId_key" ON "eventPayment"("userId", "eventId");

-- AddForeignKey
ALTER TABLE "eventPayment" ADD CONSTRAINT "eventPayment_userId_eventId_fkey" FOREIGN KEY ("userId", "eventId") REFERENCES "userEvents"("userId", "eventId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eventPayment" ADD CONSTRAINT "eventPayment_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
