/*
  Warnings:

  - You are about to drop the column `artistId` on the `Album` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ArtistsOnAlbums" (
    "artistId" TEXT NOT NULL,
    "albumId" TEXT NOT NULL,

    PRIMARY KEY ("artistId", "albumId"),
    CONSTRAINT "ArtistsOnAlbums_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArtistsOnAlbums_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Album" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "albumArtist" TEXT,
    "albumPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pictureId" TEXT,
    CONSTRAINT "Album_pictureId_fkey" FOREIGN KEY ("pictureId") REFERENCES "Picture" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Album" ("albumArtist", "albumPath", "createdAt", "id", "name", "pictureId", "updatedAt") SELECT "albumArtist", "albumPath", "createdAt", "id", "name", "pictureId", "updatedAt" FROM "Album";
DROP TABLE "Album";
ALTER TABLE "new_Album" RENAME TO "Album";
CREATE UNIQUE INDEX "Album_name_albumArtist_key" ON "Album"("name", "albumArtist");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
