<template>
  <div
    class="row bg-white text-dark"
    style="border-top: 1px solid rgba(0, 0, 0, 0.12); border-bottom: 1px solid rgba(0, 0, 0, 0.12);"
  >
    <div class="col-12 col-md-2 q-pr-md q-pl-md q-my-lg justify-center flex vertical-middle">
      <q-slider
        v-model="volume"
        :min="0"
        :max="100"
        class="width-md-sm"
      />
    </div>
    <div class="col-12 col-md-6 q-my-sm">
      <div
        v-if="musicPlayerStore2.trackPlaying"
        class="q-ml-sm"
      >
        <div class="row q-my-sm">
          <div class="col-4 flex justify-end">
            <q-avatar
              square
              class="q-mr-sm"
              style="height: 60px;width: 60px;"
            >
              <img :src="musicPlayerStore2.albumImg">
            </q-avatar>
          </div>
          <div class="col-8">
            <div>{{ musicPlayerStore2.trackPlaying?.title }}</div>
            <div>
              {{ musicPlayerStore2.trackPlaying.metadata.artist }}
            </div>
            {{ musicPlayerStore2.trackPlaying.metadata.album }}
          </div>
        </div>
      </div>
    </div>
    <div class="col-12 col-md-4 justify-center justify-md-end flex vertical-middle">
      <div>
        <MusicRepeatBtn />
        <MusicPreviousBtn />
        <MusicPlayBtn />
        <MusicNextBtn />
        <MusicShuffleBtn />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicPlayerStore2 } from 'src/stores/musicPlayer2'
import { computed } from 'vue'
import MusicPlayBtn from './MusicPlayBtn.vue'
import MusicNextBtn from './MusicNextBtn.vue'
import MusicPreviousBtn from './MusicPreviousBtn.vue'
import MusicShuffleBtn from './MusicShuffleBtn.vue'
import MusicRepeatBtn from './MusicRepeatBtn.vue'

const musicPlayerStore2 = useMusicPlayerStore2()
const volume = computed({
  get: () => musicPlayerStore2.volume,
  set: (v) => musicPlayerStore2.setVolume(v)
})
</script>
