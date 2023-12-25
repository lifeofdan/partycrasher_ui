<template>
  <q-spinner-audio
    v-show="musicPlayerStore.trackPlayling === trackId && musicPlayerStore.state === 'playing'"
    :color="color"
    :size="size"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { useMusicPlayerStore2 } from '../../stores/musicPlayer2'

const musicPlayerStore = useMusicPlayerStore2()
defineProps({
  trackId: {
    type: String as PropType<string>,
    required: true
  },
  size: {
    type: String as PropType<string>,
    default: '1.5em'
  },
  color: {
    type: String as PropType<string>,
    default: 'grey-6'
  }

})
</script>
