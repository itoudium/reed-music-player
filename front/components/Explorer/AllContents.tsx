import { Box, Spinner } from "@chakra-ui/react";
import { useAPILoader } from "../../hooks/apiLoader";
import { listContent } from "../../lib/apiClient";
import React from "react";
import { ContentList } from "./ContentList";

export function AllContents() {
  const [data, isLoading] = useAPILoader(() => {
    return listContent({});
  });
    
  if (isLoading || !data) {
    return (
      <Spinner />
    );
  }

  return <ContentList contents={data.contents} />;
}