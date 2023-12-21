import { defineStore } from 'pinia'
import { IGetPlaylistTrack, api } from 'src/api/client'
import { reactive, ref, watch } from 'vue'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  const playing = ref(false)
  const showPlayer = ref(false)
  const playlistTracks = ref<IGetPlaylistTrack[] | null>(null)
  const currentIndex = ref(0)
  const reset = ref(false)
  const init = ref(false)
  const canNext = ref(false)
  const canPrevious = ref(false)

  const actions = {
    fetchPlaylistTracks: async (playlistId: string): Promise<IGetPlaylistTrack[] | null> => {
      const response = await api.getPlaylistTracks(playlistId)

      playlistTracks.value = response.data ?? null

      return playlistTracks.value
    },

    setPlaylist (tracks: IGetPlaylistTrack[]) {
      playlistTracks.value = tracks
    },

    clearPlaylist () {
      playlistTracks.value = null
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
    },

    initTrackSrc () {
      init.value = !init.value
    }
  }

  watch(
    () => playlistTracks.value,
    (tracks) => {
      if (tracks !== null && tracks.length > 1) {
        canNext.value = true
      }
    }
  )

  watch(
    () => currentIndex.value,
    (index) => {
      if (playlistTracks.value === null) return
      if (index === (playlistTracks.value.length - 1)) {
        canNext.value = false
      } else {
        canNext.value = true
      }

      if (index === 0) {
        canPrevious.value = false
      } else {
        canPrevious.value = true
      }
    }
  )

  return {
    state: reactive({
      playing,
      playlistTracks,
      showPlayer,
      currentIndex,
      reset,
      init,
      canNext,
      canPrevious
    }),
    ...actions
  }
})
