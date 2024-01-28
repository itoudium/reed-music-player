import {
  Box,
  Button,
  Container,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { useAppContext } from '../hooks/AppProvider';
import { play, stop } from '../lib/apiClient';
import { Icon } from '@chakra-ui/react';
import { BsPause } from 'react-icons/bs';
import { BsPlay } from 'react-icons/bs';
import { BsSkipForward } from 'react-icons/bs';
import { BsSkipBackward } from 'react-icons/bs';
import { secondToDisplayTime } from '../lib/timeUtil';

export function PlaybackController() {
  const { state } = useAppContext();

  const sliderPosition = state.playbackInfo.position
    ? (state.playbackInfo.position / (state.playbackInfo.duration ?? 0)) * 100
    : 0;

  const onClickPlay = () => {
    if (!state.playbackInfo.contentId) return;
    play({
      contentId: state.playbackInfo.contentId,
      position: state.playbackInfo.position,
    });
  };

  const onClickStop = () => {
    stop();
  };

  return (
    <Box
      position="fixed"
      zIndex={1}
      bottom={0}
      left={0}
      right={0}
      pt={3}
      w="100vw"
      backgroundColor="white"
      borderColor="gray.200"
      borderTopWidth={1}
      alignItems={'center'}
    >
      <Box maxW="md" m="auto">
        <Stack direction="row" justifyContent="center">
          <Button variant="ghost">
            <Icon as={BsSkipBackward} />
          </Button>
          {state.playbackInfo.status === 'playing' ? (
            <Button onClick={onClickStop} variant="ghost">
              <Icon as={BsPause} />
            </Button>
          ) : (
            <Button onClick={onClickPlay} variant="ghost">
              <Icon as={BsPlay} />
            </Button>
          )}
          <Button variant="ghost">
            <Icon as={BsSkipForward} />
          </Button>
        </Stack>

        <Box p={3}>
          <Box textAlign="center">
            {secondToDisplayTime(state.playbackInfo.position)} /{' '}
            {secondToDisplayTime(state.playbackInfo.duration)}
          </Box>
          <Slider
            value={sliderPosition}
            focusThumbOnChange={false}
            onChangeEnd={(val) => console.log(val)}
            colorScheme="green"
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </Box>
      </Box>
    </Box>
  );
}
