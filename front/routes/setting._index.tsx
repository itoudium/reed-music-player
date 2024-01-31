import {
  Box,
  Button,
  Container,
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
import { prisma } from '../../src/service/prisma';
import { SeekerTarget } from '@prisma/client';
import { Form, useLoaderData } from '@remix-run/react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

export async function loader() {
  const seekerTargets = await prisma.seekerTarget.findMany();
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
        await prisma.seekerTarget.delete({
          where: {
            id: id.toString(),
          },
        });
      }
      break;
    }
    case 'addSeekerEntryPoint': {
      const path = body.get('path');
      if (path) {
        await prisma.seekerTarget.create({
          data: {
            path: path.toString(),
          },
        });
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
              <Button
                type="submit"
                variant="ghost"
                name="_action"
                value="deleteSeekerTarget"
              >
                <input type="hidden" name="id" value={seekerTarget.id} />
                Delete
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
                <Button
                  type="submit"
                  name="_action"
                  value="addSeekerEntryPoint"
                >
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
