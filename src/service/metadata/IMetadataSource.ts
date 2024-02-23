import { Album } from '@prisma/client';

export type SearchAlbumResult = {
  sourceId: string;
  name: string;
  coverArtUrl?: string;
  artists?: {
    name: string;
    id: string;
  }[];
};

export interface IMetadataSource {
  name: string;
  searchAlbum(album: Album): Promise<SearchAlbumResult | null>;
}
