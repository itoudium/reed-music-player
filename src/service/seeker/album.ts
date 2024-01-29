import { prisma } from '../prisma';
import path from 'path';

/** buildAlbums
 *
 * - scan all contents
 * - create album if not exists
 * - set albumId to content
 */
export async function buildAlbums() {
  console.time('buildAlbums');

  const contents = await prisma.content.findMany({
    orderBy: {
      path: 'asc',
    },
  });

  const albums = await prisma.album.findMany();
  const foundAlbums = new Set<string>();

  for (const content of contents) {
    if (content.albumId) {
      // already has albumId
      const album = albums.find((a) => a.id === content.albumId);
      if (album) {
        foundAlbums.add(album.id);
        continue;
      }
    }

    const albumName = content.album;
    const albumArtist = content.albumArtist;
    const albumPath = path.dirname(content.path);

    if (!albumName) continue;

    const album =
      albumName && albumArtist
        ? // find by album name and album artist
          albums.find(
            (a) => a.name === albumName && a.albumArtist === albumArtist
          )
        : // find by album path
          albums.find((a) => a.albumPath === albumPath);

    let albumId: string;
    if (album) {
      foundAlbums.add(album.id);
      albumId = album.id;
    } else {
      // create new album
      console.log('create new album', albumName, albumArtist, albumPath);
      const newAlbum = await prisma.album.create({
        data: {
          name: albumName,
          albumArtist: albumArtist,
          albumPath,
          pictureId: content.pictureId,
        },
      });
      albums.push(newAlbum);
      foundAlbums.add(newAlbum.id);
      albumId = newAlbum.id;
    }

    // set albumId to content
    await prisma.content.update({
      where: {
        id: content.id,
      },
      data: {
        albumId: albumId,
      },
    });
  }

  // delete unused albums
  const unusedAlbums = albums.filter((a) => !foundAlbums.has(a.id));
  for (const album of unusedAlbums) {
    await prisma.album.delete({
      where: {
        id: album.id,
      },
    });
  }

  console.timeEnd('buildAlbums');
}
