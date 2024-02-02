import {
  Box,
  Button,
  Container,
  FormErrorMessage,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  StackDivider,
  Switch,
  useColorMode,
  useDisclosure,
} from '@chakra-ui/react';
import { ActionFunctionArgs, SerializeFrom, json } from '@remix-run/node';
import React from 'react';
import { SeekerTarget } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { serverSettings } from '../lib/bridge.server';
import { DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { startScan } from '../lib/apiClient';
import { useColorModeColor } from '../hooks/colorUtils';
dayjs.extend(relativeTime);

export async function loader() {
  const seekerTargets = await serverSettings.listSeekerTargets();

  return json({
    seekerTargets,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();
  switch (body.get('_action')) {
    case 'deleteSeekerTarget': {
      const id = body.get('id');
      if (id) {
        await serverSettings.deleteSeekerTarget(id.toString());
      }
      break;
    }
    case 'createSeekerTarget': {
      const path = body.get('path');
      if (path) {
        await serverSettings.createSeekerTarget(path.toString());
      }
      break;
    }
  }
  return json({
    message: 'ok',
  });
}

export default function SettingHome() {
  const data = useLoaderData<typeof loader>();
  return (
    <Container>
      <Heading size="md">Setting</Heading>
      <SettingSection title="Entry point">
        <SeekerTargets seekerTargets={data.seekerTargets}></SeekerTargets>
      </SettingSection>
      <SettingSection title="Appearance">
        <AppearanceSection />
      </SettingSection>
    </Container>
  );
}

function SettingSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const { borderColor } = useColorModeColor();

  return (
    <Box
      as="section"
      borderRadius={3}
      borderWidth={1}
      p={3}
      m={3}
      borderColor={borderColor}
    >
      <Heading size="md" mb={4}>
        {title}
      </Heading>
      {children}
    </Box>
  );
}

function SeekerTargets({
  seekerTargets,
}: {
  seekerTargets: SerializeFrom<SeekerTarget>[];
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Stack divider={<StackDivider />}>
        {seekerTargets.map((seekerTarget) => (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            key={seekerTarget.id}
          >
            <Box flexGrow={2}>
              <Box>{seekerTarget.path}</Box>
              <Box>
                {!!seekerTarget.error && (
                  <FormErrorMessage>{seekerTarget.error}</FormErrorMessage>
                )}
              </Box>
              <Box>
                {!!seekerTarget.lastSeekFinishedAt && (
                  <Box>
                    Last scan finished at:{' '}
                    {dayjs(seekerTarget.lastSeekFinishedAt).fromNow()}
                  </Box>
                )}
                {!seekerTarget.lastSeekStartedAt &&
                  !seekerTarget.lastSeekFinishedAt && (
                    <Box>Not scanned yet</Box>
                  )}
                {!!seekerTarget.lastSeekStartedAt &&
                  !seekerTarget.lastSeekFinishedAt && <Box>Scanning...</Box>}
              </Box>
            </Box>

            <Form method="post">
              <input type="hidden" name="id" value={seekerTarget.id} />
              <Button
                type="submit"
                variant="ghost"
                name="_action"
                value="startScan"
                onClick={() => {
                  startScan({ id: seekerTarget.id });
                }}
              >
                <RepeatIcon />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                name="_action"
                value="deleteSeekerTarget"
              >
                <DeleteIcon />
              </Button>
            </Form>
          </Stack>
        ))}

        <Button onClick={onOpen}>Add entry point</Button>
      </Stack>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add entry point</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Form
              method="post"
              onSubmit={() => {
                onClose();
                return true;
              }}
            >
              <Stack direction={'row'}>
                <Input type="text" name="path" placeholder="Path" required />
                <Button type="submit" name="_action" value="createSeekerTarget">
                  Add
                </Button>
              </Stack>
            </Form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

function AppearanceSection() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box>
      <Stack direction={'row'} alignItems={'center'}>
        <Heading size="sm">Color mode</Heading>
        <Switch
          size="md"
          colorScheme="gray"
          onChange={() => toggleColorMode()}
          isChecked={colorMode === 'dark'}
        />
        <Box>{colorMode === 'dark' ? 'Dark' : 'Light'}</Box>
      </Stack>
    </Box>
  );
}
