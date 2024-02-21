import { Box, Button, Heading, Icon, Link, Stack } from '@chakra-ui/react';
import { Album, Artist, Content } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import React from 'react';
import { AlbumArtwork } from '../AlbumArtwork';
import { Link as RemixLink } from '@remix-run/react';
import { BsPlayCircle } from 'react-icons/bs';
import { useAppContext } from '../../hooks/AppProvider';
import { play } from '../../lib/apiClient';

export function AlbumInfo({
  album,
  artists,
  contents,
}: {
  album: SerializeFrom<Album>;
  artists: SerializeFrom<Artist>[];
  contents: SerializeFrom<Content>[];
}) {
  const { state } = useAppContext();
  const nowPlayingThisAlbum =
    state.playbackInfo.status === 'playing' &&
    state.playbackInfo.context.albumId === album.id;

  const onPlayAlbum = () => {
    if (nowPlayingThisAlbum) return;

    play({
      contentId: state.playbackInfo.shuffle ? undefined : contents[0]?.id,
      context: {
        albumId: album.id,
      },
    });
  };

  return (
    <Stack direction="row" alignItems="center" m={3}>
      <AlbumArtwork album={album} size={32} />
      <Stack>
        <Heading fontSize="md">{album.name}</Heading>
        <Stack
          direction={'row'}
          spacing={2}
          divider={<>&nbsp;,&nbsp;</>}
          flexWrap={'wrap'}
        >
          {artists.map((artist) => (
            <Link
              fontSize="sm"
              color="gray.500"
              to={`/artists/${artist.id}`}
              key={artist.id}
              as={RemixLink}
            >
              {artist.name}
            </Link>
          ))}
        </Stack>
        <Box mt={3}>
          <Button variant={'ghost'} onClick={onPlayAlbum}>
            <Icon
              as={BsPlayCircle}
              w={6}
              h={6}
              color={nowPlayingThisAlbum ? 'green.500' : undefined}
            />
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
}
