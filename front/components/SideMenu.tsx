import React from 'react';
import {
  Box,
  Button,
  Icon,
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
import {
  BsMusicNote,
  BsMusicNoteBeamed,
  BsPersonLinesFill,
} from 'react-icons/bs';

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
      <Spacer hideFrom={'md'} my={8}></Spacer>
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
    <Stack justifyContent={'space-between'} h="100%" pb={52}>
      <Stack spacing={5} fontSize={'lg'}>
        <Link to="/" as={RemixLink}>
          Home
        </Link>
        <Link to="/albums" as={RemixLink}>
          <Icon as={BsMusicNoteBeamed} mr={2} />
          Album
        </Link>
        <Link to="/artists" as={RemixLink}>
          <Icon as={BsPersonLinesFill} mr={2} />
          Artist
        </Link>
      </Stack>

      <Stack spacing={5} fontSize={'lg'}>
        <Link to="/setting" as={RemixLink}>
          Setting
        </Link>
      </Stack>
    </Stack>
  );
}
