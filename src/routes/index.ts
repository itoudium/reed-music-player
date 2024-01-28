import { Router } from 'express';
import { playbackManager } from '../service/playbackManager';
import { seeker } from '../service/seeker';
import { z } from 'zod';

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

export default route;
