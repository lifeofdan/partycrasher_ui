import { defineStore } from 'pinia'
import { IGetMeData, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const me = ref<IGetMeData | null>(null)

  const actions = {
    fetchMe: async (): Promise<IGetMeData | null> => {
      const response = await api.getMe()

      me.value = response.data ?? null

      return me.value
    },

    clearMe: () => {
      me.value = null
    }
  }

  return {
    state: reactive({
      me
    }),
    ...actions
  }
})
