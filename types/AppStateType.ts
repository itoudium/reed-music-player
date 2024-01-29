export type PlaybackInfoType = {
  status: 'playing' | 'decoding' | 'paused' | 'stopped';
  contentId?: string;
  position?: number;
  duration?: number;
};

export type AppStateType = {
  playbackInfo: PlaybackInfoType;
};
