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
        <MusicCard
          style="min-width: 160px; max-width: 320px"
          type="playlist"
          :title="playlistsStore.state.defaultPlaylist?.name ?? ''"
          :sub-title="playlistsStore.state.defaultPlaylist?.description ?? ''"
          :playing="playing"
          @play="onPlay"
          @pause="onPause"
        />
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
            :disable="!canPrevious"
            icon="fast_rewind"
            @click="playPreviousTrack"
          />
          <template v-if="!playing">
            <q-btn
              round
              class="q-mb-md q-mx-md"
              color="primary"
              icon="play_arrow"
              @click="onPlay"
            />
          </template>
          <template v-if="playing">
            <q-btn
              round
              class="q-mb-md q-mx-md"
              color="primary"
              icon="pause"
              @click="onPause"
            />
          </template>
          <q-btn
            round
            flat
            :disable="!canNext"
            class="q-mb-md"
            color="primary"
            icon="fast_forward"
            @click="playNextTrack"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import MusicCard from 'src/components/MusicCard.vue'
import { usePlaylistsStore } from 'src/stores/playlists'
import { LocalStorage } from 'quasar'

const playlistsStore = usePlaylistsStore()
const searchText = ref('')
const trackAudio = new Audio()
const playing = ref(false)
const currentIndex = ref(0)
const canNext = ref(true)
const canPrevious = ref(false)

trackAudio.addEventListener('ended', async () => {
  console.log('ended')
  await playNextTrack()
  return false
})

async function playNextTrack () {
  playing.value = true
  trackAudio.src = await fetchNextSongUrl()
  trackAudio.play()
}

async function playPreviousTrack () {
  playing.value = true
  trackAudio.src = await fetchPreviousSongUrl()
  trackAudio.play()
}

function onPlay () {
  trackAudio.play()
  playing.value = true
}

function onPause () {
  trackAudio.pause()
  playing.value = false
}

function buildTrackUrl (trackId: string): string {
  const token: string = LocalStorage.getItem('pc_token') ?? ''
  const API_URL = process.env.API_URL ?? ''

  return `${API_URL}/api/v1/stream/${trackId}?_token=${token}`
}

async function fetchPreviousSongUrl (): Promise<string> {
  if (!playlistsStore.state.playlistTracks) return ''
  currentIndex.value--
  return buildTrackUrl(playlistsStore.state.playlistTracks[currentIndex.value].id)
}

async function fetchNextSongUrl (): Promise<string> {
  if (!playlistsStore.state.playlistTracks) return ''
  currentIndex.value++
  return buildTrackUrl(playlistsStore.state.playlistTracks[currentIndex.value].id)
}

watch(
  () => currentIndex.value,
  (index) => {
    if (!playlistsStore.state.playlistTracks) return
    if (index === (playlistsStore.state.playlistTracks?.length - 1)) {
      canNext.value = false
    } else {
      canNext.value = true
    }

    if (index === 0) {
      canPrevious.value = false
    } else {
      canPrevious.value = true
    }
  }
)

onMounted(async () => {
  await playlistsStore.fetchPlaylistsDefault()
  if (!playlistsStore.state.defaultPlaylist) return
  await playlistsStore.fetchPlaylistTracks(playlistsStore.state.defaultPlaylist.id)

  if (!playlistsStore.state.playlistTracks || !playlistsStore.state.playlistTracks.length) return
  trackAudio.src = buildTrackUrl(playlistsStore.state.playlistTracks[0].id)
})
</script>

<style scoped>

</style>
