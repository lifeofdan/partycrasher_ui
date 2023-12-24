<template>
  <q-page>
    <template v-if="$route.name === 'app.search'">
      <div class="row items-center justify-evenly q-my-md">
        <div class="col q-mx-md">
          <q-input
            v-model="searchText"
            outlined
            label="search"
          />
        </div>
      </div>
      <template v-if="searchResults.length">
        <div class="row items-center content-between">
          <MusicCard
            style="min-width: 160px; max-width: 320px"
            title="search result"
            sub-title="sub title"
          />
        </div>
      </template>
    </template>
    <RouterView />
  </q-page> search page
</template>

<script setup lang="ts">
import { ref } from 'vue'

const searchText = ref('')
const searchResults = ref([])
</script>

<style scoped>

</style>
