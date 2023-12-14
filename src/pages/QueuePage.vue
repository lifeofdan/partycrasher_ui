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
        v-for="(n, index) in 5"
        :key="index"
      >
        <MusicCard type="track" />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import MusicCard from 'src/components/MusicCard.vue'

const searchText = ref('')
const $q = useQuasar()

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
</script>
