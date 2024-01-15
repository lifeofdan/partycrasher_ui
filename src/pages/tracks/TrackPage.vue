<template>
  <div class="row">
    <div class="col">
      <q-img :src="mainArt">
        <div class="absolute-bottom text-subtitle1 text-center">
          <template v-if="route.name === 'app.track'">
            <q-btn
              color="primary"
              icon="queue_music"
              label="Add to playlist"
              @click="tracksStore.addTrackToDefaultPlaylist($route.params.id as string)"
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
                <div
                  class="col flex flex-center"
                  style="min-width: 40px"
                >
                  <q-avatar
                    square
                    class="q-mr-sm"
                  >
                    <q-img :src="track.img" />
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
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { LocalStorage } from 'quasar'
import { TrackEntity } from 'src/api/entity_api/track'
import MusicPlayBtn from 'src/components/MusicPlayBtn.vue'

interface TrackEntityWithSrc extends TrackEntity {
  src: string
  img: string
}
const route = useRoute()
const albumsStore = useAlbumsStore()
const tracksStore = useTracksStore()
const tracks = ref<TrackEntityWithSrc[]>([])
const mainArt = ref('/album.jpeg')

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

onMounted(async () => {
  let albumTracks:TrackEntity[] = []
  if (route.name === 'app.track') {
    const track = await tracksStore.fetchTrack(route.params.id as string)
    if (track !== null) {
      albumTracks.push(track)
    }
  } else if (route.name === 'app.album') {
    albumTracks = await albumsStore.fetchTracks(route.params.id as string)
  }

  for (const aTrack of albumTracks) {
    const mediaId = aTrack.metadata.pictures.cover_art_front ?? ''
    const img = (mediaId) ? tracksStore.fetchTrackMedia(mediaId) : '/album.jpeg'
    mainArt.value = img
    tracks.value.push({ ...aTrack, src: buildTrackUrl(aTrack.id), img })
  }
})
</script>
