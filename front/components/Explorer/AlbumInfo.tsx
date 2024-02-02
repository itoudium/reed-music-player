import { Box, Heading, Link, Stack } from '@chakra-ui/react';
import { Album, Artist } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
import React from 'react';
import { AlbumArtwork } from '../AlbumArtwork';
import { Link as RemixLink } from '@remix-run/react';

export function AlbumInfo({
  album,
  artists,
}: {
  album: SerializeFrom<Album>;
  artists: SerializeFrom<Artist>[];
}) {
  return (
    <Stack direction="row" alignItems="center" m={3}>
      <AlbumArtwork album={album} size={32} />
      <Box>
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
      </Box>
    </Stack>
  );
}
