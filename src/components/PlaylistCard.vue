<template>
  <router-link
    v-if="id && routeName"
    :to="{name: routeName, params: { id: id }}"
    class="text-dark"
    style="text-decoration: none;"
  >
    <q-card class="my-card q-mx-md q-my-md">
      <q-img :src="img" />

      <q-card-section>
        <div class="text-subtitle2">
          {{ title }}
        </div>
        <div class="text-subtitle3">
          {{ subTitle }}
        </div>
      </q-card-section>
    </q-card>
  </router-link>
</template>

<script setup lang="ts">
import { IGetPlaylistsData } from 'src/api/client'
import { AlbumEntity } from 'src/api/entity_api/album'
import { ref, onMounted } from 'vue'
import { useAlbumsStore } from '../stores/albums'
import { usePlaylistsStore } from '../stores/playlists'

const props = defineProps<{
  collection: { playlist?: IGetPlaylistsData, album?: AlbumEntity },
  }>()

const albumStore = useAlbumsStore()
const playlistsStore = usePlaylistsStore()
const id = ref('')
const routeName = ref('')
const img = ref('/album.jpeg')
const title = ref('')
const subTitle = ref('')

onMounted(() => {
  if (props.collection.album) {
    routeName.value = 'app.album'
    id.value = props.collection.album.id
    img.value = albumStore.coverArt(props.collection.album)
    title.value = props.collection.album.title
    subTitle.value = (props.collection.album.year ?? '') + ''
  } else if (props.collection.playlist) {
    routeName.value = 'app.playlist'
    id.value = props.collection.playlist.id
    img.value = playlistsStore.coverArt(props.collection.playlist)
    title.value = props.collection.playlist.name
    subTitle.value = (props.collection.playlist.is_default) ? 'default' : ''
  }
})
</script>

<style scoped></style>
