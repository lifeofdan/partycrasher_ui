import { defineStore } from 'pinia'
import { IGetMeData, api } from 'src/api/client'
import { reactive, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const me = ref<IGetMeData | null>(null)

  const actions = {
    async authenticate (loginToken: string, apiToken: string): Promise<IGetMeData | string> {
      localStorage.setItem('pc_token', apiToken)
      const response = (loginToken) ? await api.loginTokenAuth(loginToken) : await api.getMe()

      localStorage.setItem('pc_token', response.data?.api_token || apiToken)

      if (response.success) {
        me.value = response.data
      }

      return me.value || response.message
    },
    fetchMe: async (): Promise<IGetMeData | string> => {
      const response = await api.getMe()

      if (response.success) {
        me.value = response.data
      }

      return me.value || response.message
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
