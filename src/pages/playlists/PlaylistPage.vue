<template>
  <div class="row">
    <div class="col">
      <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
        <div class="absolute-bottom text-subtitle1 text-center bg-transparent">
          <template v-if="musicPlayerStore.state.playlistTracks && musicPlayerStore.state.playlistTracks.length">
            <q-btn
              color="primary"
              round
              icon="play_arrow"
              @click="showAndPlay"
            />
          </template>
        </div>
      </q-img>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-list
        bordered
        separator
      >
        <template
          v-for="(track, index) in tracksWithImages"
          :key="track.id"
        >
          <q-item>
            <q-item-section avatar>
              <div class="row">
                <div
                  class="col flex flex-center"
                  style="min-width: 40px"
                >
                  <q-img
                    :src="track.src"
                    style="clip-path: circle()"
                  >
                    <div class="absolute-center flex flex-center items-end bg-transparent">
                      <q-spinner-audio
                        v-show="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing"
                        color="grey-6"
                        size="1.5em"
                      />
                    </div>
                  </q-img>
                </div>
                <div class="col">
                  <template v-if="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing">
                    <q-btn
                      round
                      flat
                      icon="pause"
                      @click="musicPlayerStore.setPlaying(false)"
                    />
                  </template>
                  <template v-else>
                    <q-btn
                      round
                      flat
                      icon="play_arrow"
                      @click="setIndexAndPlay(index)"
                    />
                  </template>
                </div>
              </div>
            </q-item-section>
            <q-item-section @click="playOrPause(index)">
              {{ track.title }}
            </q-item-section>
            <q-item-section side>
              <div class="row">
                <template v-if="index === musicPlayerStore.state.currentIndex && musicPlayerStore.state.playing">
                  <q-btn
                    round
                    flat
                    color="dark"
                    icon="replay"
                    @click="setIndexAndPlay(index)"
                  />
                </template>
                <q-btn
                  round
                  flat
                  color="dark"
                  icon="playlist_remove"
                  @click="onRemove(index)"
                />
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </div>
  </div>
  <q-dialog
    v-model="removeDialogue"
    persistent
  >
    <q-card>
      <q-card-section class="row items-center">
        <span class="q-ml-sm">Are you sure you want to remove this from the playlist?</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          v-close-popup
          flat
          no-caps
          label="Cancel"
          color="primary"
        />
        <q-btn
          flat
          no-caps
          label="Yes, remove."
          color="primary"
          @click="remove()"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { IGetPlaylistTrack, IGetPlaylistsData } from 'src/api/client'
import { useMusicPlayerStore } from 'src/stores/musicPlayer'
import { usePlaylistsStore } from 'src/stores/playlists'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

interface ITrackWithImgSrc extends IGetPlaylistTrack {
  src?: string
}

const route = useRoute()
const musicPlayerStore = useMusicPlayerStore()
const playlistsStore = usePlaylistsStore()
const currentPlaylist = ref<IGetPlaylistsData | null>(null)
const trackToRemove = ref<IGetPlaylistTrack | null>(null)
const tracksWithImages = ref<ITrackWithImgSrc[]>([])
const removeDialogue = ref(false)

async function playOrPause (index: number) {
  if (musicPlayerStore.state.playing && index === musicPlayerStore.state.currentIndex) {
    musicPlayerStore.setPlaying(false)
  } else {
    setIndexAndPlay(index)
  }
}

function showAndPlay () {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.setPlaying(false)
    musicPlayerStore.reset()
    return
  }
  musicPlayerStore.setShowPlayer(true)
  musicPlayerStore.setPlaying(true)
}

function setIndexAndPlay (index: number) {
  if (musicPlayerStore.state.playing) {
    musicPlayerStore.setPlaying(false)
  }
  musicPlayerStore.setCurrentIndex(index)
  musicPlayerStore.initTrackSrc()
}

function onRemove (index: number) {
  if (playlistsStore.state.playlistTracks === null) return
  trackToRemove.value = playlistsStore.state.playlistTracks[index]
  removeDialogue.value = true
}

async function remove () {
  if (trackToRemove.value === null) return
  await playlistsStore.removeFromPlaylist(trackToRemove.value.id, route.params.id as string)

  await getTracksAndSetImages()
  removeDialogue.value = false
}

async function getTracksAndSetImages () {
  currentPlaylist.value = await playlistsStore.fetchPlaylist(route.params.id as string)

  if (!currentPlaylist.value) return
  const tracks = await playlistsStore.fetchPlaylistTracks(currentPlaylist.value.id) ?? []

  musicPlayerStore.setPlaylistTracks(tracks)

  if (!musicPlayerStore.state.playlistTracks) return
  tracksWithImages.value = []

  for (const [index, track] of musicPlayerStore.state.playlistTracks.entries()) {
    tracksWithImages.value.push({ ...track, src: await musicPlayerStore.getTrackPicture(index) })
  }
}
onMounted(async () => {
  await getTracksAndSetImages()
})
</script>

<style scoped>

</style>
