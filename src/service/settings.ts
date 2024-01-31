import { prisma } from './prisma';

export async function listSettings() {
  const settings = await prisma.setting.findMany();

  return settings;
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({
    where: {
      key: key,
    },
  });

  if (setting) {
    return setting.value;
  } else {
    return null;
  }
}

export async function setSetting(key: string, value: string) {
  const setting = await prisma.setting.findUnique({
    where: {
      key: key,
    },
  });

  if (setting) {
    await prisma.setting.update({
      where: {
        key: key,
      },
      data: {
        value: value,
      },
    });
  } else {
    await prisma.setting.create({
      data: {
        key: key,
        value: value,
      },
    });
  }
}
