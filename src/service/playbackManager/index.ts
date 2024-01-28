import audioDecode from 'audio-decode';
import fs from "fs/promises"
import Speaker from "speaker"
import PCM from "pcm-util"
import audioBufferUtils from "audio-buffer-utils"
import EventEmitter from 'events';
import { waitForEvent } from '../../utils/events';
import { PlaybackInfoType } from '../../../types/AppStateType';

const filepath = "/Users/110d/Music/Music/Media/Music/Chet Baker/Chet Baker/02 A Little Duet For Zoot And Chet.mp3";


type JobType = {
  action: "play",
  file: string;
  position?: number;
} | {
  action: "stop",
}

class PlaybackManager {

  status: PlaybackInfoType["status"] = "stopped";
  running = false;
  queue: (JobType)[] = [];
  events = new EventEmitter();
  speaker: Speaker | null = null;
  playStartPosition: number = 0;
  playStartTime: Date | null = null;
  duration: number = 0;

  constructor() {
    this.events.on("added", () => {
      this.processQueue();
    })

    // broadcast playback status
    setInterval(() => {
      this.events.emit("updateState", {
        status: this.status,
        position: this.playStartPosition + (this.playStartTime ? (new Date().getTime() - this.playStartTime.getTime()) / 1000 : 0),
        duration: this.duration,
      } as PlaybackInfoType)
    }, 1_000);
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

    this.playStartTime = new Date();
    this.playStartPosition = job.position ?? 0;
    this.duration = _audioBuffer.duration;
    this.status = "playing";

    speaker.write(Buffer.from(arrayBuffer), (err) => {
      this.events.emit("stopped");
    });
  }

  private async _stop(_: JobType & { action: "stop" }) {
    if (!this.speaker) return;

    this.speaker.close(false);
    this.speaker = null;
    this.status = "stopped";
    // save current position to playStartPosition
    this.playStartPosition = this.playStartTime ? (new Date().getTime() - this.playStartTime.getTime()) / 1000 : 0;
    this.playStartTime = null;

    await waitForEvent(this.events, "stopped");
    console.log("stopped");
  }
}

export const playbackManager = new PlaybackManager();
