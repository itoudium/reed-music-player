import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { broadcastDevReady } from "@remix-run/node";
import routes from "./routes/index";
import { Server } from "socket.io";
import { createServer } from "http";
import compression from "compression"
import morgan from "morgan";
import { playbackManager } from "./service/playbackManager";

// notice that the result of `remix build` is "just a module"
import * as build from "../build/index.js";

const app = express();
const server = createServer(app);
const io = new Server(server);

playbackManager.events.on("updateState", (state) => {
  io.emit('updateState', {
    playbackInfo: state
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.use(compression());
app.use(morgan("dev", {
  skip: function (req, res) { return req.path.startsWith("/build/"); }
}));
app.use(express.static("public"));

app.use("/api", routes);

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));


server.listen(3000, () => {
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }

  console.log("App listening on http://localhost:3000");
});