<template>
  <q-page>
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
        <div class="col col-sm-6">
          <MusicCard
            type="playlist"
            :title="playlistsStore.state.defaultPlaylist?.name ?? ''"
            :sub-title="playlistsStore.state.defaultPlaylist?.description ?? ''"
          />
        </div>
      </div>
    </template>
    <div class="row q-my-md absolute-bottom justify-center">
      <div class="col">
        <div class="row justify-center q-mb-sm">
          currently playing...
        </div>
        <div class="row justify-center">
          <q-btn
            round
            flat
            class="q-mb-md"
            color="primary"
            icon="fast_rewind"
          />
          <q-btn
            round
            class="q-mb-md q-mx-md"
            color="primary"
            icon="play_arrow"
          />
          <q-btn
            round
            flat
            class="q-mb-md"
            color="primary"
            icon="fast_forward"
          />
        </div>
      </div>
    </div>
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
