import { Router } from 'express';
import { z } from 'zod';
import { playbackManager } from '../service/playbackManager';

const route = Router();

const playParamsParser = z.object({
  contentId: z.string(),
  position: z.number().optional(),
  context: z
    .object({
      albumId: z.string().optional(),
      artistId: z.string().optional(),
    })
    .optional(),
});

route.post('/play', (req, res, next) => {
  playbackManager.play(playParamsParser.parse(req.body));

  res.json({
    success: true,
  });
});

route.post('/stop', (req, res, next) => {
  playbackManager.stop();

  res.json({
    success: true,
  });
});

route.post('/setVolume', (req, res, next) => {
  const volume = req.body.volume;
  playbackManager.setVolume(volume);

  res.json({
    success: true,
  });
});

const repeatParamsParser = z.object({
  repeat: z.enum(['none', 'one', 'all']),
});

route.post('/setRepeat', (req, res, next) => {
  const { repeat } = repeatParamsParser.parse(req.body);
  playbackManager.setRepeat(repeat);

  res.json({
    success: true,
  });
});

const shuffleParamsParser = z.object({
  shuffle: z.boolean(),
});

route.post('/setShuffle', (req, res, next) => {
  const { shuffle } = shuffleParamsParser.parse(req.body);
  playbackManager.setShuffle(shuffle);

  res.json({
    success: true,
  });
});

route.post('/next', (req, res, next) => {
  playbackManager.next();

  res.json({
    success: true,
  });
});

route.post('/prev', (req, res, next) => {
  playbackManager.prev();

  res.json({
    success: true,
  });
});

export const playbackRoute = route;
