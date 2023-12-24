<template>
  <q-page>
    <template v-if="$route.name === 'app.tracks'">
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
          v-for="track in tracks"
          :key="track.id"
        >
          <MusicCard
            style="min-width: 160px; max-width: 320px;"
            :img-src="track.img"
            :title="track.title"
            :sub-title="track.metadata.artist"
            :track="track"
          />
        </template>
      </div>
      <div class="row q-my-md absolute-bottom">
        <div class="col text-center q-mx-md q-mb-md">
          <q-btn
            color="primary"
            class="full-width"
            label="Show tracks"
            @click="show(false)"
          />
        </div>
      </div>
    </template>
    <RouterView />
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useQuasar } from 'quasar'
import MusicCard from 'src/components/MusicCard.vue'
import { useTracksStore } from 'src/stores/tracks'
import { useRoute } from 'vue-router'
import { TrackEntity, TrackEntityPlusSrcImg } from 'src/api/entity_api/track'

const route = useRoute()
const searchText = ref('')
const $q = useQuasar()
const tracksStore = useTracksStore()
const tracks = ref<TrackEntityPlusSrcImg[]>([])

function show (grid: boolean) {
  $q.bottomSheet({
    message: 'Playlist',
    grid,
    actions: [
      {
        label: 'Dance party',
        img: 'https://cdn.quasar.dev/img/parallax2.jpg',
        id: 'drive'
      },
      {
        label: 'Dance party',
        img: 'https://cdn.quasar.dev/img/parallax2.jpg',
        id: 'keep'
      },
      {
        label: 'Dance party',
        img: 'https://cdn.quasar.dev/img/parallax2.jpg',
        id: 'calendar'
      },
      {
        label: 'Dance party',
        img: 'https://cdn.quasar.dev/img/parallax2.jpg',
        id: 'calendar'
      }
    ]
  }).onOk(() => {
    // console.log('Action chosen:', action.id)
  }).onCancel(() => {
    // console.log('Dismissed')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}

watch(
  () => route.name,
  async (name) => {
    if (name && name === 'app.tracks') {
      await tracksStore.fetchTracks()
    }
  }
)

onMounted(async () => {
  // We do this because we don't want to fetch all tracks when we are loading the track sub-page
  if (route.name === 'app.tracks') {
    const storeTracks = await tracksStore.fetchTracks()

    for (const aTrack of storeTracks) {
      const img = aTrack.metadata.pictures.cover_art_front ? await tracksStore.fetchTrackMedia(aTrack.metadata.pictures.cover_art_front) : ''
      tracks.value.push({ ...aTrack, src: tracksStore.buildTrackUrl(aTrack.id), img })
    }
  }
})
</script>
