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
          v-for="(track, index) in tracksWithImages"
          :key="track.id"
        >
          <q-item
            v-ripple
            clickable
          >
            <q-item-section avatar>
              <div class="row">
                <div
                  class="col"
                  style="min-width: 40px"
                >
                  <q-img :src="track.src">
                    <q-spinner-audio
                      v-show="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing"
                      color="primary"
                      size="2em"
                    />
                  </q-img>
                </div>
                <div class="col">
                  <template v-if="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing">
                    <q-btn
                      round
                      flat
                      icon="replay"
                      @click="setIndexAndPlay(index)"
                    />
                  </template>
                  <template v-else>
                    <q-btn
                      round
                      flat
                      icon="play_arrow"
                      @click="setIndexAndPlay(index)"
                    />
                  </template>
                </div>
              </div>
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
import { IGetPlaylistTrack, IGetPlaylistsData } from 'src/api/client'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { usePlaylistsStore } from 'src/stores/playlists'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface ITrackWithImgSrc extends IGetPlaylistTrack {
  src?: string
}

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const playlistsStore = usePlaylistsStore()
const currentPlaylist = ref<IGetPlaylistsData | null>(null)
const tracksWithImages = ref<ITrackWithImgSrc[]>([])

function showAndPlay () {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.reset()
    return
  }
  musicPlayerStore.setShowPlayer(true)
  musicPlayerStore.setPlaying(true)
}

function setIndexAndPlay (index: number) {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.setPlaying(false)
  }
  musicPlayerStore.setCurrentIndex(index)
  musicPlayerStore.initTrackSrc()
}

onMounted(async () => {
  if (playlistsStore.state.playlistTracks?.length) return
  currentPlaylist.value = await playlistsStore.fetchPlaylist(route.params.id as string)

  if (!currentPlaylist.value) return
  await musicPlayerStore.fetchPlaylistTracks(currentPlaylist.value.id)

  if (!musicPlayerStore.state.playlistTracks) return
  tracksWithImages.value = []

  for (const [index, track] of musicPlayerStore.state.playlistTracks.entries()) {
    tracksWithImages.value.push({ ...track, src: await musicPlayerStore.getTrackPicture(index) })
  }
})
</script>

<style scoped>

</style>
