import { Readable } from 'stream';

export class Mixer extends Readable {
  volume: number = 100;
  channels: number;
  sampleRate: number;
  bitDepth: number;

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

  buffer = Buffer.alloc(0);
  offset = 0;

  putAudioBuffer(buffer: Buffer, offset: number) {
    this.buffer = buffer;
    this.offset = offset;
    this.currentSamples = 0;
  }

  clearAudioBuffer() {
    this.buffer = Buffer.alloc(0);
    this.offset = 0;
    this.currentSamples = 0;
  }

  currentSamples = 0;

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
    console.log(
      'currentSamples:',
      this.currentSamples,
      'time:',
      this.currentSamples / this.sampleRate
    );
  }
}
