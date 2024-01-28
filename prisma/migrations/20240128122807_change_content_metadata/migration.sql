/*
  Warnings:

  - You are about to drop the column `artistId` on the `Content` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ArtistsOnContents" (
    "artistId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,

    PRIMARY KEY ("artistId", "contentId"),
    CONSTRAINT "ArtistsOnContents_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtistsOnContents_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT,
    "artist" TEXT,
    "album" TEXT,
    "albumArtist" TEXT,
    "genre" TEXT,
    "trackNumber" INTEGER,
    "year" INTEGER,
    "comment" TEXT,
    "duration" INTEGER NOT NULL,
    "albumId" TEXT,
    CONSTRAINT "Content_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Content" ("album", "albumId", "artist", "comment", "createdAt", "duration", "genre", "id", "path", "title", "trackNumber", "updatedAt", "year") SELECT "album", "albumId", "artist", "comment", "createdAt", "duration", "genre", "id", "path", "title", "trackNumber", "updatedAt", "year" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_path_key" ON "Content"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
