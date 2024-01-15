<template>
  <span>
    <q-btn
      round
      flat
      :disable="disable"
      color="primary"
      icon="skip_next"
      @click="playNext"
    />

  </span>
</template>

<script setup lang="ts">
import { useMusicPlayerStore2 } from 'src/stores/musicPlayer2'
import { ref } from 'vue'

const disable = ref(false)
const musicPlayerStore = useMusicPlayerStore2()

async function playNext () {
  await musicPlayerStore.playNext()
}
</script>
