import { defineStore } from 'pinia'
import { IGetTrackData, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const useQueueStore = defineStore('queue', () => {
  const tracks = ref<IGetTrackData[]>([])
  const selectedTrack = ref<IGetTrackData | null>(null)

  const actions = {
    fetchTracks: async (): Promise<IGetTrackData[]> => {
      const response = await api.getTracks()

      tracks.value = response.page
      return tracks.value
    },

    async fetchTrack (id: string) {
      const response = await api.getTrack(id)

      selectedTrack.value = response.data ?? null
      return selectedTrack.value
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
