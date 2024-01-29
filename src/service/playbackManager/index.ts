import audioDecode from 'audio-decode';
import fs from 'fs/promises';
import Speaker from 'speaker';
import PCM from 'pcm-util';
import audioBufferUtils from 'audio-buffer-utils';
import EventEmitter from 'events';
import { waitForEvent } from '../../utils/events';
import { PlaybackInfoType } from '../../../types/AppStateType';
import { prisma } from '../prisma';
import { Content } from '@prisma/client';
import { Mixer } from './mixer';
import { z } from 'zod';

type JobType =
  | {
      action: 'play';
      contentId: string;
      position?: number;
    }
  | {
      action: 'stop';
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
  private _audioBuffer?: AudioBuffer;

  constructor() {
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
  }

  private _lastStatus?: PlaybackInfoType['status'];

  private broadcastStatus() {
    this.events.emit('updateState', {
      status: this.status,
      position:
        this.playStartPosition +
        (this.playStartTime
          ? (new Date().getTime() - this.playStartTime.getTime()) / 1000
          : 0),
      duration: this.duration,
      contentId: this.content?.id,
    } as PlaybackInfoType);
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

  play(params: { contentId: string; position?: number }) {
    this.addJob({
      action: 'play',
      contentId: params.contentId,
      position: params.position,
    });
  }

  stop() {
    this.addJob({
      action: 'stop',
    });

    this.events.on;
  }

  private async _play(job: JobType & { action: 'play' }) {
    this.mixer.clearAudioBuffer();

    const content = await prisma.content.findUnique({
      where: {
        id: job.contentId,
      },
    });
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
      this._audioBuffer = await audioDecode(buffer);
      console.timeEnd('decode');
    }

    if (!this._audioBuffer) throw new Error('audioBuffer not found');

    console.log('length:', this._audioBuffer.length);
    console.log('duration:', this._audioBuffer.duration);
    const positionProgress = job.position ?? 0 / this._audioBuffer.duration;
    const positionBytes = this._audioBuffer.length * positionProgress;
    console.log('position: ', positionProgress, positionBytes);

    const audioBuffer = audioBufferUtils.slice(
      this._audioBuffer,
      positionBytes
    );

    const arrayBuffer = PCM.toArrayBuffer(audioBuffer);

    this.playStartTime = new Date();
    this.playStartPosition = job.position ?? 0;
    this.duration = this._audioBuffer.duration;
    this.status = 'playing';

    // speaker.write(Buffer.from(arrayBuffer), (err) => {
    //   this.events.emit('stopped');
    // });
    this.mixer.putAudioBuffer(Buffer.from(arrayBuffer), 0);
  }

  private async _stop(_: JobType & { action: 'stop' }) {
    // if (!this.speaker) return;
    // this.speaker.close(false);
    // this.speaker = null;
    this.mixer.clearAudioBuffer();

    this.status = 'stopped';
    // save current position to playStartPosition
    this.playStartPosition = this.playStartTime
      ? (new Date().getTime() - this.playStartTime.getTime()) / 1000
      : 0;
    this.playStartTime = null;

    await waitForEvent(this.events, 'stopped');
    console.log('stopped');
  }

  setVolume(volume: number) {
    const parsed = z.number().max(100).min(0).parse(volume);
    this.mixer.volume = parsed;
  }
}

export const playbackManager = new PlaybackManager();
