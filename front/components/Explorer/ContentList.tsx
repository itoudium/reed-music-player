import { Box, Stack, StackDivider } from "@chakra-ui/react";
import { Content } from "@prisma/client";
import React from "react";
import { ContentListItem } from "./ContentListItem";

export function ContentList({ contents }: { contents: Content[] }) {
  return (
    <Stack divider={<StackDivider />}>
      {
        contents.map(content => (
          <ContentListItem key={content.id} content={content} />
        ))
      }
    </Stack>
  );
}