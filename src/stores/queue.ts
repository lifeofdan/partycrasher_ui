import { defineStore } from 'pinia'
import { IGetTrackData, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const useQueueStore = defineStore('queue', () => {
  const tracks = ref<IGetTrackData[]>([])

  const actions = {
    fetchTracks: async (): Promise<IGetTrackData[]> => {
      const response = await api.getTracks()

      tracks.value = response.page
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
