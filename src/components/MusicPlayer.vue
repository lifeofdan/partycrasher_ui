<template>
  <div
    class="row bg-white text-dark"
    style="border-top: 1px solid rgba(0, 0, 0, 0.12); border-bottom: 1px solid rgba(0, 0, 0, 0.12);"
  >
    <div class="col-6 q-my-sm">
      <template v-if="musicPlayerStore.state.playlistTracks">
        <div class="q-ml-sm">
          <template v-if="coverImageUrl">
            <q-avatar
              square
              class="q-mr-sm"
            >
              <img :src="coverImageUrl">
            </q-avatar>
          </template>
          <template v-else>
            <q-avatar
              square
              class="q-mr-sm"
              icon="music_note"
            />
          </template>
          {{ musicPlayerStore.state.playlistTracks[musicPlayerStore.state.currentIndex]?.title }}
        </div>
      </template>
    </div>
    <div class="col-6 justify-end flex vertical-middle">
      <q-btn
        round
        flat
        color="primary"
        :disable="!musicPlayerStore.state.canPrevious"
        icon="fast_rewind"
        @click="previous"
      />
      <template v-if="!musicPlayerStore.state.playing">
        <q-btn
          round
          flat
          color="primary"
          icon="play_arrow"
          @click="play"
        />
      </template>
      <template v-if="musicPlayerStore.state.playing">
        <q-btn
          round
          flat
          color="primary"
          icon="pause"
          @click="pause"
        />
      </template>
      <q-btn
        round
        flat
        :disable="!musicPlayerStore.state.canNext"
        color="primary"
        icon="fast_forward"
        @click="next"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage } from 'quasar'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { watch, ref } from 'vue'

const musicPlayerStore = useMusicPlayerStore()
const trackAudio = new Audio()
const coverImageUrl = ref('')

async function play () {
  trackAudio.play()
  coverImageUrl.value = await musicPlayerStore.getTrackPicture(musicPlayerStore.state.currentIndex)
  musicPlayerStore.setPlaying(true)
}

function pause () {
  trackAudio.pause()
  musicPlayerStore.setPlaying(false)
}

async function next () {
  musicPlayerStore.setPlaying(true)
  trackAudio.src = await fetchNextSongUrl()
  trackAudio.play()
  coverImageUrl.value = await musicPlayerStore.getTrackPicture(musicPlayerStore.state.currentIndex)
}

async function previous () {
  musicPlayerStore.setPlaying(true)
  trackAudio.src = await fetchPreviousSongUrl()
  trackAudio.play()
  coverImageUrl.value = await musicPlayerStore.getTrackPicture(musicPlayerStore.state.currentIndex)
}

function initTrackSrc (index: number) {
  if (!musicPlayerStore.state.playlistTracks) return
  trackAudio.src = buildTrackUrl(musicPlayerStore.state.playlistTracks[index].id)
}

function buildTrackUrl (trackId: string): string {
  const token: string = LocalStorage.getItem('pc_token') ?? ''
  const API_URL = process.env.API_URL ?? ''

  return `${API_URL}/api/v1/stream/${trackId}?_token=${token}`
}

async function fetchPreviousSongUrl (): Promise<string> {
  if (!musicPlayerStore.state.playlistTracks) return ''
  musicPlayerStore.setCurrentIndex(musicPlayerStore.state.currentIndex - 1)
  return buildTrackUrl(musicPlayerStore.state.playlistTracks[musicPlayerStore.state.currentIndex].id)
}

async function fetchNextSongUrl (): Promise<string> {
  if (!musicPlayerStore.state.playlistTracks) return ''
  musicPlayerStore.setCurrentIndex(musicPlayerStore.state.currentIndex + 1)
  return buildTrackUrl(musicPlayerStore.state.playlistTracks[musicPlayerStore.state.currentIndex].id)
}

trackAudio.addEventListener('ended', async () => {
  console.log('ended')
  next()
  return false
})

watch(
  () => musicPlayerStore.state.playing,
  (val) => {
    if (val) {
      play()
    } else {
      pause()
    }
  }
)

watch(
  () => musicPlayerStore.state.playlistTracks,
  (tracks) => {
    if (tracks?.length && !musicPlayerStore.state.playing) {
      initTrackSrc(0)
    }
  }
)

watch(
  () => musicPlayerStore.state.reset,
  () => {
    pause()
    musicPlayerStore.setCurrentIndex(0)
    initTrackSrc(0)
    play()
  }
)

watch(
  () => musicPlayerStore.state.init,
  () => {
    if (!musicPlayerStore.state.showPlayer) {
      musicPlayerStore.setShowPlayer(true)
    }
    pause()
    initTrackSrc(musicPlayerStore.state.currentIndex)
    play()
  }
)
</script>

<style scoped>

</style>
