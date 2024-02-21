import { Image, Box, Icon } from '@chakra-ui/react';
import { Album } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import React from 'react';
import { BsMusicNote } from 'react-icons/bs';

export function AlbumArtwork({
  album,
  size,
}: {
  album: SerializeFrom<Album> | undefined;
  size: number | string;
}) {
  return (
    <Box
      w={size}
      h={size}
      borderRadius={3}
      backgroundColor="gray.200"
      aria-label="album cover"
      position={'relative'}
      overflow={'hidden'}
      boxShadow="sm"
    >
      {album && album.pictureId && (
        <Image
          src={`/api/pictures/${album.pictureId}`}
          alt={album.name}
          objectFit="cover"
          boxSize={size}
        />
      )}
      {(!album || !album.pictureId) && (
        <Icon
          as={BsMusicNote}
          w={10}
          h={10}
          color="white"
          position="absolute"
          left="50%"
          top="50%"
          transform="translate(-50%, -50%)"
        />
      )}
    </Box>
  );
}
