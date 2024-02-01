import { Readable } from 'stream';
import { EventEmitter } from 'events';

export class Mixer extends Readable {
  volume: number = 100;
  channels: number;
  sampleRate: number;
  bitDepth: number;
  buffer: Buffer | null = null;
  currentSamples = 0;
  events: EventEmitter = new EventEmitter();

  constructor({
    channels,
    sampleRate,
    bitDepth,
  }: {
    channels: number;
    sampleRate: number;
    bitDepth: number;
  }) {
    super();
    this.channels = channels;
    this.sampleRate = sampleRate;
    this.bitDepth = bitDepth;
  }

  /** return current playback position by seconds */
  get position() {
    return this.currentSamples / this.sampleRate;
  }

  get isPlaying() {
    return !!this.buffer;
  }

  putAudioBuffer(buffer: Buffer, startPosition: number) {
    this.buffer = buffer;
    this.currentSamples = (startPosition * this.sampleRate) | 0;
  }

  clearAudioBuffer() {
    this.buffer = null;
  }

  private onFinished() {
    this.currentSamples = 0;
    this.clearAudioBuffer();
    this.events.emit('finished');
  }

  _read(size: number) {
    const sampleSize = this.bitDepth / 8;
    const blockAlign = sampleSize * this.channels;
    const numSamples = (size / blockAlign) | 0;
    const buf = Buffer.alloc(numSamples * blockAlign);

    if (!this.buffer || this.buffer.length === 0) {
      // write empty buffer
      this.push(buf);
      return;
    }

    for (let i = 0; i < numSamples; i++) {
      for (let channel = 0; channel < this.channels; channel++) {
        const offset = i * sampleSize * this.channels + channel * sampleSize;
        const sourceOffset =
          this.currentSamples * sampleSize * this.channels + offset;

        // if source offset is out of range, write 0 (skip)
        if (sourceOffset >= this.buffer.length) {
          this.push(buf);
          this.onFinished();
          return;
        }

        const val =
          (this.buffer.readInt16LE(sourceOffset) * (this.volume / 100)) | 0;

        if (this.bitDepth === 16) {
          buf.writeInt16LE(val, offset);
        } else if (this.bitDepth === 32) {
          buf.writeInt32LE(val, offset);
        } else {
          throw new Error('unsupported bitDepth');
        }
      }
    }

    this.push(buf);
    this.currentSamples += numSamples;
  }
}
