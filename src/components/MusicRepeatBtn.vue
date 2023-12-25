<template>
  <span>
    <q-btn
      :icon="stateIcon"
      flat
      dense
      text-color="primary"
      @click="repeat"
    />
  </span>
</template>

<script setup lang="ts">
import { useMusicPlayerStore2, RepeatMode } from 'src/stores/musicPlayer2'
import { watch, ref } from 'vue'

const stateIcon = ref('repeat')
const musicPlayerStore = useMusicPlayerStore2()

let state = 0
const icons = [
  'repeat', 'repeat_one_on', 'repeat_on']
const mode: RepeatMode[] = ['off', 'one', 'all']

watch(() => musicPlayerStore.repeatMode, (m: RepeatMode) => {
  stateIcon.value = icons[mode.indexOf(m)]
})

function repeat () {
  state++
  state = state % icons.length
  stateIcon.value = icons[state]
}
</script>
