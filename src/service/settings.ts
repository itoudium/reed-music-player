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

export async function listSeekerTargets() {
  const targets = await prisma.seekerTarget.findMany();

  return targets;
}

export async function deleteSeekerTarget(id: string) {
  await prisma.seekerTarget.delete({
    where: {
      id,
    },
  });
}

export async function createSeekerTarget(path: string) {
  await prisma.seekerTarget.create({
    data: {
      path,
    },
  });
}

export async function getSeekerTarget(id: string) {
  const target = await prisma.seekerTarget.findUnique({
    where: {
      id,
    },
  });

  return target;
}
