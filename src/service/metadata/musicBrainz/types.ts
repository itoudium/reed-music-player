export type mb_ReleaseType = {
  id: string;
  title: string;
  'artist-credit': {
    name: string;
    artist: {
      id: string;
      name: string;
      'sort-name': string;
    };
  }[];
  date: string;
  country: string;
  'track-count': number;
};

export type mb_SearchReleaseResultType = {
  count: number;
  offset: number;
  releases: mb_ReleaseType[];
};

export type mb_ReleaseImageType = {
  image: string;
  types: 'Front' | 'Booklet' | 'Back' | 'Medium';
};

export type mb_ReleaseImageResultType = {
  images: mb_ReleaseImageType[];
};
