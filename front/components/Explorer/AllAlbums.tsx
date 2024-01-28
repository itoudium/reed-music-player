import { Box, Spinner } from '@chakra-ui/react';
import { useAPILoader } from '../../hooks/apiLoader';
import { listAlbums } from '../../lib/apiClient';
import { AlbumList } from './AlbumList';
import React from 'react';

export function AllAlbums() {
  const [data, isLoading] = useAPILoader(() => {
    return listAlbums({});
  });

  if (isLoading || !data) {
    return <Spinner />;
  }

  return (
    <Box mb="200px">
      <AlbumList albums={data.albums} />
    </Box>
  );
}
