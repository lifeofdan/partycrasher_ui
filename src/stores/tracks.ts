import { defineStore } from 'pinia'
import { IGetTrackData, api } from 'src/api/client'
import { reactive, ref } from 'vue'
import { TrackEntity, makeTrackClient } from 'src/api/entity_api/track'
import { makeMediaClient } from 'src/api/entity_api/media'
import { makePlaylistClient } from 'src/api/entity_api/playlist'

export const useTracksStore = defineStore('tracks', () => {
  const tracks = ref<IGetTrackData[]>([])
  const selectedTrack = ref<TrackEntity | null>(null)
  const trackClient = makeTrackClient()
  const mediaClient = makeMediaClient()
  const playlistClient = makePlaylistClient()

  const actions = {
    fetchTracks: async (): Promise<IGetTrackData[]> => {
      const response = await api.getTracks()

      tracks.value = response.page
      return tracks.value
    },

    async fetchTrack (id: string): Promise<TrackEntity | null> {
      const response = await trackClient.byId(id)

      selectedTrack.value = response.data

      return selectedTrack.value
    },

    async fetchTrackMedia (mediaId: string) {
      return await mediaClient.byId(mediaId)
    },

    async addTrackToDefaultPlaylist (trackId: string) {
      const response = await playlistClient.byDefault()
      if (!response.success || response.data === null) return

      await playlistClient.addTracks([{ track_id: trackId, playlist_id: response.data.id }])
    }
  }

  return {
    state: reactive({
      tracks,
      selectedTrack
    }),
    ...actions
  }
})
