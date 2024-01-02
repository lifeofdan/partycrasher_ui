<template>
  <div
    class="row bg-white text-dark"
    style="border-top: 1px solid rgba(0, 0, 0, 0.12); border-bottom: 1px solid rgba(0, 0, 0, 0.12);"
  >
    <div class="col-12 col-md-6 q-my-sm">
      <div
        v-if="musicPlayerStore2.trackPlayling"
        class="q-ml-sm"
      >
        <q-avatar
          square
          class="q-mr-sm"
        >
          <img :src="musicPlayerStore2.albumImg">
        </q-avatar>
        {{ musicPlayerStore2.trackPlayling?.title }}
      </div>
    </div>
    <div class="col-12 col-md-6 justify-center justify-md-end flex vertical-middle">
      <div>
        <MusicRepeatBtn />
        <MusicPreviousBtn />
        <MusicPlayBtn />
        <MusicNextBtn />
        <MusicShuffleBtn />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LocalStorage } from 'quasar'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { useMusicPlayerStore2 } from 'src/stores/musicPlayer2'
import { watch, ref } from 'vue'
import { PlaylistEvent, TopicPayload, makeLiveUpdateClient } from 'src/api/entity_api/live_update'
import { usePlaylistsStore } from 'src/stores/playlists'
import MusicPlayBtn from './MusicPlayBtn.vue'
import MusicNextBtn from './MusicNextBtn.vue'
import MusicPreviousBtn from './MusicPreviousBtn.vue'
import MusicShuffleBtn from './MusicShuffleBtn.vue'
import MusicRepeatBtn from './MusicRepeatBtn.vue'

const musicPlayerStore = useMusicPlayerStore()
const musicPlayerStore2 = useMusicPlayerStore2()
const playlistsStore = usePlaylistsStore()
const trackAudio = new Audio()
const coverImageUrl = ref('')
const liveUpdateClient = makeLiveUpdateClient()

liveUpdateClient.subscribe('playlist_event', async (response) => {
  if (isPlaylistEvent(response)) {
    if (response.event.track_removed) {
      const tracks = await playlistsStore.fetchPlaylistTracks(response.event.track_removed.playlist_id)

      if (tracks === null) return
      musicPlayerStore.setPlaylistTracks(tracks)
    }
    if (response.event.track_added) {
      const tracks = await playlistsStore.fetchPlaylistTracks(response.event.track_added.playlist_id)

      if (tracks === null) return
      musicPlayerStore.setPlaylistTracks(tracks)
    }
  }
})

function isTrackRemoved (obj: TopicPayload): obj is PlaylistEvent {
  return (obj as PlaylistEvent).event.track_removed !== undefined
}

function isTrackAdded (obj: TopicPayload): obj is PlaylistEvent {
  return (obj as PlaylistEvent).event.track_added !== undefined
}

function isDefaultPlaylist (obj: TopicPayload): obj is PlaylistEvent {
  return (obj as PlaylistEvent).event.default_playlist !== undefined
}

function isPlaylistEvent (obj: TopicPayload): obj is PlaylistEvent {
  if (isTrackRemoved(obj)) return true
  if (isTrackAdded(obj)) return true
  if (isDefaultPlaylist(obj)) return true

  return false
}

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

function initTrackSrc (index: number) {
  if (!musicPlayerStore.state.playlistTracks) return
  trackAudio.src = buildTrackUrl(musicPlayerStore.state.playlistTracks[index].id)
}

function buildTrackUrl (trackId: string): string {
  const token: string = LocalStorage.getItem('pc_token') ?? ''
  const API_URL = process.env.API_URL ?? ''

  return `${API_URL}/api/v1/stream/${trackId}?_token=${token}`
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
