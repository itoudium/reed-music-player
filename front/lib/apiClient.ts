import { Content } from '@prisma/client';
import axios from 'axios';

const client = axios.create();

export async function play(options: { contentId: string; position?: number }) {
  const { data } = await client.post('/api/play', options);
  return data;
}

export async function stop() {
  const { data } = await client.post('/api/stop');
  return data;
}

type ListContentResult = {
  contents: Content[];
  totalCount: number;
};

export async function listContent(options: {}): Promise<ListContentResult> {
  const { data } = await client.post('/api/listContent', options);
  return data;
}

type GetContentResult = {
  content: Content;
};

export async function getContent(options: {}): Promise<GetContentResult> {
  const { data } = await client.post('/api/getContent', options);
  return data;
}
