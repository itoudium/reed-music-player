import { Router } from 'express';
import { playbackRoute } from './playbackRoute';
import { contentsRoute } from './contentsRoute';
import { pictureRoute } from './pictureRoute';

const route = Router();

route.use(playbackRoute);
route.use(contentsRoute);
route.use(pictureRoute);

export default route;
