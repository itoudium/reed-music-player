export type PlaybackInfoType = {
  status: 'playing' | 'decoding' | 'paused' | 'stopped';
  contentId?: string;
  position?: number;
  duration?: number;
  volume: number;
};

export type AppStateType = {
  playbackInfo: PlaybackInfoType;
};
