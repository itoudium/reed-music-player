import { Album, Artist } from '@prisma/client';
import { IMetadataSource } from '../metadata/IMetadataSource';
import { prisma } from '../prisma';

export async function registerArtist(name: string): Promise<Artist> {
  const existed = await prisma.artist.findUnique({
    where: {
      name,
    },
  });

  if (existed) {
    return existed;
  }

  const created = await prisma.artist.create({
    data: {
      name,
    },
  });

  return created;
}
