import { Grid, GridItem, Stack, StackDivider } from '@chakra-ui/react';
import { Album } from '@prisma/client';
import React from 'react';
import { AlbumListItem } from './AlbumListItem';

export function AlbumList({ albums }: { albums: Album[] }) {
  return (
    <Grid templateColumns={[null, 'repeat(2, 1fr)', 'repeat(5, 1fr)']} gap={3}>
      {albums.map((album) => (
        <GridItem key={album.id}>
          <AlbumListItem album={album} />
        </GridItem>
      ))}
    </Grid>
  );
}
