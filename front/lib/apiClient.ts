import { Album, Content } from '@prisma/client';
import { SerializeFrom } from '@remix-run/node';
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

export async function setVolume(volume: number) {
  const { data } = await client.post('/api/setVolume', { volume });
  return data;
}

type ListContentResult = {
  contents: SerializeFrom<Content>[];
  totalCount: number;
};

export async function listContent(options: {}): Promise<ListContentResult> {
  const { data } = await client.post('/api/listContent', options);
  return data;
}

type GetContentResult = {
  content: SerializeFrom<Content>;
};

export async function getContent(options: {
  id: string;
}): Promise<GetContentResult> {
  const { data } = await client.post('/api/getContent', options);
  return data;
}

type ListAlbumsResult = {
  albums: SerializeFrom<Album>[];
  totalCount: number;
};

export async function listAlbums(options: {
  limit?: number;
  offset?: number;
}): Promise<ListAlbumsResult> {
  const { data } = await client.post('/api/listAlbums', options);
  return data;
}

export async function getAlbum(options: {
  id: string;
}): Promise<{ album: SerializeFrom<Album> }> {
  const { data } = await client.post('/api/getAlbum', options);
  return data;
}

export async function listAlbumContents(options: {
  albumId: string;
}): Promise<{ contents: SerializeFrom<Content>[] }> {
  const { data } = await client.post('/api/listAlbumContents', options);
  return data;
}

export async function startScan(options: { id: string }) {
  await client.post('/api/startScan', options);
}
