import axios from "axios";

const client = axios.create();

export async function play(options: {}) {
  const { data } = await client.post("/api/play", options);
  return data;
}

export async function stop() {
  const { data } = await client.post("/api/stop");
  return data;
}