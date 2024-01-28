/*
  Warnings:

  - Added the required column `duration` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "path" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "album" TEXT NOT NULL,
    "genre" TEXT NOT NULL,
    "trackNumber" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "duration" INTEGER NOT NULL
);
INSERT INTO "new_Content" ("album", "artist", "comment", "createdAt", "genre", "id", "path", "title", "trackNumber", "updatedAt", "year") SELECT "album", "artist", "comment", "createdAt", "genre", "id", "path", "title", "trackNumber", "updatedAt", "year" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_path_key" ON "Content"("path");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
