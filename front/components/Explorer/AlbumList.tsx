import { Box, Grid, GridItem, Stack, StackDivider } from '@chakra-ui/react';
import { Album } from '@prisma/client';
import React from 'react';
import { AlbumListItem } from './AlbumListItem';
import { SerializeFrom } from '@remix-run/node';

export function AlbumList({ albums }: { albums: SerializeFrom<Album>[] }) {
  return (
    <Stack
      direction={'row'}
      flexWrap={'wrap'}
      justifyContent={'flex-start'}
      margin={'auto'}
      spacing={[2, 4, 6]}
    >
      {albums.map((album) => (
        <Box key={album.id} w={20}>
          <AlbumListItem album={album} />
        </Box>
      ))}
    </Stack>
  );
}
