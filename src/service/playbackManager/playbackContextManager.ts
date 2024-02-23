import { Content } from '@prisma/client';
import { prisma } from '../prisma';
import { PlaybackContext } from '../../../types/AppStateType';

export class PlaybackContextManager {
  private _context: PlaybackContext;
  private _rawContents: Content[] = [];
  private _contents: Content[] = [];
  private currentTrackIndex: number | null = 0;
  private repeat: 'none' | 'one' | 'all' = 'all';

  private waitUntilLoadedPromise: Promise<void>;

  constructor(
    context: PlaybackContext,
    params: {
      shuffle: boolean;
      repeat: 'none' | 'one' | 'all';
      contentId?: string;
    }
  ) {
    this._context = context;
    this.waitUntilLoadedPromise = this.loadContents().then(() => {
      this.setShuffle(params.shuffle);
      this.setRepeat(params.repeat);
      this.setCurrentContent(params.contentId);
    });
  }

  private async loadContents() {
    // load contents from context
    if (this._context.albumId) {
      // load album contents
      this._rawContents = await prisma.content.findMany({
        where: {
          albumId: this._context.albumId,
        },
        orderBy: {
          trackNumber: 'asc',
        },
      });
    } else if (this._context.artistId) {
      this._rawContents = await prisma.content.findMany({
        where: {
          artists: {
            some: {
              artistId: this._context.artistId,
            },
          },
        },
      });
    } else {
      // load all contents
      this._rawContents = await prisma.content.findMany();
    }
    this._contents = this._rawContents;
  }

  public async waitUntilLoaded() {
    return this.waitUntilLoadedPromise;
  }

  public next() {
    if (this.repeat === 'one' || this.repeat === 'none') {
      return;
    }
    if (
      this.repeat === 'all' &&
      this.currentTrackIndex === this._contents.length - 1
    ) {
      this.currentTrackIndex = 0;
      return;
    }

    if (this.currentTrackIndex === null) {
      this.currentTrackIndex = 0;
      return;
    }

    this.currentTrackIndex =
      ((this.currentTrackIndex ?? 0) + 1) % this._rawContents.length;
  }

  public prev() {
    if (this.repeat === 'one' || this.repeat === 'none') {
      return;
    }
    if (this.repeat === 'all' && this.currentTrackIndex === 0) {
      this.currentTrackIndex = this._contents.length - 1;
      return;
    }

    if (this.currentTrackIndex === null) {
      this.currentTrackIndex = 0;
      return;
    }

    this.currentTrackIndex =
      ((this.currentTrackIndex ?? 0) - 1 + this._rawContents.length) %
      this._rawContents.length;
  }

  public setShuffle(shuffle: boolean) {
    if (shuffle) {
      this.shuffleContents();
    } else {
      this._contents = this._rawContents;
    }
  }

  public setRepeat(repeat: 'none' | 'one' | 'all') {
    this.repeat = repeat;
  }

  private shuffleContents() {
    this._contents = [...this._rawContents].sort(() => Math.random() - 0.5);
  }

  public get currentContent() {
    console.log(
      'content ids',
      this._contents.map((content) => content.id)
    );
    // if index is not number, return null
    if (typeof this.currentTrackIndex !== 'number') {
      return null;
    }
    return this._contents[this.currentTrackIndex];
  }

  public setCurrentContent(contentId?: string) {
    if (!contentId) {
      this.currentTrackIndex = 0;
      return;
    }
    this.currentTrackIndex = this._contents.findIndex(
      (content) => content.id === contentId
    );
  }
}
