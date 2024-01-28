import { Album } from '@prisma/client';
import { useAPILoader } from '../../hooks/apiLoader';
import { getAlbum, listAlbumContents } from '../../lib/apiClient';
import { Box, Icon, Spinner, Stack } from '@chakra-ui/react';
import React from 'react';
import { BsMusicNote } from 'react-icons/bs';
import { ContentList } from './ContentList';

export function AlbumContentsList({ albumId }: { albumId: string }) {
  const [album, isLoadingAlbum] = useAPILoader(async () => {
    const result = await getAlbum({
      id: albumId,
    });
    return result.album;
  });

  const [data, isLoading] = useAPILoader(async () => {
    const result = await listAlbumContents({
      albumId,
    });
    return result.contents;
  });

  return (
    <Box mb="40">
      {isLoadingAlbum && <Spinner />}
      {album && <AlbumInfo album={album} />}
      {isLoading && <Spinner />}
      {data && <ContentList contents={data} />}
    </Box>
  );
}

function AlbumInfo({ album }: { album: Album }) {
  return (
    <Stack direction="row" alignItems="center" m={3}>
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
      <Box>
        <Box fontSize="small">{album.name}</Box>
        <Box fontSize="small" color="gray.500">
          {album.albumArtist}
        </Box>
      </Box>
    </Stack>
  );
}
