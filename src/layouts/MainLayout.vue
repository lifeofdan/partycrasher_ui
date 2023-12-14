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
        link="/"
      />
      <EssentialLink
        title="Playlists"
        caption="Choose a playlist"
        link="/playlists"
      />
      <EssentialLink
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
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
