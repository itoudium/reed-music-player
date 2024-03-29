import { Box, Icon, Spinner, Stack } from '@chakra-ui/react';
import { Content } from '@prisma/client';
import React from 'react';
import { BsPlay } from 'react-icons/bs';
import { play } from '../../lib/apiClient';
import { useAppContext } from '../../hooks/AppProvider';
import { secondToDisplayTime } from '../../lib/timeUtil';
import { SerializeFrom } from '@remix-run/node';

export function ContentListItem({
  content,
  albumId,
  artistId,
}: {
  content: SerializeFrom<Content>;
  albumId?: string;
  artistId?: string;
}) {
  const { state } = useAppContext();

  const onClickPlay = () => {
    play({
      contentId: content.id,
      context: {
        albumId,
        artistId,
      },
    });
  };

  return (
    <Box onClick={onClickPlay} cursor="pointer" position="relative" pl={5}>
      {state.playbackInfo.contentId === content.id && (
        <>
          {state.playbackInfo.status === 'playing' && (
            <Icon
              as={BsPlay}
              color="green.500"
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              w="12px"
              h="12px"
            />
          )}
          {state.playbackInfo.status === 'decoding' && (
            <Spinner
              color="green.500"
              position="absolute"
              left={0}
              top="5px"
              w="12px"
              h="12px"
            />
          )}
          {state.playbackInfo.status === 'stopped' && (
            <Box
              position="absolute"
              left={0}
              top="50%"
              transform="translateY(-50%)"
              w="4px"
              h="4px"
              bg="green.500"
              borderRadius="50%"
            />
          )}
        </>
      )}
      <Stack direction="row" justifyContent="space-between">
        <Box>{content.title}</Box>
        <Box color="gray.500">{secondToDisplayTime(content.duration)}</Box>
      </Stack>
    </Box>
  );
}
