import { Router } from 'express';
import { z } from 'zod';
import { playbackManager } from '../service/playbackManager';

const route = Router();

const playParamsParser = z.object({
  contentId: z.string(),
  position: z.number().optional(),
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

export const playbackRoute = route;
