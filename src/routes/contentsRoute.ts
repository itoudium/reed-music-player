import { Router } from 'express';
import { getSeeker } from '../service/seeker';
import { z } from 'zod';
import { getSeekerTarget } from '../service/settings';

const route = Router();

route.post('/listContent', async (req, res, next) => {
  const result = await getSeeker().listContent(req.body);
  res.json({
    success: true,
    contents: result.contents,
    totalCount: result.totalCount,
  });
});

route.post('/getContent', async (req, res, next) => {
  const result = await getSeeker().getContent(req.body.id);
  res.json({
    success: true,
    content: result,
  });
});

const listAlbumContentsParamsParser = z.object({
  albumId: z.string(),
});

route.post('/listAlbumContents', async (req, res, next) => {
  const result = await getSeeker().listAlbumContents(
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
  const result = await getSeeker().listAlbums(
    listAlbumsParamsParser.parse(req.body)
  );
  res.json({
    success: true,
    albums: result.albums,
    totalCount: result.totalCount,
  });
});

const listArtistsParamsParser = z.object({
  limit: z.number().optional().default(100),
  offset: z.number().optional().default(0),
});

route.post('/listArtists', async (req, res, next) => {
  const result = await getSeeker().listArtists(
    listArtistsParamsParser.parse(req.body)
  );
  res.json({
    success: true,
    artists: result.artists,
    totalCount: result.totalCount,
  });
});

const getAlbumParamsParser = z.object({
  id: z.string(),
});

route.post('/getAlbum', async (req, res, next) => {
  const result = await getSeeker().getAlbum(
    getAlbumParamsParser.parse(req.body).id
  );
  res.json({
    success: true,
    album: result,
  });
});

const startScanParamsParser = z.object({
  id: z.string(),
});

route.post('/startScan', async (req, res, next) => {
  const target = await getSeekerTarget(
    startScanParamsParser.parse(req.body).id
  );
  if (!target) {
    res.status(400).json({
      success: false,
      message: 'Target not found',
    });
    return;
  }
  getSeeker().startScanByTarget(target);
  res.json({
    success: true,
  });
});

export const contentsRoute = route;
