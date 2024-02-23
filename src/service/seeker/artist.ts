import { Artist } from '@prisma/client';
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
