import React from 'react';
import { PlaybackController } from '../components/PlaybackController';
import { Container } from '@chakra-ui/react';
import { AllContents } from '../components/Explorer/AllContents';

export default function Hello() {
  return (
    <>
      <Container>
        <AllContents />
      </Container>
      <PlaybackController />
    </>
  );
}
