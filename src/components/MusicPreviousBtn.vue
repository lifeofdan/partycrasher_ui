<template>
  <span>
    <q-btn
      round
      flat
      color="primary"
      :disable="disable"
      icon="skip_previous"
      @click="playPrevious"
    />
  </span>
</template>

<script setup lang="ts">
import { useMusicPlayerStore2 } from 'src/stores/musicPlayer2'
import { ref } from 'vue'

const musicPlayerStore = useMusicPlayerStore2()

const disable = ref(false)

async function playPrevious () {
  await musicPlayerStore.playPrevious()
}
</script>
