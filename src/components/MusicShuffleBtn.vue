<template>
  <span>
    <q-btn
      :icon="stateIcon"
      flat
      dense
      text-color="primary"
      @click="toggleShuffle"
    />
  </span>
</template>

<script setup lang="ts">
import { useMusicPlayerStore2 } from 'src/stores/musicPlayer2'
import { ref, watch } from 'vue'

const stateIcon = ref('shuffle')
const musicPlayerStore = useMusicPlayerStore2()

watch(() => musicPlayerStore.shuffling, (shuffling) => {
  stateIcon.value = (shuffling) ? 'shuffle_on' : 'shuffle'
})
function toggleShuffle () {
  musicPlayerStore.toggleShuffle()
}
</script>
