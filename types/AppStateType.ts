export type PlaybackInfoType = {
  status: 'playing' | 'decoding' | 'paused' | 'stopped';
  contentId?: string;
  position?: number;
  duration?: number;
  volume: number;
  repeat: 'none' | 'one' | 'all';
  shuffle: boolean;
  context: PlaybackContext;
};

export type AppStateType = {
  playbackInfo: PlaybackInfoType;
};

export type PlaybackContext = {
  albumId?: string;
  artistId?: string;
};
