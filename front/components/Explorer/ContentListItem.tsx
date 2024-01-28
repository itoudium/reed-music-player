import { Box, Icon } from '@chakra-ui/react';
import { Content } from '@prisma/client';
import React from 'react';
import { BsPlay } from 'react-icons/bs';
import { play } from '../../lib/apiClient';
import { useAppContext } from '../../hooks/AppProvider';

export function ContentListItem({ content }: { content: Content }) {
  const { state } = useAppContext();

  const onClickPlay = () => {
    play({ contentId: content.id });
  };

  return (
    <Box onClick={onClickPlay} cursor="pointer" position="relative" pl={5}>
      {state.playbackInfo.contentId === content.id && (
        <Icon
          as={BsPlay}
          color="green.500"
          position="absolute"
          left={0}
          top="50%"
          transform="translateY(-50%)"
        />
      )}
      {content.title}
    </Box>
  );
}
