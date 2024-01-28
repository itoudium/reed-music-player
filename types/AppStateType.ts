

export type PlaybackInfoType = {
  status: "playing" | "paused" | "stopped";
  position?: number;
  duration?: number;
}


export type AppStateType = {
  playbackInfo: PlaybackInfoType;
}