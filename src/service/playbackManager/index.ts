import audioDecode from 'audio-decode';
import fs from 'fs/promises';
import Speaker from 'speaker';
import PCM from 'pcm-util';
import EventEmitter from 'events';
import { PlaybackContext, PlaybackInfoType } from '../../../types/AppStateType';
import { prisma } from '../prisma';
import { Content } from '@prisma/client';
import { Mixer } from './mixer';
import { z } from 'zod';
import { getSetting, setSetting } from '../settings';
import { PlaybackContextManager } from './playbackContextManager';

type JobType =
  | {
      action: 'play';
      contentId?: string;
      position?: number;
      context?: PlaybackContext;
    }
  | {
      action: 'stop';
    }
  | {
      action: 'next';
    }
  | {
      action: 'prev';
    };

class PlaybackManager {
  status: PlaybackInfoType['status'] = 'stopped';
  running = false;
  queue: JobType[] = [];
  events = new EventEmitter();
  speaker: Speaker;
  mixer: Mixer;
  playStartPosition: number = 0;
  playStartTime: Date | null = null;
  content?: Content;
  duration: number = 0;
  shuffle = false;
  repeat: 'none' | 'one' | 'all' = 'all';

  context: PlaybackContext = {};

  contextManager: PlaybackContextManager = new PlaybackContextManager(
    {},
    {
      shuffle: this.shuffle,
      repeat: this.repeat,
      contentId: '',
    }
  );

  private _audioArrayBuffer: Uint8Array | null = null;

  constructor() {
    // restore settings
    getSetting('volume').then((volume) => {
      volume && this.setVolume(parseInt(volume), false);
    });
    getSetting('shuffle').then((shuffle) => {
      shuffle && (this.shuffle = shuffle === 'true');
    });
    getSetting('repeat').then((repeat) => {
      repeat && (this.repeat = repeat as 'none' | 'one' | 'all');
    });

    this.speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
    });

    this.mixer = new Mixer({
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
    });

    this.mixer.pipe(this.speaker);

    this.events.on('added', () => {
      this.processQueue();
    });

    // broadcast playback status
    setInterval(() => {
      if (this.status !== 'playing' && this.status === this._lastStatus) return;
      this.broadcastStatus();
      this._lastStatus = this.status;
    }, 1_000);

    this.mixer.events.on('finished', () => {
      this.status = 'stopped';
      this.broadcastStatus();
      this.next();
    });
  }

  private _lastStatus?: PlaybackInfoType['status'];

  broadcastStatus() {
    const state: PlaybackInfoType = {
      status: this.status,
      position: this.mixer.position,
      duration: this.duration,
      contentId: this.content?.id,
      volume: this.mixer.volume,
      repeat: this.repeat,
      shuffle: this.shuffle,
      context: this.context,
    };
    this.events.emit('updateState', state);
  }

  async processQueue() {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      try {
        this.running = true;
        switch (task?.action) {
          case 'play':
            await this._play(task);
            break;
          case 'stop':
            await this._stop(task);
            break;
          case 'next':
            await this._next(task);
            break;
          case 'prev':
            await this._prev(task);
            break;
        }
      } catch (e) {
        throw e;
      } finally {
        this.running = false;
      }
    }
  }

  private addJob(job: JobType) {
    this.queue.push(job);
    this.events.emit('added');
  }

  play(params: {
    contentId?: string;
    position?: number;
    context?: PlaybackContext;
  }) {
    this.addJob({
      action: 'play',
      contentId: params.contentId,
      position: params.position,
      context: params.context,
    });
  }

  stop() {
    this.addJob({
      action: 'stop',
    });
  }

  next() {
    this.addJob({
      action: 'next',
    });
  }

  prev() {
    this.addJob({
      action: 'prev',
    });
  }

  private async _play(job: JobType & { action: 'play' }) {
    this.mixer.clearAudioBuffer();

    // update context
    this.context = job.context ?? this.context;
    if (job.context) {
      this.contextManager = new PlaybackContextManager(this.context, {
        shuffle: this.shuffle,
        repeat: this.repeat,
        contentId: job.contentId,
      });
    }
    await this.contextManager.waitUntilLoaded();

    const content = this.contextManager.currentContent;

    if (!content) {
      throw new Error('content not found');
    }
    if (!this.content || content.id !== this.content?.id) {
      // decode audio
      this.content = content;
      this.status = 'decoding';
      this.broadcastStatus();
      console.time('decode');
      const buffer = await fs.readFile(content.path);
      const audioBuffer = await audioDecode(buffer);
      this.duration = audioBuffer.duration;
      this._audioArrayBuffer = PCM.toArrayBuffer(audioBuffer);
      console.timeEnd('decode');
    }

    if (!this._audioArrayBuffer) throw new Error('audioBuffer not found');

    this.playStartTime = new Date();
    this.playStartPosition = job.position ?? 0;
    this.status = 'playing';

    this.mixer.putAudioBuffer(
      Buffer.from(this._audioArrayBuffer),
      this.playStartPosition
    );
  }

  private async _stop(_: JobType & { action: 'stop' }) {
    this.mixer.clearAudioBuffer();

    this.status = 'stopped';
    // save current position to playStartPosition
    this.playStartPosition = this.playStartTime
      ? (new Date().getTime() - this.playStartTime.getTime()) / 1000
      : 0;
    this.playStartTime = null;

    console.log('stopped');
  }

  private async _next(_: JobType & { action: 'next' }) {
    console.log('next');

    this.contextManager.next();

    if (!this.contextManager.currentContent) return;

    this.play({
      contentId: this.contextManager.currentContent.id,
      position: 0,
    });
  }

  private async _prev(_: JobType & { action: 'prev' }) {
    console.log('prev');

    this.contextManager.prev();

    if (!this.contextManager.currentContent) return;

    this.play({
      contentId: this.contextManager.currentContent.id,
      position: 0,
    });
  }

  setVolume(volume: number, save = true) {
    const parsed = z.number().max(100).min(0).parse(volume);
    this.mixer.volume = parsed;

    if (save) {
      setSetting('volume', parsed.toString());
    }
  }

  setShuffle(shuffle: boolean) {
    this.shuffle = shuffle;
    this.contextManager.setShuffle(shuffle);
    setSetting('shuffle', shuffle.toString());
    this.broadcastStatus();
  }

  setRepeat(repeat: 'none' | 'one' | 'all') {
    this.repeat = repeat;
    this.contextManager.setRepeat(repeat);
    setSetting('repeat', repeat);
    this.broadcastStatus();
  }
}

export const playbackManager = new PlaybackManager();
