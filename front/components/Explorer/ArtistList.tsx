import { Stack, StackDivider } from '@chakra-ui/react';
import React from 'react';
import { ArtistListItem } from './ArtistListItem';

type Artist = {
  id: string;
  name: string;
};

export function ArtistList({ artists }: { artists: Artist[] }) {
  return (
    <Stack divider={<StackDivider />}>
      {artists.map((artist) => (
        <ArtistListItem artist={artist} />
      ))}
    </Stack>
  );
}
