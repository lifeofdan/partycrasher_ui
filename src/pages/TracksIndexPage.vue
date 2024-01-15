<template>
  <div class="row items-center justify-evenly q-my-md">
    <div class="col q-mx-md">
      <q-input
        v-model="searchText"
        outlined
        label="search"
      />
    </div>
  </div>
  <div class="row items-center content-between">
    <template
      v-for="track in tracksStore.state.tracks"
      :key="track.id"
    >
      <MusicCard
        style="min-width: 320px; max-width: 320px;"
        :title="track.title"
        :sub-title="track.metadata.artist || '&nbsp;'"
        :track="track"
        :img="tracksStore.imageOrFallback(track)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MusicCard from 'src/components/MusicCard.vue'
import { useTracksStore } from 'src/stores/tracks'

const searchText = ref('')
const tracksStore = useTracksStore()

  ; (async () => {
  await tracksStore.fetchTracks()
})()
</script>
