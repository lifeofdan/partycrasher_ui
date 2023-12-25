<template>
  <q-layout
    view="lHh lpr lFf"
    container
    class="shadow-2 rounded-borders"
    style="min-height: -webkit-fill-available; min-height: 100vh;"
  >
    <q-header
      class="bg-white text-primary"
    >
      <q-toolbar>
        <template v-if="route.meta.child">
          <q-btn
            round
            flat
            icon="arrow_back_ios"
            :to="$router.options.history.state.back"
          />
        </template>
        <q-toolbar-title>
          {{ pageTitle }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-footer class="bg-transparent">
      <MusicPlayer />
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey-8 bg-grey-3 text-primary"
        :style="!musicPlayerStore.state.showPlayer ? 'border-top: 1px solid rgba(0, 0, 0, 0.12)' : ''"
      >
        <q-route-tab
          v-if="me?.role === 'admin'"
          :to="{name: 'app.playlists'}"
          label="Playlists"
          icon="play_circle"
        />
        <q-route-tab
          v-if="me?.role === 'admin' || me?.role === 'user'"
          :to="{name:'app.tracks'}"
          label="Tracks"
          icon="queue_music"
        />
        <q-route-tab
          v-if="me?.role === 'admin' || me?.role === 'user'"
          :to="{name:'app.search'}"
          label="Search"
          icon="search"
        />
        <q-route-tab
          :to="{name: 'app.profile'}"
          label="Profile"
          icon="account_circle"
        />
      </q-tabs>
    </q-footer>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
    >
      <EssentialLink
        title="Login"
        caption="Change user token"
        :to="{name: 'login'}"
      />
      <EssentialLink
        v-if="me?.role === 'admin'"
        title="Playlists"
        caption="Choose a playlist"
        :to="{name: 'app.playlists'}"
      />
      <EssentialLink
        v-if="me?.role === 'admin' || me?.role === 'user'"
        title="Tracks"
        caption="Add tracks to play"
        :to="{name: 'app.tracks'}"
      />
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts" setup>
import EssentialLink from 'src/components/EssentialLink.vue'
import { ref, watch, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/auth'
import { IGetMeData } from 'src/api/client'
import { useRoute } from 'vue-router'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import MusicPlayer from 'src/components/MusicPlayer.vue'

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const leftDrawerOpen = ref(false)
const authStore = useAuthStore()
const me = ref<IGetMeData | null>(null)
const pageTitle = ref(route.meta.title as string)

// Commented out to prevent warning. We will need this later for the desktop / large screen view
// function toggleLeftDrawer () {
//   leftDrawerOpen.value = !leftDrawerOpen.value
// }

watch(
  () => authStore.state.me,
  (newMe) => {
    me.value = newMe
  },
  { deep: true }
)

watch(
  () => route.name,
  () => {
    pageTitle.value = route.meta.title as string
  }
)

onMounted(() => {
  me.value = authStore.state.me
})

</script>
