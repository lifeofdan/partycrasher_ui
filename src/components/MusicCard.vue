<template>
  <router-link
    v-if="id && routeName"
    :to="{name: routeName, params: { id: id }}"
    class="text-dark"
    style="text-decoration: none;"
  >
    <q-card class="my-card q-mx-md q-my-md">
      <q-img :src="imgSrc" />

      <q-card-section>
        <div class="text-h6">
          {{ title }}
        </div>
        <div class="text-subtitle2">
          {{ subTitle }}
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { IGetPlaylistsData } from 'src/api/client'
import { SearchEntity } from 'src/api/entity_api/search'
import { TrackEntity } from 'src/api/entity_api/track'
import { ref, toRefs, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string,
    subTitle?: string,
    imgSrc?: string,
    playlist?: IGetPlaylistsData,
    track?: TrackEntity
    search?: SearchEntity
  }>(),
  {
    title: '',
    subTitle: '',
    imgSrc: '',
    playlist: undefined,
    track: undefined,
    search: undefined
  })

const { playlist, track, search } = toRefs(props)
const id = ref('')
const routeName = ref('')

onMounted(() => {
  if (playlist.value) {
    id.value = playlist.value.id
    routeName.value = 'app.playlist'
    return
  }

  if (track.value) {
    id.value = track.value.id
    routeName.value = 'app.track'
  }

  if (search.value) {
    if (search.value.entity === 'track') {
      id.value = search.value.entity_id
      routeName.value = 'app.track'
    }
    if (search.value.entity === 'album') {
      id.value = search.value.entity_id
      routeName.value = 'app.album'
    }
  }
})
</script>

<style scoped></style>
