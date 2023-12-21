<template>
  <div class="row">
    <div class="col">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle1 text-center">
          <q-btn
            color="primary"
            icon="queue_music"
            label="Add to playlist"
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
          <q-item-section avatar>
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
            <!-- <q-spinner-audio
              color="primary"
              size="2em"
            /> -->
          </q-item-section>
          <q-item-section>
            {{ queueStore.state.selectedTrack?.title ?? "&nbsp;" }}
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQueueStore } from 'src/stores/queue'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const queueStore = useQueueStore()
const userTrackAudio = new Audio()
const previewPlaying = ref(false)

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

onMounted(async () => {
  if (!route.params.id) return
  await queueStore.fetchTrack(route.params.id as string)
  if (!queueStore.state.selectedTrack) return
  userTrackAudio.src = buildTrackUrl(queueStore.state.selectedTrack.id)
})
</script>

<style scoped>

</style>
