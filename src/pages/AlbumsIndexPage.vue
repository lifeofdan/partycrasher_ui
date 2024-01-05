<template>

        <div class="row items-center content-between">
  <PlaylistCard
    v-for="(album, index) in collection"
     style="width: 160px; width: 320px"
    :key="index"
    :collection="{album }"
  />
  </div>
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
