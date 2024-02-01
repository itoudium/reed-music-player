import { prisma } from '../../src/service/prisma';

export * as serverSettings from '../../src/service/settings';

export async function listArtists() {
  return prisma.artist.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function listArtistsByAlbum(
  albumId: string,
  albumArtist?: string
) {
  const artists = await prisma.artist.findMany({
    where: {
      albums: {
        some: {
          albumId,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });

  return [
    ...artists.filter((x) => x.name === albumArtist),
    ...artists.filter((x) => x.name !== albumArtist),
  ];
}

export async function getArtist(id: string) {
  return prisma.artist.findUnique({
    where: {
      id,
    },
  });
}

export async function listAllAlbums() {
  return prisma.album.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function listAlbumsByArtist(artistId: string) {
  return prisma.album.findMany({
    where: {
      artists: {
        some: {
          artistId,
        },
      },
    },
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getAlbum(id: string) {
  return prisma.album.findUnique({
    where: {
      id,
    },
  });
}

export async function ListContentsByAlbum(albumId: string) {
  return prisma.content.findMany({
    where: {
      albumId,
    },
    orderBy: {
      trackNumber: 'asc',
    },
  });
}
