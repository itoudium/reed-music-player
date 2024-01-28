import { Album } from '@prisma/client';
import { prisma } from '../prisma';

/** buildAlbums
 *
 * - scan all contents
 * - create album if not exists
 * - set albumId to content
 */
export async function buildAlbums() {
  const contents = await prisma.content.findMany({
    orderBy: {
      path: 'asc',
    },
  });

  const albums = await prisma.album.findMany({});
  const foundAlbums: Album[] = [];

  for (const content of contents) {
    if (content.albumId) continue;

    const albumName = content.album;
    const albumArtist = content.albumArtist;
    if (!albumName || !albumArtist) continue;

    const album = albums.find(
      (a) => a.name === albumName && a.albumArtist === albumArtist
    );
    let albumId: string;
    if (album) {
      console.log('album exists', album.id);
      foundAlbums.push(album);
      albumId = album.id;
    } else {
      // create new album
      const newAlbum = await prisma.album.create({
        data: {
          name: albumName,
          albumArtist: albumArtist,
        },
      });
      albums.push(newAlbum);
      foundAlbums.push(newAlbum);
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
  const unusedAlbums = albums.filter(
    (a) => !foundAlbums.find((fa) => fa.id === a.id)
  );
  for (const album of unusedAlbums) {
    await prisma.album.delete({
      where: {
        id: album.id,
      },
    });
  }
}
