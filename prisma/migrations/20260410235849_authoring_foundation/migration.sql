-- CreateEnum
CREATE TYPE "StoryStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ConstraintStrength" AS ENUM ('HARD', 'SOFT');

-- CreateEnum
CREATE TYPE "OutcomeType" AS ENUM ('MUST_HAPPEN', 'MUST_NOT_HAPPEN');

-- CreateEnum
CREATE TYPE "GuardrailPolicy" AS ENUM ('REDIRECT', 'REINTERPRET', 'SOFT_BLOCK', 'HARD_BLOCK');

-- CreateEnum
CREATE TYPE "SessionRunStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('DRAFT', 'LIVE', 'UNLISTED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AccessSource" AS ENUM ('AUTHOR', 'PURCHASE', 'ADMIN_GRANT');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "Story" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "synopsis" TEXT,
    "coverImageUrl" TEXT,
    "status" "StoryStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Story_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySpineVersion" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "arcStatement" TEXT,
    "toneGuide" TEXT,
    "narrativeBoundaries" TEXT,
    "guardrailInstruction" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySpineVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryCanonRule" (
    "id" TEXT NOT NULL,
    "spineVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "strength" "ConstraintStrength" NOT NULL DEFAULT 'HARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryCanonRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryRequiredEvent" (
    "id" TEXT NOT NULL,
    "spineVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "mustOccur" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryRequiredEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryCharacterTruth" (
    "id" TEXT NOT NULL,
    "spineVersionId" TEXT NOT NULL,
    "characterName" TEXT NOT NULL,
    "truth" TEXT NOT NULL,
    "strength" "ConstraintStrength" NOT NULL DEFAULT 'HARD',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryCharacterTruth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryOutcomeConstraint" (
    "id" TEXT NOT NULL,
    "spineVersionId" TEXT NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "outcomeType" "OutcomeType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "strength" "ConstraintStrength" NOT NULL DEFAULT 'HARD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoryOutcomeConstraint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySession" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "readerId" TEXT NOT NULL,
    "spineVersionId" TEXT,
    "currentRequiredEventId" TEXT,
    "status" "SessionRunStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryTurn" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "turnIndex" INTEGER NOT NULL,
    "readerInput" TEXT NOT NULL,
    "aiResponse" TEXT NOT NULL,
    "appliedGuardrail" "GuardrailPolicy",
    "eventContextId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryTurn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StorySessionState" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "continuityState" JSONB NOT NULL,
    "relationshipState" JSONB,
    "pacingState" JSONB,
    "emotionalTone" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StorySessionState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoreListing" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "titleOverride" TEXT,
    "synopsisOverride" TEXT,
    "priceCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "ListingStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StoreListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" TEXT NOT NULL,
    "listingId" TEXT NOT NULL,
    "buyerId" TEXT NOT NULL,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "provider" TEXT,
    "providerRef" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StoryAccessGrant" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "source" "AccessSource" NOT NULL,
    "listingId" TEXT,
    "purchaseId" TEXT,
    "grantedById" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StoryAccessGrant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Story_slug_key" ON "Story"("slug");

-- CreateIndex
CREATE INDEX "Story_authorId_status_idx" ON "Story"("authorId", "status");

-- CreateIndex
CREATE INDEX "Story_status_publishedAt_idx" ON "Story"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "StorySpineVersion_storyId_isActive_idx" ON "StorySpineVersion"("storyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "StorySpineVersion_storyId_version_key" ON "StorySpineVersion"("storyId", "version");

-- CreateIndex
CREATE INDEX "StoryCanonRule_spineVersionId_idx" ON "StoryCanonRule"("spineVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryCanonRule_spineVersionId_orderIndex_key" ON "StoryCanonRule"("spineVersionId", "orderIndex");

-- CreateIndex
CREATE INDEX "StoryRequiredEvent_spineVersionId_idx" ON "StoryRequiredEvent"("spineVersionId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryRequiredEvent_spineVersionId_orderIndex_key" ON "StoryRequiredEvent"("spineVersionId", "orderIndex");

-- CreateIndex
CREATE INDEX "StoryCharacterTruth_spineVersionId_characterName_idx" ON "StoryCharacterTruth"("spineVersionId", "characterName");

-- CreateIndex
CREATE INDEX "StoryOutcomeConstraint_spineVersionId_outcomeType_idx" ON "StoryOutcomeConstraint"("spineVersionId", "outcomeType");

-- CreateIndex
CREATE UNIQUE INDEX "StoryOutcomeConstraint_spineVersionId_orderIndex_key" ON "StoryOutcomeConstraint"("spineVersionId", "orderIndex");

-- CreateIndex
CREATE INDEX "StorySession_storyId_readerId_idx" ON "StorySession"("storyId", "readerId");

-- CreateIndex
CREATE INDEX "StorySession_readerId_status_idx" ON "StorySession"("readerId", "status");

-- CreateIndex
CREATE INDEX "StoryTurn_sessionId_idx" ON "StoryTurn"("sessionId");

-- CreateIndex
CREATE INDEX "StoryTurn_eventContextId_idx" ON "StoryTurn"("eventContextId");

-- CreateIndex
CREATE UNIQUE INDEX "StoryTurn_sessionId_turnIndex_key" ON "StoryTurn"("sessionId", "turnIndex");

-- CreateIndex
CREATE UNIQUE INDEX "StorySessionState_sessionId_key" ON "StorySessionState"("sessionId");

-- CreateIndex
CREATE INDEX "StoreListing_storyId_status_idx" ON "StoreListing"("storyId", "status");

-- CreateIndex
CREATE INDEX "StoreListing_status_publishedAt_idx" ON "StoreListing"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Purchase_buyerId_status_idx" ON "Purchase"("buyerId", "status");

-- CreateIndex
CREATE INDEX "Purchase_listingId_status_idx" ON "Purchase"("listingId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "StoryAccessGrant_purchaseId_key" ON "StoryAccessGrant"("purchaseId");

-- CreateIndex
CREATE INDEX "StoryAccessGrant_userId_source_idx" ON "StoryAccessGrant"("userId", "source");

-- CreateIndex
CREATE INDEX "StoryAccessGrant_storyId_source_idx" ON "StoryAccessGrant"("storyId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "StoryAccessGrant_storyId_userId_key" ON "StoryAccessGrant"("storyId", "userId");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySpineVersion" ADD CONSTRAINT "StorySpineVersion_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySpineVersion" ADD CONSTRAINT "StorySpineVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryCanonRule" ADD CONSTRAINT "StoryCanonRule_spineVersionId_fkey" FOREIGN KEY ("spineVersionId") REFERENCES "StorySpineVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryRequiredEvent" ADD CONSTRAINT "StoryRequiredEvent_spineVersionId_fkey" FOREIGN KEY ("spineVersionId") REFERENCES "StorySpineVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryCharacterTruth" ADD CONSTRAINT "StoryCharacterTruth_spineVersionId_fkey" FOREIGN KEY ("spineVersionId") REFERENCES "StorySpineVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryOutcomeConstraint" ADD CONSTRAINT "StoryOutcomeConstraint_spineVersionId_fkey" FOREIGN KEY ("spineVersionId") REFERENCES "StorySpineVersion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySession" ADD CONSTRAINT "StorySession_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySession" ADD CONSTRAINT "StorySession_readerId_fkey" FOREIGN KEY ("readerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySession" ADD CONSTRAINT "StorySession_spineVersionId_fkey" FOREIGN KEY ("spineVersionId") REFERENCES "StorySpineVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySession" ADD CONSTRAINT "StorySession_currentRequiredEventId_fkey" FOREIGN KEY ("currentRequiredEventId") REFERENCES "StoryRequiredEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryTurn" ADD CONSTRAINT "StoryTurn_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StorySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryTurn" ADD CONSTRAINT "StoryTurn_eventContextId_fkey" FOREIGN KEY ("eventContextId") REFERENCES "StoryRequiredEvent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StorySessionState" ADD CONSTRAINT "StorySessionState_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "StorySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreListing" ADD CONSTRAINT "StoreListing_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreListing" ADD CONSTRAINT "StoreListing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "StoreListing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccessGrant" ADD CONSTRAINT "StoryAccessGrant_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccessGrant" ADD CONSTRAINT "StoryAccessGrant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccessGrant" ADD CONSTRAINT "StoryAccessGrant_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "StoreListing"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccessGrant" ADD CONSTRAINT "StoryAccessGrant_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoryAccessGrant" ADD CONSTRAINT "StoryAccessGrant_grantedById_fkey" FOREIGN KEY ("grantedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
