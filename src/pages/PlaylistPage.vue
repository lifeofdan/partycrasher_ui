<template>
  <q-page>
    <div class="row items-center justify-evenly q-my-md">
      <div class="col q-mx-md">
        <q-input outlined label="search" v-model="searchText" />
      </div>
    </div>
    <div class="row items-center content-between">
      <template v-for="(n, index) in 5" :key="index">
        <MusicCard type="playlist" />
      </template>
    </div>
    <div class="row q-my-md absolute-bottom justify-center">
    <div class="col">
      <div class="row justify-center q-mb-sm">
        currently playing...
      </div>
      <div class="row justify-center">
        <q-btn round flat class="q-mb-md" color="primary" icon="fast_rewind" />
        <q-btn round class="q-mb-md q-mx-md" color="primary" icon="play_arrow" />
        <q-btn round flat class="q-mb-md" color="primary" icon="fast_forward" />
      </div>
    </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import MusicCard from 'src/components/MusicCard.vue'

const searchText = ref('')

</script>

<style scoped>

</style>
