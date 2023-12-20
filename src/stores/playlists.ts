import { defineStore } from 'pinia'
import { IResponsePaginated, IGetPlaylistsData, api, IGetPlaylistTracks } from 'src/api/client'
import { reactive, ref } from 'vue'

export const usePlaylistsStore = defineStore('playlists', () => {
  const defaultPlaylist = ref<IGetPlaylistsData | null>(null)
  const playlistTracks = ref<IGetPlaylistTracks[] | null>(null)

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

    fetchPlaylistTracks: async (playlistId: string): Promise<IGetPlaylistTracks[] | null> => {
      const response = await api.getPlaylistTracks(playlistId)

      playlistTracks.value = response.data ?? null

      return playlistTracks.value
    },

    removePlayedSongFromPlaylist () {
      playlistTracks.value?.shift()
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
