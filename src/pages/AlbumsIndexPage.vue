<template>
  <PlaylistCard
    v-for="(album, index) in collection"
    :key="index"
    :collection="{album }"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { AlbumEntity, makeAlbumClient } from '../api/entity_api/album'
import PlaylistCard from 'src/components/PlaylistCard.vue'
const collection = ref<AlbumEntity[]>([])

const paginator = makeAlbumClient().all()

onMounted(async () => {
  (await paginator.next()).page.forEach((entry) => {
    collection.value.push(entry)
  })
})

</script>
