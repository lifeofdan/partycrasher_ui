<template>
  <router-link
    v-if="id && routeName"
    :to="{name: routeName, params: { id: id }}"
    class="text-dark"
    style="text-decoration: none;"
  >
    <q-card class="my-card q-mx-md q-my-md">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg" />

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
import { IGetPlaylistsData, IGetTrackData } from 'src/api/client'
import { ref, toRefs, onMounted } from 'vue'

const props = withDefaults(
  defineProps<{
    title: string,
    subTitle: string,
    playlist?: IGetPlaylistsData,
    track?: IGetTrackData
  }>(),
  {
    title: '',
    subTitle: '',
    playlist: undefined,
    track: undefined
  })

const { playlist, track } = toRefs(props)
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
})
</script>

<style scoped></style>
