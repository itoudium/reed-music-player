import { Album, Content } from '@prisma/client';

export type SearchAlbumResult = {
  sourceId: string;
  name: string;
  coverArtUrl?: string;
};

export interface IMetadataSource {
  searchAlbum(
    album: Album,
    contents: Content[]
  ): Promise<SearchAlbumResult | null>;
}
