import { Box, Icon, Image, Link } from '@chakra-ui/react';
import { Album } from '@prisma/client';
import { Link as RemixLink } from '@remix-run/react';
import React from 'react';
import { BsMusicNote } from 'react-icons/bs';
import { AlbumArtwork } from '../AlbumArtwork';
import { SerializeFrom } from '@remix-run/node';

export function AlbumListItem({ album }: { album: SerializeFrom<Album> }) {
  return (
    <Link to={`/albums/${album.id}`} as={RemixLink}>
      <Box>
        <AlbumArtwork album={album} size={20} />
        <Box fontSize="sm">{album.name}</Box>
        <Box fontSize="sm" color="gray.500">
          {album.albumArtist}
        </Box>
      </Box>
    </Link>
  );
}
