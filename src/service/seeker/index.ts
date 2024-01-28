import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';
import { z } from 'zod';
import { prisma } from '../prisma';
// for debug
const entryPoints = ['/Users/110d/Music/Music/Media/Music/Chet Baker/'];

/**
 * seeker は、entryPoints に書かれたディレクトリを再帰的に探索し、音楽ファイルを見つけ出し、コンテンツテーブルに登録します。
 * また、コンテンツテーブルとの不整合を修正します。
 */
class Seeker {
  constructor() {
    this.seek();
  }

  async seek() {
    for (const p of entryPoints) {
      await this.seekPath(p);
    }
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
          console.log('found', filepath);
          await this.registerContent(filepath);
        }
      }
    }
  }

  async registerContent(filepath: string) {
    console.log('registerContent', filepath);
    const content = await prisma.content.findUnique({
      where: {
        path: filepath,
      },
    });
    if (content) {
      console.log('already registered', filepath);
      // TODO update
      return;
    }

    // register new
    await prisma.content.create({
      data: {
        path: filepath,
        title: path.basename(filepath),
        artist: 'Unknown',
        album: path.dirname(filepath),
        duration: 0,
        trackNumber: 0,
        year: 0,
        genre: 'Unknown',
        comment: '',
      },
    });
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

  async getContent(id: string) {
    const content = await prisma.content.findUnique({
      where: {
        id: id,
      },
    });

    return content;
  }
}

export const seeker = new Seeker();
