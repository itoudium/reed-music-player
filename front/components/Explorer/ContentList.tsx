import { Box, Stack, StackDivider } from '@chakra-ui/react';
import { Content } from '@prisma/client';
import React from 'react';
import { ContentListItem } from './ContentListItem';
import { SerializeFrom } from '@remix-run/node';

export function ContentList({
  contents,
}: {
  contents: SerializeFrom<Content>[];
}) {
  return (
    <Stack divider={<StackDivider />}>
      {contents.map((content) => (
        <ContentListItem key={content.id} content={content} />
      ))}
    </Stack>
  );
}
