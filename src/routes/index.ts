import { Router } from "express";
import { playbackManager } from "../service/playbackManager";

const route = Router();

route.post("/play", (req, res, next) => {
  playbackManager.play();

  res.json({
    success: true
  })
});

route.post("/stop", (req,res,next) => {
  playbackManager.stop();

  res.json({
    success: true
  })
})


export default route;
