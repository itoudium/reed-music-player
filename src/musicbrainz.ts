import { MusicBrainzMetadataSource } from './service/metadata/musicBrainz/musicBrainz';
import { prisma } from './service/prisma';
import { getSeeker } from './service/seeker';
import { registerPictureByUrl } from './service/seeker/picture';

(async () => {
  const metadataSource = new MusicBrainzMetadataSource();
  const seeker = getSeeker();

  const albumsList = await seeker.listAlbums({});

  for (const album of albumsList.albums) {
    const { contents } = await seeker.listAlbumContents({ albumId: album.id });
    const searchResult = await metadataSource.searchAlbum(album, contents);
    console.log(searchResult);

    if (searchResult?.coverArtUrl) {
      const pic = await registerPictureByUrl(searchResult.coverArtUrl);

      // set picture to album
      await prisma.album.update({
        where: {
          id: album.id,
        },
        data: {
          pictureId: pic?.id,
        },
      });
    }
  }
})();
