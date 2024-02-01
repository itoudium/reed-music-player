import { Container, Heading, Link, Text } from '@chakra-ui/react';
import { Link as RemixLink } from '@remix-run/react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import React from 'react';
import { getArtist, listAlbumsByArtist } from '../lib/bridge.server';
import { useLoaderData } from '@remix-run/react';
import { AlbumList } from '../components/Explorer/AlbumList';

export async function loader({ params }: LoaderFunctionArgs) {
  const artistId = params.artistId!;
  const artist = await getArtist(artistId);
  const albums = await listAlbumsByArtist(artistId);

  return json({ artist, albums });
}

export default function ArtistDetail() {
  const { artist, albums } = useLoaderData<typeof loader>();

  return (
    <Container>
      <Heading size="md" my={8}>
        <Link to="/artists" as={RemixLink}>
          <Text as="span" color="gray.500" fontWeight={'normal'}>
            Artist /
          </Text>
        </Link>
        {artist?.name}
      </Heading>

      <AlbumList albums={albums} />
    </Container>
  );
}
