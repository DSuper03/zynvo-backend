-- CreateEnum
CREATE TYPE "OfferType" AS ENUM ('COUPON', 'CREDITS', 'FREE_TRIAL', 'DISCOUNT', 'INTERNSHIP', 'CERTIFICATION');

-- CreateEnum
CREATE TYPE "OfferEligibility" AS ENUM ('ALL_STUDENTS', 'SPECIFIC_COLLEGES', 'SPECIFIC_BRANCHES');

-- DropIndex
DROP INDEX "event_EventName_key";

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "description" TEXT NOT NULL,
    "website" TEXT,
    "category" TEXT NOT NULL DEFAULT 'General',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "offerType" "OfferType" NOT NULL DEFAULT 'COUPON',
    "couponCode" TEXT,
    "discountValue" TEXT,
    "eligibility" "OfferEligibility" NOT NULL DEFAULT 'ALL_STUDENTS',
    "eligibleColleges" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eligibleBranches" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "redemptionLink" TEXT,
    "termsAndConditions" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "claimCount" INTEGER NOT NULL DEFAULT 0,
    "redeemCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferClaim" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,
    "redeemedAt" TIMESTAMP(3),

    CONSTRAINT "OfferClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OfferSave" (
    "id" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OfferSave_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Brand_name_key" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Brand_category_idx" ON "Brand"("category");

-- CreateIndex
CREATE INDEX "Brand_name_idx" ON "Brand"("name");

-- CreateIndex
CREATE INDEX "Offer_brandId_idx" ON "Offer"("brandId");

-- CreateIndex
CREATE INDEX "Offer_offerType_idx" ON "Offer"("offerType");

-- CreateIndex
CREATE INDEX "Offer_isActive_idx" ON "Offer"("isActive");

-- CreateIndex
CREATE INDEX "Offer_endDate_idx" ON "Offer"("endDate");

-- CreateIndex
CREATE INDEX "Offer_createdAt_idx" ON "Offer"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "OfferClaim_offerId_userId_key" ON "OfferClaim"("offerId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "OfferSave_offerId_userId_key" ON "OfferSave"("offerId", "userId");

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferClaim" ADD CONSTRAINT "OfferClaim_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferClaim" ADD CONSTRAINT "OfferClaim_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferSave" ADD CONSTRAINT "OfferSave_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OfferSave" ADD CONSTRAINT "OfferSave_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
