import { Router } from 'express';
import { playbackRoute } from './playbackRoute';
import { contentsRoute } from './contentsRoute';

const route = Router();

route.use(playbackRoute);
route.use(contentsRoute);

export default route;
