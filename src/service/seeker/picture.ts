import { Picture } from '@prisma/client';
import { IAudioMetadata, selectCover } from 'music-metadata';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { httpClient } from '../../utils/httpClient';

const REQUEST_INTERVAL = 1_000;
const sleepInterval = () =>
  new Promise((resolve) => setTimeout(resolve, REQUEST_INTERVAL));

export async function registerPictureByMetadata(
  metadata: IAudioMetadata
): Promise<Picture | null> {
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

export async function registerPictureByUrl(
  url: string
): Promise<Picture | null> {
  const buffer = await downloadImage(url);
  if (!buffer) {
    return null;
  }

  // get or create picture type
  const hash = crypto.createHash('md5').update(buffer).digest('hex');
  const type = 'image/jpeg';

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
      data: buffer,
      size: buffer.length,
    },
  });

  return created;
}

export async function downloadImage(url: string) {
  try {
    const res = await httpClient.get(url, { responseType: 'arraybuffer' });
    return res.data;
  } catch (e) {
    return null;
  } finally {
    await sleepInterval();
  }
}

export async function getPicture(id: string): Promise<Picture | null> {
  const picture = await prisma.picture.findUnique({
    where: {
      id,
    },
  });
  return picture;
}
