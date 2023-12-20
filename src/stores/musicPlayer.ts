import { defineStore } from 'pinia'
import { IGetPlaylistTracks, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  const playing = ref(false)
  const showPlayer = ref(false)
  const playlistTracks = ref<IGetPlaylistTracks[] | null>(null)
  const currentIndex = ref(0)
  const reset = ref(false)

  const actions = {
    fetchPlaylistTracks: async (playlistId: string): Promise<IGetPlaylistTracks[] | null> => {
      const response = await api.getPlaylistTracks(playlistId)

      playlistTracks.value = response.data ?? null

      return playlistTracks.value
    },

    setPlaying (isPlaying: boolean) {
      playing.value = isPlaying
    },

    setShowPlayer (shouldShow: boolean) {
      showPlayer.value = shouldShow
    },

    setCurrentIndex (index: number) {
      currentIndex.value = index
    },

    reset () {
      reset.value = !reset.value
    }
  }

  return {
    state: reactive({
      playing,
      playlistTracks,
      showPlayer,
      currentIndex,
      reset
    }),
    ...actions
  }
})
