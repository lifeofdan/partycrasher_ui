import { defineStore } from 'pinia'
import { IResponsePaginated, IGetPlaylistsData, api, IGetPlaylistTrack } from 'src/api/client'
import { reactive, ref } from 'vue'
import { makePlaylistClient } from 'src/api/entity_api/playlist'
import { useMusicPlayerStore } from './musicPlayer'
import { useTracksStore } from './tracks'
import { TrackEntity } from 'src/api/entity_api/track'

export const usePlaylistsStore = defineStore('playlists', () => {
  const tracksStore = useTracksStore()
  const defaultPlaylist = ref<IGetPlaylistsData | null>(null)
  const playlistTracks = ref<IGetPlaylistTrack[] | null>(null)
  const playlistClient = makePlaylistClient()

  const actions = {
    fetchPlaylistsDefault: async (): Promise<IGetPlaylistsData | null> => {
      const response = await api.getPlaylistsDefault()

      defaultPlaylist.value = response.data ?? null
      return defaultPlaylist.value
    },

    fetchPlaylists: async (): Promise<IResponsePaginated<IGetPlaylistsData> | null> => {
      const response = await api.getPlaylists()

      return response ?? null
    },

    fetchPlaylist: async (playlistId: string): Promise<IGetPlaylistsData | null> => {
      const response = await api.getPlaylist(playlistId)

      return response.data ?? null
    },

    fetchPlaylistTracks: async (playlistId: string): Promise<IGetPlaylistTrack[] | null> => {
      const response = await api.getPlaylistTracks(playlistId)

      playlistTracks.value = response.data ?? null

      return playlistTracks.value
    },

    async removeFromPlaylist (trackId: string, playlistId: string) {
      const payload = await playlistClient.removeTracks([{ track_id: trackId, playlist_id: playlistId }])
      if (payload.data === null) return
      playlistTracks.value = payload.data as IGetPlaylistTrack[]
      useMusicPlayerStore().setPlaylistTracks(playlistTracks.value)
    },

    getTrackPicture (track: TrackEntity): string {
      const art = track.metadata.pictures.cover_art_front
      return (art) ? tracksStore.fetchTrackMedia(art) : '/album.jpeg'
    }
  }

  return {
    state: reactive({
      defaultPlaylist,
      playlistTracks
    }),
    ...actions
  }
})
