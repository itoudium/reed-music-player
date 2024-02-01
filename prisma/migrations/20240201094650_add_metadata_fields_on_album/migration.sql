-- AlterTable
ALTER TABLE "Album" ADD COLUMN "metadataFetchedAt" DATETIME;
ALTER TABLE "Album" ADD COLUMN "metadataSourceId" TEXT;
ALTER TABLE "Album" ADD COLUMN "metadataSourceName" TEXT;
