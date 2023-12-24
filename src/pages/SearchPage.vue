<template>
  <q-page>
    <template v-if="$route.name === 'app.search'">
      <div class="row items-center justify-evenly q-my-md">
        <div class="col q-mx-md">
          <q-input
            v-model="searchText"
            outlined
            label="search"
            @keyup.enter="doSearch"
          />
        </div>
      </div>
      <template v-if="searchResults.length">
        <div class="row items-center content-between">
          <template v-if="tracks.length">
            <div class="col">
              <div
                class="row q-mx-sm"
              >
                <h4>Tracks</h4>
              </div>
              <div class="row">
                <template
                  v-for="track in tracks"
                  :key="track.id"
                >
                  <MusicCard
                    :search="track"
                    :title="track.metadata.title"
                    :sub-title="track.metadata.entity_metadata.album"
                  />
                </template>
              </div>
            </div>
          </template>
        </div>
      </template>
    </template>
    <RouterView />
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { SearchEntity, makeSearchClient } from 'src/api/entity_api/search'
import { TrackEntity } from 'src/api/entity_api/track'
import MusicCard from 'src/components/MusicCard.vue'

const searchText = ref('')
const searchResults = ref<SearchEntity[]>([])
const tracks = ref<SearchEntity[]>([])
const searchClient = makeSearchClient()

async function doSearch () {
  if (searchText.value.length > 1) {
    tracks.value = []
    const results = await searchClient.search(searchText.value)
    if (results.success && results.data) {
      results.data.forEach((result) => {
        if (result.entity === 'track') {
          tracks.value.push(result)
        }
      })
      searchResults.value = results.data
    }
    console.log(results)
    console.log(tracks.value)
  }
}

</script>

<style scoped>

</style>
