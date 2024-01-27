import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { broadcastDevReady } from "@remix-run/node";
import routes from "./routes/index";

// notice that the result of `remix build` is "just a module"
import * as build from "../build/index.js";

const app = express();
app.use(express.static("public"));

app.use("/api", routes);

// and your app is "just a request handler"
app.all("*", createRequestHandler({ build }));

app.listen(3000, () => {
  if (process.env.NODE_ENV === "development") {
    broadcastDevReady(build);
  }

  console.log("App listening on http://localhost:3000");
});