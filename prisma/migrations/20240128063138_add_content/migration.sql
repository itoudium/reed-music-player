-- CreateTable
CREATE TABLE "Content" (
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
    "comment" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_path_key" ON "Content"("path");
