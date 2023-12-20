<template>
  <q-page>
    <template v-if="$route.name === 'app.playlists'">
      <div class="row items-center justify-evenly q-my-md">
        <div class="col q-mx-md">
          <q-input
            v-model="searchText"
            outlined
            label="search"
          />
        </div>
      </div>
      <template v-if="playlistsStore.state.defaultPlaylist">
        <div class="row items-center content-between">
          <MusicCard
            :playlist="playlistsStore.state.defaultPlaylist"
            style="min-width: 160px; max-width: 320px"
            :title="playlistsStore.state.defaultPlaylist?.name ?? ''"
            :sub-title="playlistsStore.state.defaultPlaylist?.description ?? ''"
          />
        </div>
      </template>
    </template>
    <RouterView />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import MusicCard from 'src/components/MusicCard.vue'
import { usePlaylistsStore } from 'src/stores/playlists'

const playlistsStore = usePlaylistsStore()
const searchText = ref('')

onMounted(async () => {
  await playlistsStore.fetchPlaylistsDefault()
})
</script>

<style scoped>

</style>
