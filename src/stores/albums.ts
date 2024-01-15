import { defineStore } from 'pinia'
import { AlbumEntity, makeAlbumClient } from 'src/api/entity_api/album'
import { makeMediaClient } from 'src/api/entity_api/media'
import { TrackEntity } from 'src/api/entity_api/track'
import { reactive, ref } from 'vue'

export const useAlbumsStore = defineStore('albums', () => {
  const albumClient = makeAlbumClient()
  const mediaClient = makeMediaClient()

  const tracks = ref<TrackEntity[]>([])

  const actions = {
    async fetchTracks (albumId: string): Promise<TrackEntity[]> {
      const response = await albumClient.tracks(albumId)

      if (response.data !== null && response.success) {
        tracks.value = response.data
      }

      return tracks.value
    },
    coverArt (album: AlbumEntity): string {
      const art = album.metadata.pictures?.cover_art_front
      return (art !== null) ? mediaClient.byId(art as string) : '/album.jpeg'
    }
  }

  return {
    state: reactive({
      tracks
    }),
    ...actions
  }
})
