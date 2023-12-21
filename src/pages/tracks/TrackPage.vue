<template>
  <div class="row">
    <div class="col">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle1 text-center">
          <q-btn
            color="primary"
            icon="queue_music"
            label="Add to playlist"
            @click="tracksStore.addTrackToDefaultPlaylist($route.params.id as string)"
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
        <q-item
          v-ripple
          clickable
          @click="playOrPause"
        >
          <q-item-section
            avatar
          >
            <div class="row">
              <div class="col">
                <q-avatar
                  square
                  class="q-mr-sm"
                >
                  <q-img :src="img" />
                </q-avatar>
              </div>
              <div class="col flex vertical-middle">
                <template v-if="!previewPlaying">
                  <q-btn
                    round
                    flat
                    icon="play_arrow"
                  />
                </template>
                <template v-else>
                  <q-btn
                    round
                    flat
                    icon="pause"
                  />
                </template>
              </div>
            </div>
            <!-- <q-spinner-audio
              color="primary"
              size="2em"
            /> -->
          </q-item-section>
          <q-item-section>
            {{ tracksStore.state.selectedTrack?.title ?? "&nbsp;" }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTracksStore } from 'src/stores/tracks'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const tracksStore = useTracksStore()
const userTrackAudio = new Audio()
const previewPlaying = ref(false)
const img = ref('')

function playOrPause () {
  if (previewPlaying.value) {
    pausePreview()
  } else {
    playPreview()
  }
}

function playPreview () {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.setPlaying(false)
  }

  previewPlaying.value = true
  userTrackAudio.play()
}

function pausePreview () {
  previewPlaying.value = false
  userTrackAudio.pause()
}

function buildTrackUrl (trackId: string): string {
  const token: string = LocalStorage.getItem('pc_token') ?? ''
  const API_URL = process.env.API_URL ?? ''

  return `${API_URL}/api/v1/stream/${trackId}?_token=${token}`
}

watch(
  () => musicPlayerStore.state.playing,
  (status) => {
    if (status) {
      pausePreview()
    }
  }
)
onMounted(async () => {
  if (!route.params.id) return
  await tracksStore.fetchTrack(route.params.id as string)
  if (!tracksStore.state.selectedTrack) return
  userTrackAudio.src = buildTrackUrl(tracksStore.state.selectedTrack.id)

  const mediaId = tracksStore.state.selectedTrack.metadata.pictures.cover_art_front ?? ''
  if (!mediaId) return

  img.value = await tracksStore.fetchTrackMedia(mediaId)
  console.log(img.value)
})
</script>

<style scoped>

</style>
