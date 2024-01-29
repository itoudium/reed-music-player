import { Picture } from '@prisma/client';
import { IAudioMetadata, selectCover } from 'music-metadata';
import crypto from 'crypto';
import { prisma } from '../prisma';

export async function registerPicture(
  metadata: IAudioMetadata
): Promise<Picture | null> {
  console.log('registerPicture', metadata.common.picture);
  const rawPicture = selectCover(metadata.common.picture);
  if (!rawPicture) {
    return null;
  }

  const hash = crypto.createHash('md5').update(rawPicture.data).digest('hex');
  const type = rawPicture.format;

  // get or create picture type
  const existed = await prisma.picture.findUnique({
    where: {
      hash,
    },
  });
  if (existed) {
    return existed;
  }

  // create
  const created = await prisma.picture.create({
    data: {
      hash,
      type,
      data: rawPicture.data,
      size: rawPicture.data.length,
    },
  });

  return created;
}

export async function getPicture(id: string): Promise<Picture | null> {
  const picture = await prisma.picture.findUnique({
    where: {
      id,
    },
  });
  return picture;
}
