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

    imageOrFallback (track: IGetTrackData): string {
      const art = track.metadata.pictures.cover_art_front
      if (art !== null) {
        return mediaClient.byId(art as string)
      } else {
        return '/album.jpeg'
      }
    },

    async fetchTrack (id: string): Promise<TrackEntity | null> {
      const response = await trackClient.byId(id)

      selectedTrack.value = response.data

      return selectedTrack.value
    },

    fetchTrackMedia (mediaId: string): string {
      return mediaClient.byId(mediaId)
    },

    async addTrackToDefaultPlaylist (trackId: string) {
      const response = await playlistClient.byDefault()
      if (!response.success || response.data === null) return

      await playlistClient.addTracks([{ track_id: trackId, playlist_id: response.data.id }])
    },

    async addTracksToDefaultPlaylist (trackIds: string[]) {
      const response = await playlistClient.byDefault()
      if (!response.success || response.data === null) return
      const defaultPlaylistId = response.data.id

      const tracks: Array<{ track_id: string, playlist_id: string }> = []

      trackIds.forEach((id) => {
        tracks.push({ track_id: id, playlist_id: defaultPlaylistId })
      })
      await playlistClient.addTracks(tracks)
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
