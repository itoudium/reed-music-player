import React, { useContext, useEffect, useState } from 'react';
import { withEmotionCache } from '@emotion/react';
import { Box, ChakraProvider, Stack } from '@chakra-ui/react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { MetaFunction, LinksFunction } from '@remix-run/node'; // Depends on the runtime you choose

import { ServerStyleContext, ClientStyleContext } from './context';
import { AppProvider } from './hooks/AppProvider';
import { SideMenu } from './components/SideMenu';
import { PlaybackController } from './components/PlaybackController';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fontSizes: {
    xs: '0.63rem',
    sm: '0.75rem',
    md: '0.75rem',
    lg: '0.875rem',
    xl: '1rem',
    '2xl': '1.125rem',
    '3xl': '1.5rem',
    '4xl': '1.875rem',
    '5xl': '2.25rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
  },
  breakpoints: {
    sm: '0em',
    md: '30em',
  },
});

export const meta: MetaFunction = () => [
  {
    charset: 'utf-8',
    title: 'reed',
    viewport: 'width=device-width,initial-scale=1',
  },
];

export let links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(
  ({ children }: DocumentProps, emotionCache) => {
    const serverStyleData = useContext(ServerStyleContext);
    const clientStyleData = useContext(ClientStyleContext);

    // Only executed on client
    useEffect(() => {
      // re-link sheet container
      emotionCache.sheet.container = document.head;
      // re-inject tags
      const tags = emotionCache.sheet.tags;
      emotionCache.sheet.flush();
      tags.forEach((tag) => {
        (emotionCache.sheet as any)._insertTag(tag);
      });
      // reset cache to reapply global styles
      clientStyleData?.reset();
    }, []);

    return (
      <html lang="en">
        <head>
          <Meta />
          <Links />
          {serverStyleData?.map(({ key, ids, css }) => (
            <style
              key={key}
              data-emotion={`${key} ${ids.join(' ')}`}
              dangerouslySetInnerHTML={{ __html: css }}
            />
          ))}
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    );
  }
);

export default function App() {
  return (
    <AppProvider>
      <Document>
        <ChakraProvider theme={theme}>
          <Stack direction={[null, 'column', 'row']} spacing={0} fontSize="md">
            <SideMenu />
            <Box flexGrow={1} py={3}>
              <Outlet />
            </Box>
          </Stack>
          <PlaybackController />
        </ChakraProvider>
      </Document>
    </AppProvider>
  );
}
