<template>
  <q-circular-progress
    show-value
    font-size="16px"
    class="q-ma-md"
    :value="progress"
    :size="props.size"
    :thickness="0.06"
    color="red"
    track-color="grey-3"
  >
    <q-btn
      v-if="!fillBtn"
      round
      flat
      color="primary"
      :icon="stateIcon"
      @click="togglePlay"
    />
    <q-btn
      v-if="fillBtn"
      color="primary"
      :icon="stateIcon"
      round
      @click="togglePlay"
    />
  </q-circular-progress>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { useMusicPlayerStore2 } from '../stores/musicPlayer2'

const progress = ref(0)
const stateIcon = ref('play_arrow')
const playerStore = useMusicPlayerStore2()
const props = defineProps({
  size: {
    type: String as PropType<string>,
    default: '60px'
  },
  fillBtn: {
    type: Boolean as PropType<boolean>,
    default: false
  },
  trackId: {
    type: String as PropType<string>,
    default: ''
  },
  playlistId: {
    type: String as PropType<string>,
    default: ''
  },
  albumId: {
    type: String as PropType<string>,
    default: ''
  }
})

function isThisPlayer (): boolean {
  return (props.trackId === '' && props.playlistId === '' && props.albumId === '') || playerStore.oneOf(props.trackId, props.playlistId, props.albumId)
}

watch(() => playerStore.state, (state) => {
  if (isThisPlayer()) {
    if (state === 'playing') {
      stateIcon.value = 'pause'
    } else {
      stateIcon.value = 'play_arrow'
    }
  } else {
    stateIcon.value = 'play_arrow'
  }
})
watch(() => playerStore.progress, (current) => {
  if (isThisPlayer()) {
    progress.value = current
    stateIcon.value = 'pause'
  } else {
    stateIcon.value = 'play_arrow'
    progress.value = 0
  }
})

async function togglePlay () {
  if (isThisPlayer() && playerStore.state === 'playing') {
    playerStore.pause()
  } else if (isThisPlayer() && playerStore.state === 'pause') {
    await playerStore.resume()
  } else {
    if (props.trackId) {
      await playerStore.playTrack(props.trackId, props.playlistId, props.albumId)
    } else if (props.playlistId) {
      await playerStore.playPlaylist(props.playlistId)
    } else if (props.albumId) {
      await playerStore.playAlbum(props.albumId)
    }
  }
}

</script>
