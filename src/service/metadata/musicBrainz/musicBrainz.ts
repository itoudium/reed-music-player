import axios, { AxiosError, isAxiosError } from 'axios';
import { IMetadataSource, SearchAlbumResult } from '../IMetadataSource';
import { Album, Content } from '@prisma/client';
import { mb_ReleaseImageResultType, mb_SearchReleaseResultType } from './types';
import path from 'path';

const client = axios.create({
  headers: {
    'User-Agent': 'reed-seeker 0.0.1',
    Accept: 'application/json',
  },
  baseURL: 'https://musicbrainz.org/ws/2',
});

const REQUEST_INTERVAL = 1_000;
const sleepInterval = () =>
  new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL));

async function searchArtist(name: string) {
  try {
    const res = await client.get(
      `/artist/?limit=5&query=artist:${encodeURIComponent(name)}`
    );
    return res;
  } finally {
    await sleepInterval();
  }
}

async function searchRelease(params: {
  release?: string[];
  artist?: string[];
  date?: string;
  tracks?: number;
}) {
  // convert params to query string
  const q = Object.entries(params)
    .map(([key, value]) => {
      if (!value) return null;
      if (Array.isArray(value)) {
        return `(${value.map((v) => `${key}:"${v}"`).join(' OR ')})`;
      }
      return `${key}:"${value}"`;
    })
    .filter(Boolean)
    .join(' AND ');

  console.log('searchRelease', q);

  try {
    const res = await client.get<mb_SearchReleaseResultType>(
      `/release/?limit=5&query=${encodeURIComponent(q)}`
    );
    return res.data;
  } finally {
    await sleepInterval();
  }
}

async function getCoverArt(releaseId: string) {
  try {
    const res = await client.get<mb_ReleaseImageResultType>(
      `http://coverartarchive.org/release/${releaseId}`
    );
    return res.data;
  } catch (e) {
    console.warn('no cover art found');
    return null;
  }
}

export class MusicBrainzMetadataSource implements IMetadataSource {
  async searchAlbum(
    album: Album,
    contents: Content[]
  ): Promise<SearchAlbumResult | null> {
    const artist = album.albumArtist;
    const albumPaths = (album.albumPath ?? '').split(path.sep);
    const albumName = albumPaths[albumPaths.length - 1];
    const albumArtist = albumPaths[albumPaths.length - 2];
    const res = await searchRelease({
      artist: [artist, albumArtist].filter(Boolean) as string[],
      release: [album.name, albumName].filter(Boolean) as string[],
    });
    const release = res.releases[0];
    if (!release) {
      return null;
    }

    const result = {
      sourceId: release.id,
      name: release.title,
    };

    const coverArts = await getCoverArt(release.id);
    if (!coverArts) {
      return result;
    }

    const coverArtUrl = coverArts.images[0]?.image;

    return {
      ...result,
      coverArtUrl,
    };
  }
}
