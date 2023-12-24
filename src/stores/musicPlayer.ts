import { defineStore } from 'pinia'
import { IGetPlaylistTrack, api } from 'src/api/client'
import { reactive, ref, watch } from 'vue'
import { useTracksStore } from './tracks'

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  const trackStore = useTracksStore()
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

    setPlaylistTracks (tracks: IGetPlaylistTrack[]) {
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
    },

    async getTrackPicture (index: number): Promise<string> {
      if (playlistTracks.value === null) return ''
      const tracks = playlistTracks.value[index]

      if (tracks === undefined) return ''
      const pictures = tracks.metadata.pictures
      if (pictures === undefined) return ''
      const art = tracks.metadata.pictures.cover_art_front

      if (art === undefined) return ''
      return await trackStore.fetchTrackMedia(art ?? '')
    }
  }

  function doLengthChecks (): void {
    if (playlistTracks.value !== null && playlistTracks.value.length > 0) {
      if (playlistTracks.value.length > 1) {
        canNext.value = true
      } else {
        canNext.value = false
      }
    }
  }

  watch(
    () => playlistTracks.value?.length,
    () => {
      doLengthChecks()
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
