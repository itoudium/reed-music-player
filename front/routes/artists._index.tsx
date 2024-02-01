import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { ArtistList } from '../components/Explorer/ArtistList';
import { json } from '@remix-run/node';
import { listArtists } from '../lib/bridge.server';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
  const artists = await listArtists();

  return json({
    artists,
  });
}

export default function Artists() {
  const { artists } = useLoaderData<typeof loader>();
  return (
    <Container>
      <Heading size="md" my={8}>
        Artists
      </Heading>
      <ArtistList artists={artists} />
    </Container>
  );
}
