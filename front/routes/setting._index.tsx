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
  useDisclosure,
} from '@chakra-ui/react';
import { ActionFunctionArgs, SerializeFrom, json } from '@remix-run/node';
import React from 'react';
import { SeekerTarget } from '@prisma/client';
import {
  ClientActionFunctionArgs,
  Form,
  useLoaderData,
} from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { serverSettings } from '../lib/bridge.server';
import { DeleteIcon, RepeatIcon } from '@chakra-ui/icons';
import { startScan } from '../lib/apiClient';
dayjs.extend(relativeTime);

export async function loader() {
  const seekerTargets = await serverSettings.listSeekerTargets();
  return json({
    seekerTargets,
  });
}

export async function action({ request }: ActionFunctionArgs) {
  console.log(request);
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

export const clientAction = async ({
  request,
  serverAction,
}: ClientActionFunctionArgs) => {
  console.log(request);
  const body = await request.formData();

  // console.log(body.get('_action'));
  if (body.get('_action') === 'startScan') {
    await startScan({ id: body.get('id')?.toString() ?? '' });
  }

  return null;
};

export default function SettingHome() {
  const data = useLoaderData<typeof loader>();
  return (
    <Container>
      <Heading size="md">Setting</Heading>
      <SettingSection title="Entry point">
        <SeekerTargets seekerTargets={data.seekerTargets}></SeekerTargets>
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
  return (
    <Box
      as="section"
      borderRadius={3}
      borderWidth={1}
      p={3}
      m={3}
      borderColor="gray.200"
    >
      <Heading size="sm" borderColor="gray.200">
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
            <Form method="post" onSubmit={() => onClose()}>
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
