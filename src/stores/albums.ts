import { defineStore } from 'pinia'
import { makeAlbumClient } from 'src/api/entity_api/album'
import { TrackEntity } from 'src/api/entity_api/track'
import { reactive, ref } from 'vue'

export const useAlbumsStore = defineStore('albums', () => {
  const albumClient = makeAlbumClient()

  const tracks = ref<TrackEntity[]>([])

  const actions = {
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
