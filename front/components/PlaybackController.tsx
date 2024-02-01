import {
  Box,
  Button,
  Container,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Stack,
} from '@chakra-ui/react';
import React from 'react';
import { useAppContext } from '../hooks/AppProvider';
import { getContent, play, setVolume, stop } from '../lib/apiClient';
import { Icon } from '@chakra-ui/react';
import { BsPause } from 'react-icons/bs';
import { BsPlay } from 'react-icons/bs';
import { BsSkipForward } from 'react-icons/bs';
import { BsSkipBackward } from 'react-icons/bs';
import { secondToDisplayTime } from '../lib/timeUtil';
import { useAPILoader } from '../hooks/apiLoader';
import { VolumeControl } from './PlaybackController/VolumeControl';
import { PositionControl } from './PlaybackController/PositionControl';

export function PlaybackController() {
  const { state } = useAppContext();

  const [content, isLoading] = useAPILoader(async () => {
    return state.playbackInfo.contentId
      ? getContent({ id: state.playbackInfo.contentId })
      : null;
  }, [state.playbackInfo.contentId]);

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

  const onChangeVolume = (val: number) => {
    setVolume(val);
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
        <Stack mb={2} justifyContent="center" textAlign="center" spacing={0}>
          <Box fontSize="sm" color="gray.500">
            {content?.content?.artist || <br />}
          </Box>
          <Box fontSize="lg" fontWeight="bold">
            {content?.content?.title || <br />}
          </Box>
          <Box fontSize="sm" color="gray.500">
            {content?.content?.album || <br />}
          </Box>
        </Stack>

        <Stack direction="row" justifyContent="center" position="relative">
          <Button variant="ghost">
            <Icon as={BsSkipBackward} w={6} h={6} />
          </Button>
          {(state.playbackInfo.status === 'playing' ||
            state.playbackInfo.status === 'decoding') && (
            <Button
              onClick={onClickStop}
              variant="ghost"
              disabled={state.playbackInfo.status === 'decoding'}
            >
              <Icon as={BsPause} w={6} h={6} />
            </Button>
          )}
          {(state.playbackInfo.status === 'paused' ||
            state.playbackInfo.status === 'stopped') && (
            <Button onClick={onClickPlay} variant="ghost">
              <Icon as={BsPlay} w={6} h={6} />
            </Button>
          )}
          <Button variant="ghost">
            <Icon as={BsSkipForward} w={6} h={6} />
          </Button>
        </Stack>

        <Stack p={3} direction={'row'} position="relative">
          <Box
            textAlign="center"
            fontSize="xs"
            color="gray.500"
            position="absolute"
            left="50%"
            transform="translateX(-50%)"
            bottom={2}
          >
            {secondToDisplayTime(state.playbackInfo.position)} /{' '}
            {secondToDisplayTime(state.playbackInfo.duration)}
          </Box>
          <PositionControl />
          <Box flexShrink={1}>
            <VolumeControl
              onChangeEnd={onChangeVolume}
              value={state.playbackInfo.volume}
            />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
