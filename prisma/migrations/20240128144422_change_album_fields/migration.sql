/*
  Warnings:

  - A unique constraint covering the columns `[name,albumArtist]` on the table `Album` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Album_name_key";

-- AlterTable
ALTER TABLE "Album" ADD COLUMN "albumArtist" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Album_name_albumArtist_key" ON "Album"("name", "albumArtist");
