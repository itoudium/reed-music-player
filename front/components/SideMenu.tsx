import React from 'react';
import {
  Box,
  Button,
  Link,
  Spacer,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RemixLink } from '@remix-run/react';

export function SideMenu() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Box
        hideBelow={'md'}
        as="nav"
        h="100vh"
        w="200px"
        position="fixed"
        top={0}
        left={0}
        p={5}
        borderColor={'gray.200'}
        borderRightWidth={1}
      >
        <SideMenuContent />
      </Box>
      <Spacer hideBelow={'md'} w="200px" flex="0 1 200px"></Spacer>
      <Box
        hideFrom={'md'}
        as="nav"
        w="100vw"
        position="fixed"
        top={0}
        left={0}
        background="white"
        borderColor={'gray.200'}
        borderBottomWidth={1}
        zIndex={1}
      >
        <Button ref={btnRef} variant="ghost" onClick={onOpen}>
          <HamburgerIcon />
        </Button>
      </Box>
      <Spacer hideFrom={'md'} my={10}></Spacer>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />

          <DrawerBody>
            <SideMenuContent />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function SideMenuContent() {
  return (
    <Stack spacing={5}>
      <Link to="/" as={RemixLink}>
        Home
      </Link>
      <Link to="/albums" as={RemixLink}>
        Album
      </Link>
    </Stack>
  );
}
