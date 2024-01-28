import { Router } from 'express';
import { seeker } from '../service/seeker';
import { z } from 'zod';

const route = Router();

route.post('/listContent', async (req, res, next) => {
  const result = await seeker.listContent(req.body);
  res.json({
    success: true,
    contents: result.contents,
    totalCount: result.totalCount,
  });
});

route.post('/getContent', async (req, res, next) => {
  const result = await seeker.getContent(req.body.id);
  res.json({
    success: true,
    content: result,
  });
});

const listAlbumContentsParamsParser = z.object({
  albumId: z.string(),
});

route.post('/listAlbumContents', async (req, res, next) => {
  const result = await seeker.listAlbumContents(
    listAlbumContentsParamsParser.parse(req.body)
  );
  res.json({
    success: true,
    contents: result.contents,
  });
});

const listAlbumsParamsParser = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

route.post('/listAlbums', async (req, res, next) => {
  const result = await seeker.listAlbums(
    listAlbumsParamsParser.parse(req.body)
  );
  res.json({
    success: true,
    albums: result.albums,
    totalCount: result.totalCount,
  });
});

const getAlbumParamsParser = z.object({
  id: z.string(),
});

route.post('/getAlbum', async (req, res, next) => {
  const result = await seeker.getAlbum(getAlbumParamsParser.parse(req.body).id);
  res.json({
    success: true,
    album: result,
  });
});

export const contentsRoute = route;
