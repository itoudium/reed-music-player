import audioDecode from 'audio-decode';
import fs from "fs/promises"
import Speaker from "speaker"
import PCM from "pcm-util"
import audioBufferUtils from "audio-buffer-utils"
import EventEmitter from 'events';
import { waitForEvent } from '../../utils/events';

const filepath = "/Users/110d/Music/Music/Media/Music/Chet Baker/Chet Baker/02 A Little Duet For Zoot And Chet.mp3";


type StatusType = "idle" | "playing" | "pause"
type JobType = {
  action: "play",
  file: string;
  position?: number;
} | {
  action: "stop",
}

class PlaybackManager {

  status: StatusType = "idle";
  running = false;
  queue: (JobType)[] = [];
  events = new EventEmitter();
  speaker: Speaker | null = null;

  constructor() {
    this.events.on("added", () => {
      this.processQueue();
    })
  }

  async processQueue() {
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      try {
        this.running = true;
        switch (task?.action) {
          case "play":
            await this._play(task);
            break;
          case "stop":
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
    this.queue.push(job)
    this.events.emit("added");
  }

  play() {
    this.addJob({
      action: "play",
      file: filepath
    })
  }

  stop() {
    this.addJob({
      action: "stop"
    })

    this.events.on
  }


  private async _play(job: JobType & { action: "play" }) {
    if (this.speaker) {
      this.speaker.close(false);
    }
    const buffer = await fs.readFile(job.file);
    const _audioBuffer = await audioDecode(buffer);
    console.log("length:", _audioBuffer.length);
    console.log("duration:", _audioBuffer.duration);
    const positionProgress = job.position ?? 0 / _audioBuffer.duration;
    const positionBytes = _audioBuffer.length * positionProgress;
    console.log("position: ", positionProgress, positionBytes);

    const audioBuffer = audioBufferUtils.slice(_audioBuffer, positionBytes);
    const speaker = this.speaker = new Speaker({
      channels: 2,
      bitDepth: 16,
      sampleRate: 44100,
    });

    const arrayBuffer = PCM.toArrayBuffer(audioBuffer);
    speaker.write(Buffer.from(arrayBuffer), (err) => {
      this.events.emit("stopped");
    });
  }

  private async _stop(_: JobType & { action: "stop" }) {
    if (!this.speaker) return;

    this.speaker.close(false);
    this.speaker = null;
    await waitForEvent(this.events, "stopped");
    console.log("stopped");
  }
}

export const playbackManager = new PlaybackManager();
