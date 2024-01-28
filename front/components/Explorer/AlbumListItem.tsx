import { Box, Icon } from '@chakra-ui/react';
import { Album } from '@prisma/client';
import React from 'react';
import { BsMusicNote } from 'react-icons/bs';

export function AlbumListItem({ album }: { album: Album }) {
  return (
    <Box>
      <Box
        w={20}
        h={20}
        borderRadius={3}
        backgroundColor="gray.200"
        aria-label="album cover"
        position={'relative'}
      >
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
      </Box>
      <Box fontSize="small">{album.name}</Box>
      <Box fontSize="small" color="gray.500">
        {album.albumArtist}
      </Box>
    </Box>
  );
}
