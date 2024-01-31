import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { prisma } from '../prisma';
import { parseFile } from 'music-metadata';
import { buildAlbums } from './album';
import { registerPictureByMetadata } from './picture';
import { SeekerTarget } from '@prisma/client';

/**
 * seeker は、entryPoints に書かれたディレクトリを再帰的に探索し、音楽ファイルを見つけ出し、コンテンツテーブルに登録します。
 * また、コンテンツテーブルとの不整合を修正します。
 */
class Seeker {
  constructor() {
    this.seek();
  }

  async seek() {
    const entryPoints = await prisma.seekerTarget.findMany();
    for (const ep of entryPoints) {
      await this.seekFromEntryPoint(ep);
    }

    await buildAlbums();
  }

  async seekFromEntryPoint(entryPoint: SeekerTarget) {
    if (entryPoint.lastSeekFinishedAt) {
      return;
    }

    // set startedAt
    await prisma.seekerTarget.update({
      where: {
        id: entryPoint.id,
      },
      data: {
        lastSeekStartedAt: new Date(),
      },
    });

    try {
      await this.seekPath(entryPoint.path);
    } catch (e) {
      console.error(e);
      // TODO loggin error
    }

    // set lastSeekFinishedAt
    await prisma.seekerTarget.update({
      where: {
        id: entryPoint.id,
      },
      data: {
        lastSeekFinishedAt: new Date(),
      },
    });
  }

  async seekPath(p: string) {
    console.log('seekPath', p);

    const files = await fs.readdir(p);
    for (const file of files) {
      const filepath = path.join(p, file);
      const s = await fs.stat(filepath);
      if (s.isDirectory()) {
        await this.seekPath(filepath);
      } else if (s.isFile()) {
        if (file.match(/\.mp3$/)) {
          await this.registerContent(filepath);
        }
      }
    }
  }

  async registerContent(filepath: string) {
    // if file is already registered, skip
    const exists = await prisma.content.count({
      where: {
        path: filepath,
      },
    });
    if (exists) {
      return;
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

    const content = await prisma.content.findUnique({
      where: {
        path: filepath,
      },
    });
    if (content) {
      // update
      await prisma.content.update({
        where: {
          id: content.id,
        },
        data: {
          ...metaRecords,
        },
      });
    } else {
      // register new
      console.log('registerContent', filepath);
      await prisma.content.create({
        data: {
          path: filepath,
          ...metaRecords,
        },
      });
    }
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
}

export const seeker = new Seeker();
