import { Router } from 'express';
import { getPicture } from '../service/seeker/picture';

export const pictureRoute = Router();

pictureRoute.get('/picture/:id', async (req, res) => {
  const pictureId = req.params.id;
  const picture = await getPicture(pictureId);
  if (!picture) {
    res.sendStatus(404);
    return;
  }

  res.setHeader('Content-Type', picture.type);
  res.setHeader('Content-Length', picture.size);
  res.setHeader('Cache-Control', 'public, max-age=60');
  res.end(picture.data);
});
