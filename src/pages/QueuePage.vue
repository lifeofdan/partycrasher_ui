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
    <div class="row items-center content-between">
      <template
        v-for="track in queueStore.state.tracks"
        :key="track.id"
      >
        <MusicCard
          style="min-width: 160px; max-width: 320px;"
          type="track"
          :title="track.title"
          :description="track.metadata.artist"
        />
      </template>
    </div>
    <div class="row q-my-md absolute-bottom">
      <div class="col text-center q-mx-md q-mb-md">
        <q-btn
          color="primary"
          class="full-width"
          label="Show queue"
          @click="show(false)"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import MusicCard from 'src/components/MusicCard.vue'
import { useQueueStore } from 'src/stores/queue'

const searchText = ref('')
const $q = useQuasar()
const queueStore = useQueueStore()

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

onMounted(async () => {
  await queueStore.fetchTracks()
})
</script>
