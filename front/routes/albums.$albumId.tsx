import { Box, Container, Spacer } from '@chakra-ui/react';
import { useLoaderData } from '@remix-run/react';
import React from 'react';
import { LoaderFunctionArgs, json } from '@remix-run/node';
import {
  ListContentsByAlbum,
  getAlbum,
  listArtistsByAlbum,
} from '../lib/bridge.server';
import { AlbumInfo } from '../components/Explorer/AlbumInfo';
import { ContentList } from '../components/Explorer/ContentList';

export async function loader({ params }: LoaderFunctionArgs) {
  const { albumId } = params;

  const album = await getAlbum(albumId!);
  const contents = await ListContentsByAlbum(albumId!);
  const artists = await listArtistsByAlbum(albumId!, album?.albumArtist ?? '');

  return json({ album, contents, artists });
}

export default function AlbumPage() {
  const { album, contents, artists } = useLoaderData<typeof loader>();

  if (!album || !contents) return <Box>Album not found</Box>;

  return (
    <Container>
      <AlbumInfo album={album} artists={artists} />
      <Spacer my={3} />
      <ContentList contents={contents} albumId={album.id} />
    </Container>
  );
}
