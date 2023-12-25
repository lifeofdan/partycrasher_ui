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
import { ref, onMounted, watch } from 'vue'
import MusicCard from 'src/components/MusicCard.vue'
import { usePlaylistsStore } from 'src/stores/playlists'
import { useRoute } from 'vue-router'

const route = useRoute()
const playlistsStore = usePlaylistsStore()
const searchText = ref('')

watch(
  () => route.name,
  async (name) => {
    if (name && name === 'app.playlists' && !playlistsStore.state.defaultPlaylist) {
      await playlistsStore.fetchPlaylistsDefault()
    }
  }
)
onMounted(async () => {
  // We do this because we don't want to fetch all playlists when we are loading the playlist sub-page
  if (route.name === 'app.playlists' && !playlistsStore.state.defaultPlaylist) {
    await playlistsStore.fetchPlaylistsDefault()
  }
})
</script>

<style scoped>

</style>
