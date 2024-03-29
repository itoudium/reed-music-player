import React from 'react';
import { Container, Heading } from '@chakra-ui/react';
import { AlbumList } from '../components/Explorer/AlbumList';
import { listAllAlbums } from '../lib/bridge.server';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';

export async function loader() {
  const albums = await listAllAlbums();

  return json({
    albums,
  });
}

export default function Albums() {
  const { albums } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Heading size="md" my={8}>
        Albums
      </Heading>
      <AlbumList albums={albums} />
    </Container>
  );
}
