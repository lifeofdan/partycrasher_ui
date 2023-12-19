<template>
  <q-card class="my-card q-mx-md q-my-md">
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
      <div class="absolute-bottom text-center">
        <template
          v-if="type === 'track'"
        >
          <q-btn
            color="primary"
          >
            Queue
          </q-btn>
        </template>
        <template
          v-if="type === 'playlist'"
        >
          <template v-if="playing">
            <q-btn
              color="primary"
              @click="onPause()"
            >
              Pause
            </q-btn>
          </template>
          <template v-else>
            <q-btn
              color="primary"
              @click="onPlay()"
            >
              Play
            </q-btn>
          </template>
        </template>
      </div>
    </q-img>

    <q-card-section>
      <div class="text-h6">
        {{ title }}
      </div>
      <div class="text-subtitle2">
        {{ subTitle }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ type: 'track' | 'playlist', title: string, subTitle: string, playing: boolean }>(), {
  type: 'track',
  title: '',
  subTitle: '',
  playing: false
})
const emit = defineEmits(['play', 'pause'])

function onPlay () {
  emit('play')
}

function onPause () {
  emit('pause')
}
</script>

<style scoped></style>
