<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-primary text-white">
      <q-toolbar>
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title> party crasher </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      behavior="mobile"
    >
      <EssentialLink
        title="Login"
        caption="Change user token"
        link="/login"
      />
      <EssentialLink
        v-if="me?.role === 'admin'"
        title="Playlists"
        caption="Choose a playlist"
        link="/playlists"
      />
      <EssentialLink
        v-if="me?.role === 'admin' || me?.role === 'user'"
        title="Queue"
        caption="Add tracks to play"
        link="/queue"
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

const leftDrawerOpen = ref(false)
const authStore = useAuthStore()
const me = ref<IGetMeData | null>(null)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

watch(
  () => authStore.state.me,
  (newMe) => {
    console.log('this changed')
    me.value = newMe
  },
  { deep: true }
)

onMounted(() => {
  me.value = authStore.state.me
})

</script>
