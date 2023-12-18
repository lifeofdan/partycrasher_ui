<template>
  <q-card class="my-card q-mx-md q-my-md">
    <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
      <div class="absolute-bottom text-center">
        <q-btn
          v-if="type === 'track'"
          color="primary"
        >
          Queue
        </q-btn>
        <q-btn
          v-if="type === 'playlist'"
          color="primary"
        >
          Play
        </q-btn>
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
withDefaults(defineProps<{ type: 'track' | 'playlist', title: string, subTitle: string }>(), {
  type: 'track',
  title: '',
  subTitle: ''
})
</script>

<style scoped></style>
