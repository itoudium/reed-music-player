import { Album, Content } from '@prisma/client';
import { prisma } from '../prisma';
import path from 'path';
import { MusicBrainzMetadataSource } from '../metadata/musicBrainz/musicBrainz';
import { IMetadataSource } from '../metadata/IMetadataSource';
import { registerPictureByUrl } from './picture';
import { registerArtist } from './artist';

/** registerAlbum
 *
 * - create album if not exists
 * - set albumId to content
 */
export async function registerAlbum(
  albumPath: string,
  contents: Content[]
): Promise<Album | null> {
  if (contents.length === 0) {
    return null;
  }
  let album = await prisma.album.findFirst({
    where: {
      albumPath,
    },
  });

  if (!album) {
    // create new album
    console.log('create new album', albumPath);
    album = await prisma.album.create({
      data: {
        albumPath,
        name: path.basename(albumPath),
        // album artist is the same as the parent directory name or the first content's album artist
        albumArtist:
          contents[0].albumArtist || path.basename(path.dirname(albumPath)),
      },
    });
  }

  if (!album) throw new Error('album not found');

  // set albumId to content
  await prisma.content.updateMany({
    where: {
      id: {
        in: contents.map((c) => c.id),
      },
    },
    data: {
      albumId: album.id,
    },
  });

  return album;
}

const METADATA_SOURCE = [new MusicBrainzMetadataSource()];

export async function updateAlbumMetadata(album: Album) {
  for (const source of METADATA_SOURCE) {
    await fetchMetadataBySource(album, source);
  }
}

async function fetchMetadataBySource(album: Album, source: IMetadataSource) {
  if (album.metadataFetchedAt) {
    // skip if fetched recently
    const diff = new Date().getTime() - album.metadataFetchedAt.getTime();
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      return;
    }
  }
  const contents = await prisma.content.findMany({
    where: {
      albumId: album.id,
    },
  });

  const searchResult = await source.searchAlbum(album);
  console.log('[fetchMetadata] result:', searchResult, 'source:', source.name);

  let pictureId: string | undefined;

  if (searchResult?.coverArtUrl) {
    const pic = await registerPictureByUrl(searchResult.coverArtUrl);
    pictureId = pic?.id;
  }

  // artist
  const artistIds = new Set<string>();
  if (searchResult?.artists && searchResult.artists.length > 0) {
    for (const artist of searchResult.artists) {
      const registeredArtist = await registerArtist(artist.name);
      registeredArtist && artistIds.add(registeredArtist.id);
    }
  } else if (album.albumArtist) {
    const registeredArtist = await registerArtist(album.albumArtist);
    registeredArtist && artistIds.add(registeredArtist.id);
  }

  // connect album and artists
  for (const artistId of artistIds) {
    await prisma.artistsOnAlbums.upsert({
      where: {
        artistId_albumId: {
          albumId: album.id,
          artistId,
        },
      },
      update: {},
      create: {
        albumId: album.id,
        artistId,
      },
    });
  }

  // connect artist and contents
  for (const content of contents) {
    for (const artistId of artistIds) {
      await prisma.artistsOnContents.upsert({
        where: {
          artistId_contentId: {
            contentId: content.id,
            artistId,
          },
        },
        update: {},
        create: {
          contentId: content.id,
          artistId,
        },
      });
    }
  }

  // update
  await prisma.album.update({
    where: {
      id: album.id,
    },
    data: {
      pictureId,
      metadataFetchedAt: new Date(),
      metadataSourceName: source.name,
      metadataSourceId: searchResult?.sourceId,
    },
  });
}
