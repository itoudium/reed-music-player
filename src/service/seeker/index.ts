import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { prisma } from '../prisma';
import { parseFile } from 'music-metadata';
import { updateAlbumMetadata, registerAlbum } from './album';
import { registerPictureByMetadata } from './picture';
import { Content, SeekerTarget } from '@prisma/client';

const TARGET_EXT = new Set(['.mp3']);

/**
 * seeker は、entryPoints に書かれたディレクトリを再帰的に探索し、音楽ファイルを見つけ出し、コンテンツテーブルに登録します。
 * また、コンテンツテーブルとの不整合を修正します。
 */
class Seeker {
  constructor() {}

  async startFullScan() {
    const entryPoints = await prisma.seekerTarget.findMany();
    for (const ep of entryPoints) {
      await this.startScanByTarget(ep);
    }
  }

  async startScanByTarget(target: SeekerTarget) {
    // set startedAt
    await prisma.seekerTarget.update({
      where: {
        id: target.id,
      },
      data: {
        lastSeekStartedAt: new Date(),
        lastSeekFinishedAt: null,
        error: null,
      },
    });

    try {
      const filePaths = await this.seekPath(target.path);
      await this.registerFiles(filePaths);
    } catch (e: any) {
      console.error(e);
      await prisma.seekerTarget.update({
        where: {
          id: target.id,
        },
        data: {
          error: e.message ?? 'unknown error',
        },
      });
    }

    // set lastSeekFinishedAt
    await prisma.seekerTarget.update({
      where: {
        id: target.id,
      },
      data: {
        lastSeekFinishedAt: new Date(),
      },
    });
  }

  private async seekPath(p: string): Promise<string[]> {
    const filePaths: string[] = [];
    const files = await fs.readdir(p);
    for (const file of files) {
      const filepath = path.join(p, file);
      const s = await fs.stat(filepath);
      if (s.isDirectory()) {
        const result = await this.seekPath(filepath);
        filePaths.push(...result);
      } else if (s.isFile()) {
        if (!TARGET_EXT.has(path.extname(filepath))) {
          continue;
        }
        filePaths.push(filepath);
      }
    }

    return filePaths;
  }

  private async registerFiles(filePaths: string[]) {
    const grouped = this.groupByDirectory(filePaths);
    for (const dir in grouped) {
      const files = grouped[dir];
      const contents: Content[] = [];
      for (const file of files) {
        const c = await this.registerContent(file);
        if (c) {
          contents.push(c);
        }
      }
      const album = await registerAlbum(dir, contents);
      album && (await updateAlbumMetadata(album));
    }
  }

  private groupByDirectory(filePaths: string[]): { [key: string]: string[] } {
    // group by directory
    return filePaths.reduce(
      (acc, cur) => {
        const dir = path.dirname(cur);
        if (!acc[dir]) {
          acc[dir] = [];
        }
        acc[dir].push(cur);
        return acc;
      },
      {} as { [key: string]: string[] }
    );
  }

  async registerContent(filepath: string): Promise<Content | null> {
    // if file is already registered, skip
    const existed = await prisma.content.findUnique({
      where: {
        path: filepath,
      },
    });
    if (existed) {
      return existed;
    }

    const meta = await parseFile(filepath);

    const metaRecords = {
      title: meta.common.title,
      artist: meta.common.artist,
      albumArtist: meta.common.albumartist,
      album: meta.common.album,
      duration: meta.format.duration ?? 0,
      trackNumber: meta.common.track.no,
      year: meta.common.year,
      genre: meta.common.genre?.join(','),
      comment: meta.common.comment?.join(','),
      pictureId: null as null | string,
    };

    // picture
    const picture = await registerPictureByMetadata(meta);
    if (picture) {
      metaRecords.pictureId = picture.id;
    }

    // register new
    console.log('registerContent', filepath);
    const created = await prisma.content.create({
      data: {
        path: filepath,
        ...metaRecords,
      },
    });

    return created;
  }

  private static listParamsParser = z
    .object({
      limit: z.number().optional().default(100),
      offset: z.number().optional().default(0),
    })
    .default({
      limit: 100,
      offset: 0,
    });

  async listContent(params: z.infer<typeof Seeker.listParamsParser>) {
    const parsed = Seeker.listParamsParser.parse(params);
    console.log('listContent', parsed);
    const contents = await prisma.content.findMany({
      take: parsed.limit,
      skip: parsed.offset,
      orderBy: {
        path: 'asc',
      },
    });

    const totalCount = await prisma.content.count();

    return {
      contents: contents,
      totalCount: totalCount,
    };
  }

  async listAlbumContents(params: { albumId: string }) {
    const contents = await prisma.content.findMany({
      where: {
        albumId: params.albumId,
      },
      orderBy: {
        trackNumber: 'asc',
      },
    });

    return {
      contents: contents,
    };
  }

  async getContent(id: string) {
    const content = await prisma.content.findUnique({
      where: {
        id: id,
      },
    });

    return content;
  }

  async listAlbums(params: { limit?: number; offset?: number }) {
    const albums = await prisma.album.findMany({
      take: params.limit,
      skip: params.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await prisma.album.count();

    return {
      albums: albums,
      totalCount: totalCount,
    };
  }

  async getAlbum(id: string) {
    const album = await prisma.album.findUnique({
      where: {
        id: id,
      },
    });

    return album;
  }

  async listArtists(params: { limit?: number; offset?: number }) {
    const artists = await prisma.artist.findMany({
      take: params.limit,
      skip: params.offset,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalCount = await prisma.artist.count();

    return {
      artists: artists,
      totalCount: totalCount,
    };
  }

  async getArtist(id: string) {
    const artist = await prisma.artist.findUnique({
      where: {
        id: id,
      },
    });

    return artist;
  }
}

let _seeker: Seeker | null = null;
export function getSeeker() {
  if (!_seeker) {
    _seeker = new Seeker();
    return _seeker;
  }
  return _seeker;
}
