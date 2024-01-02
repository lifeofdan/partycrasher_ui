<template>
  <div class="row">
    <div class="col">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle1 text-center">
          <template v-if="route.name === 'app.track'">
            <MusicPlayBtn
              fill-btn
              :track-id="($route.params.id as string)"
            />
          </template>
          <template v-if="route.name === 'app.album'">
            <q-btn
              color="primary"
              icon="queue_music"
              label="Add album to playlist"
              @click="addAlbumToPlaylist"
            />
          </template>
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
          v-for="track in tracks"
          :key="track.id"
        >
          <q-item
            v-ripple
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
                  <MusicPlayBtn :track-id="track.id" />
                </div>
              </div>
            </q-item-section>
            <q-item-section>
              {{ track.title ?? "&nbsp;" }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTracksStore } from 'src/stores/tracks'
import { useAlbumsStore } from 'src/stores/albums'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'
import { TrackEntity } from 'src/api/entity_api/track'
import MusicPlayBtn from 'src/components/MusicPlayBtn.vue'

interface TrackEntityWithSrc extends TrackEntity {
  src: string
  img: string
}
const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const albumsStore = useAlbumsStore()
const tracksStore = useTracksStore()
const userTrackAudio = new Audio()
const previewPlaying = ref(false)
const img = ref('')
const tracks = ref<TrackEntityWithSrc[]>([])

function pausePreview () {
  previewPlaying.value = false
  userTrackAudio.pause()
}

function buildTrackUrl (trackId: string): string {
  const token: string = LocalStorage.getItem('pc_token') ?? ''
  const API_URL = process.env.API_URL ?? ''

  return `${API_URL}/api/v1/stream/${trackId}?_token=${token}`
}

function addAlbumToPlaylist () {
  tracks.value.forEach((track) => {
    tracksStore.addTrackToDefaultPlaylist(track.id)
  })
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
  if (route.name === 'app.track') {
    const track = await tracksStore.fetchTrack(route.params.id as string)

    if (track !== null) {
      const src = buildTrackUrl(track.id)
      const mediaId = track.metadata.pictures.cover_art_front ?? ''
      const img = await tracksStore.fetchTrackMedia(mediaId)
      tracks.value.push({ ...track, src, img })
    }
    return
  }

  if (route.name === 'app.album') {
    const albumTracks = await albumsStore.fetchTracks(route.params.id as string)

    for (const aTrack of albumTracks) {
      tracks.value.push({ ...aTrack, src: buildTrackUrl(aTrack.id), img: await tracksStore.fetchTrackMedia(aTrack.id) })
    }
  }
})
</script>
