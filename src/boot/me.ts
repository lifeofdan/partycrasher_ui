import { boot } from 'quasar/wrappers'
import { useAuthStore } from 'src/stores/auth'

export default boot(({ router }) => {
  router.beforeEach(async (to, _from, next) => {
    if (localStorage.getItem('pc_token') !== null) {
      const authStore = useAuthStore()

      if (authStore.state.me === null) {
        const response = await authStore.fetchMe()
        if (typeof response === 'string') {
          // this means we have something in localstorage that is not valid we
          // need to clear localstorage and allow the user to log back in

          localStorage.clear()
        }
      }

      return (to.name === 'login') ? next('/') : next()
    }
    return (to.name === 'login') ? next() : next('/login')
  })
})
