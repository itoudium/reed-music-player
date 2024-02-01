import { Box, Link } from '@chakra-ui/react';
import { Link as RemixLink } from '@remix-run/react';
import React from 'react';

type Artist = {
  id: string;
  name: string;
};

export function ArtistListItem({ artist }: { artist: Artist }) {
  return (
    <Link to={`/artists/${artist.id}`} as={RemixLink}>
      <Box>{artist.name}</Box>
    </Link>
  );
}
