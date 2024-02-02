import React from 'react';
import {
  Box,
  Button,
  Icon,
  Link,
  Spacer,
  Stack,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { HamburgerIcon, SettingsIcon } from '@chakra-ui/icons';
import { Link as RemixLink } from '@remix-run/react';
import { BsMusicNoteBeamed, BsPersonLinesFill } from 'react-icons/bs';
import { useColorModeColor } from '../hooks/colorUtils';

export function SideMenu() {
  const { bgColor, borderColor } = useColorModeColor();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <Box
        hideBelow={'md'}
        as="nav"
        h="100vh"
        w={40}
        position="fixed"
        top={0}
        left={0}
        p={5}
        borderColor={borderColor}
        borderRightWidth={1}
      >
        <SideMenuContent />
      </Box>
      <Spacer hideBelow={'md'} w={40} flex="0 1 200px"></Spacer>
      <Box
        hideFrom={'md'}
        as="nav"
        w="100vw"
        h={12}
        position="fixed"
        top={0}
        left={0}
        background={bgColor}
        borderColor={borderColor}
        borderBottomWidth={1}
        zIndex={1}
        display={'flex'}
        alignItems={'center'}
      >
        <Button ref={btnRef} variant="ghost" onClick={onOpen}>
          <HamburgerIcon h={4} w={4} />
        </Button>
      </Box>
      <Spacer hideFrom={'md'} my={6}></Spacer>
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
            <SideMenuContent onClick={() => onClose()} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export function SideMenuContent({ onClick }: { onClick?: () => void }) {
  return (
    <Stack justifyContent={'space-between'} h="100%" pb={52}>
      <Stack spacing={5} fontSize={'lg'}>
        <Link to="/" as={RemixLink} onClick={onClick}>
          Home
        </Link>
        <Link to="/albums" as={RemixLink} onClick={onClick}>
          <Icon as={BsMusicNoteBeamed} mr={2} />
          Album
        </Link>
        <Link to="/artists" as={RemixLink} onClick={onClick}>
          <Icon as={BsPersonLinesFill} mr={2} />
          Artist
        </Link>
      </Stack>

      <Stack spacing={5} fontSize={'lg'} onClick={onClick}>
        <Link to="/setting" as={RemixLink}>
          <SettingsIcon mr={2} />
          Setting
        </Link>
      </Stack>
    </Stack>
  );
}
