<template>
  <div class="row">
    <div class="col">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle1 text-center">
          <q-btn
            color="primary"
            round
            icon="play_arrow"
            @click="showAndPlay"
          />
        </div>
      </q-img>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-list
        bordered
        separator
      >
        <template
          v-for="(track, index) in musicPlayerStore.state.playlistTracks"
          :key="track.id"
        >
          <q-item
            v-ripple
            clickable
            @click="setIndexAndPlay(index)"
          >
            <q-item-section avatar>
              <q-spinner-audio
                v-if="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing"
                color="primary"
                size="2em"
              />
            </q-item-section>
            <q-item-section>
              {{ track.title }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IGetPlaylistsData } from 'src/api/client'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { usePlaylistsStore } from 'src/stores/playlists'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const playlistsStore = usePlaylistsStore()
const currentPlaylist = ref<IGetPlaylistsData | null>(null)

function showAndPlay () {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.reset()
    return
  }
  musicPlayerStore.setShowPlayer(true)
  musicPlayerStore.setPlaying(true)
}

function setIndexAndPlay (index: number) {
  musicPlayerStore.setCurrentIndex(index)
  musicPlayerStore.initTrackSrc()
}

onMounted(async () => {
  currentPlaylist.value = await playlistsStore.fetchPlaylist(route.params.id as string)

  if (!currentPlaylist.value) return
  musicPlayerStore.fetchPlaylistTracks(currentPlaylist.value.id)
})
</script>

<style scoped>

</style>
