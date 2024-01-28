import { Container } from '@chakra-ui/react';
import { useParams } from '@remix-run/react';
import React from 'react';
import { AlbumContentsList } from '../components/Explorer/AlbumContentsList';

export default function AlbumPage() {
  const { albumId } = useParams();

  return (
    <Container>
      <AlbumContentsList albumId={albumId ?? ''} />
    </Container>
  );
}
