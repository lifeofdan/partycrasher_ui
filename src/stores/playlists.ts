import { defineStore } from 'pinia'
import { IGetPlaylistsPaginated, IGetPlaylistsData, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const usePlaylistsStore = defineStore('playlists', () => {
  const defaultPlaylist = ref<IGetPlaylistsData | null>(null)

  const actions = {
    fetchPlaylistsDefault: async (): Promise<IGetPlaylistsData | null> => {
      const response = await api.getPlaylistsDefault()

      defaultPlaylist.value = response.data ?? null
      return defaultPlaylist.value
    },

    fetchPlaylists: async (): Promise<IGetPlaylistsPaginated | null> => {
      const response = await api.getPlaylists()

      return response ?? null
    }
  }

  return {
    state: reactive({
      defaultPlaylist
    }),
    ...actions
  }
})
