import { defineStore } from 'pinia'
import { AlbumEntity, makeAlbumClient } from 'src/api/entity_api/album'
import { TrackEntity } from 'src/api/entity_api/track'
import { reactive, ref } from 'vue'

export const useAlbumsStore = defineStore('albums', () => {
  const albumClient = makeAlbumClient()
  const album = ref<AlbumEntity | null>(null)
  const tracks = ref<TrackEntity[]>([])

  const actions = {
    async fetchAlbum (albumId: string) {
      const response = await albumClient.byId(albumId)

      if (response.success && response.data !== null) {
        album.value = response.data
      }

      return album.value
    },

    async fetchTracks (albumId: string): Promise<TrackEntity[]> {
      const response = await albumClient.tracks(albumId)

      if (response.data !== null && response.success) {
        tracks.value = response.data
      }

      return tracks.value
    }
  }

  return {
    state: reactive({
      tracks
    }),
    ...actions
  }
})
