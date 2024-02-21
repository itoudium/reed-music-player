import { Box, Button, Stack, Link } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useAppContext } from '../hooks/AppProvider';
import {
  getAlbum,
  getContent,
  next,
  play,
  prev,
  setRepeat,
  setShuffle,
  setVolume,
  stop,
} from '../lib/apiClient';
import { Icon } from '@chakra-ui/react';
import { BsPause, BsRepeat, BsRepeat1, BsShuffle } from 'react-icons/bs';
import { BsPlay } from 'react-icons/bs';
import { BsSkipForward } from 'react-icons/bs';
import { BsSkipBackward } from 'react-icons/bs';
import { secondToDisplayTime } from '../lib/timeUtil';
import { useAPILoader } from '../hooks/apiLoader';
import { VolumeControl } from './PlaybackController/VolumeControl';
import { PositionControl } from './PlaybackController/PositionControl';
import { useColorModeColor } from '../hooks/colorUtils';
import { AlbumArtwork } from './AlbumArtwork';
import { Link as RemixLink } from '@remix-run/react';

function nextRepeatMode(repeat: 'none' | 'one' | 'all' | undefined) {
  switch (repeat) {
    case 'none':
      return 'all';
    case 'all':
      return 'one';
    case 'one':
      return 'none';
    default:
      return 'all';
  }
}

const CONTEXT_ICON_SIZE = 4;
const MAIN_ICON_SIZE = 6;

export function PlaybackController() {
  const { state } = useAppContext();
  const { bgColor, borderColor } = useColorModeColor();

  const [content, isLoading] = useAPILoader(async () => {
    return state.playbackInfo.contentId
      ? getContent({ id: state.playbackInfo.contentId })
      : null;
  }, [state.playbackInfo.contentId]);

  const [album, isLoadingAlbum] = useAPILoader(async () => {
    return content?.content?.albumId
      ? getAlbum({ id: content.content.albumId })
      : null;
  }, [content?.content?.albumId]);

  const [uiShuffle, setUiShuffle] = React.useState(state.playbackInfo.shuffle);
  const [uiRepeat, setUiRepeat] = React.useState(state.playbackInfo.repeat);

  useEffect(() => {
    setUiShuffle(state.playbackInfo.shuffle);
  }, [state.playbackInfo.shuffle]);

  useEffect(() => {
    setUiRepeat(state.playbackInfo.repeat);
  }, [state.playbackInfo.repeat]);

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

  const onClickPrev = () => {
    prev();
  };

  const onClickNext = () => {
    next();
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
      backgroundColor={bgColor}
      borderColor={borderColor}
      borderTopWidth={1}
      alignItems={'center'}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        maxW="md"
        m="auto"
        spacing={3}
      >
        <AlbumArtwork album={album?.album} size={28} />
        <Box>
          <Stack mb={2} justifyContent="center" textAlign="center" spacing={0}>
            <Box fontSize="sm" color="gray.500">
              {content?.content?.artist || <br />}
            </Box>
            <Box fontSize="lg" fontWeight="bold">
              {content?.content?.title || <br />}
            </Box>
            <Box fontSize="sm" color="gray.500">
              {!!album?.album?.name && (
                <Link as={RemixLink} to={`/albums/${album.album.id}`}>
                  {album.album.name}
                </Link>
              )}
              {<br />}
            </Box>
          </Stack>

          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            position="relative"
          >
            <Button
              variant="ghost"
              onClick={() => {
                setUiShuffle(!uiShuffle);
                setShuffle(!uiShuffle);
              }}
            >
              <Icon
                as={BsShuffle}
                color={uiShuffle ? 'green.500' : undefined}
                w={CONTEXT_ICON_SIZE}
                h={CONTEXT_ICON_SIZE}
              />
            </Button>
            <Button variant="ghost">
              <Icon as={BsSkipBackward} w={6} h={6} onClick={onClickPrev} />
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
              <Icon as={BsSkipForward} w={6} h={6} onClick={onClickNext} />
            </Button>
            <Button
              variant="ghost"
              // colorScheme={uiRepeat === "all" || uiRepeat === "one" ? 'green' : undefined}
              onClick={() => {
                const nextMode = nextRepeatMode(uiRepeat);
                setUiRepeat(nextMode);
                setRepeat(nextMode);
              }}
            >
              {uiRepeat === 'one' && (
                <Icon
                  as={BsRepeat1}
                  w={CONTEXT_ICON_SIZE}
                  h={CONTEXT_ICON_SIZE}
                  color="green.500"
                />
              )}
              {uiRepeat === 'all' && (
                <Icon
                  as={BsRepeat}
                  w={CONTEXT_ICON_SIZE}
                  h={CONTEXT_ICON_SIZE}
                  color="green.500"
                />
              )}
              {(!uiRepeat || uiRepeat === 'none') && (
                <Icon
                  as={BsRepeat}
                  w={CONTEXT_ICON_SIZE}
                  h={CONTEXT_ICON_SIZE}
                />
              )}
            </Button>
          </Stack>

          <Stack p={3} direction={'row'} alignItems="stretch">
            <Box
              position="relative"
              flexGrow={1}
              display={'flex'}
              alignItems={'center'}
            >
              <PositionControl />
              <Box
                textAlign="center"
                fontSize="xs"
                color="gray.500"
                position="absolute"
                left="50%"
                transform="translateX(-50%)"
                bottom={4}
              >
                {secondToDisplayTime(state.playbackInfo.position)} /{' '}
                {secondToDisplayTime(state.playbackInfo.duration)}
              </Box>
            </Box>
            <Box flexShrink={1}>
              <VolumeControl
                onChangeEnd={onChangeVolume}
                value={state.playbackInfo.volume}
              />
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
