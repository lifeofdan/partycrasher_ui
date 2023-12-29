import { defineStore } from 'pinia'
import { TrackEntity, makeTrackClient } from 'src/api/entity_api/track'
import { computed, reactive } from 'vue'

export type RepeatMode = 'off' | 'one' | 'all'

export interface AudioCurrentlyPlayling {
  playlist_id: string
  state: 'playing' | 'pause' | 'stop' | 'ended'
  album_id: string
  tracks: TrackEntity[]
  track_id: string
  track_index: number
  progress: number
  duration: number
  shuffle: boolean
  repeat: RepeatMode
  at: number
}

const trackClient = makeTrackClient()

function makeDefaultPlaying (): AudioCurrentlyPlayling {
  return {
    playlist_id: '',
    album_id: '',
    state: 'stop',
    tracks: [],
    track_id: '',
    track_index: 0,
    duration: 0,
    progress: 0,
    at: 0,
    shuffle: false,
    repeat: 'off'
  }
}

export const useMusicPlayerStore2 = defineStore('musicPlayer2', () => {
  const player = new Audio()
  const playing = reactive(makeDefaultPlaying())

  player.addEventListener('timeupdate', () => {
    playing.at = player.currentTime
    playing.state = 'playing'
    playing.progress = (playing.at < 0) ? 0 : (playing.at / playing.duration) * 100
  })

  player.addEventListener('durationchange', () => {
    playing.duration = player.duration
    playing.progress = 0
  })

  player.addEventListener('playing', () => {
    playing.state = 'playing'
  })

  player.addEventListener('pause', () => {
    playing.state = 'pause'
  })

  player.addEventListener('ended', () => {
    if (playing.repeat === 'one' && playTrack !== undefined) {
      void playTrack(playing.track_id)
      return
    }

    if (playing.shuffle && playing.tracks.length > 0 && playTrack !== undefined) {
      let nextId = ''
      do {
        nextId = playing.tracks[Math.floor(Math.random() * playing.tracks.length - 1)].id
      } while (nextId === playing.track_id)
      void playTrack(nextId)
      return
    }

    if (playing.repeat === 'all' && playNext !== undefined) {
      void playNext()
      return
    }

    playing.state = 'ended'
  })

  const progress = computed(() => playing.progress)
  const state = computed(() => playing.state)
  const trackPlayling = computed(() => playing.track_id)
  const playlistPlayling = computed(() => playing.playlist_id)
  const albumPlayling = computed(() => playing.album_id)
  const shuffling = computed(() => playing.shuffle)
  const repeatMode = computed(() => playing.repeat)
  const oneOf = computed(() => (trackId: string, playlistId: string, albumId: string) => {
    if (trackId.length > 0 && trackId === playing.track_id) {
      return true
    }
    if (trackId !== playing.track_id) {
      return false
    }

    if ((playlistId.length > 0 && playlistId === playing.playlist_id) || (albumId.length > 0 && albumId === playing.album_id)) {
      return true
    }
    return false
  })

  function stop (): void {
    if (playing.state === 'playing') {
      player.pause()
      player.currentTime = 0
      player.src = ''
      playing.state = 'stop'
    }
  }

  function pause (): void {
    if (playing.state === 'playing') {
      player.pause()
    }
  }

  async function resume (): Promise<void> {
    if (playing.state === 'pause') {
      await player.play()
    }
  }

  function toggleShuffle (): void {
    playing.shuffle = !playing.shuffle
  }

  function repeat (mode: RepeatMode): void {
    playing.repeat = mode
  }

  async function togglePlay (): Promise<void> {
    if (playing.track_id !== null) {
      if (playing.state === 'playing') {
        player.pause()
      } else {
        await player.play()
      }
    }
  }

  async function playTrack (id: string, playlistId = '', albumId = ''): Promise<void> {
    if (playlistId.length > 0) {
      return await playPlaylist(playlistId, id)
    }

    if (albumId.length > 0) {
      return await playAlbum(albumId, id)
    }

    playing.track_id = ''
    player.pause()
    player.currentTime = 0
    player.src = await trackClient.stream(id)
    playing.track_id = id
    await player.play()
  }

  async function playPlaylist (id: string, trackId = ''): Promise<void> {
    const response = await trackClient.byPlaylist(id)
    if (response.success) {
      playing.playlist_id = id
      playing.album_id = ''
      playing.tracks = response.data ?? []
      if (playing.tracks.length > 0) {
        if (trackId.length > 0) {
          playing.tracks.find((track, index) => {
            if (track.id === trackId) {
              playing.track_index = index
              return true
            }
            return false
          })
        } else {
          playing.track_index = 0
        }
        await playTrack(playing.tracks[playing.track_index].id)
      }
    }
  }

  async function playAlbum (id: string, trackId = ''): Promise<void> {
    const response = await trackClient.byAlbum(id)
    if (response.success) {
      playing.album_id = id
      playing.playlist_id = ''
      playing.tracks = response.data ?? []
      if (playing.tracks.length > 0) {
        if (trackId.length > 0) {
          playing.tracks.find((track, index) => {
            if (track.id === trackId) {
              playing.track_index = index
              return true
            }
            return false
          })
        } else {
          playing.track_index = 0
        }

        await playTrack(playing.tracks[playing.track_index].id)
      }
    }
  }

  async function playNext (): Promise<void> {
    if (playing.tracks.length > 0) {
      playing.track_index = (playing.track_index + 1) % playing.tracks.length
      await playTrack(playing.tracks[playing.track_index].id)
    }
  }

  async function playPrevious (): Promise<void> {
    if (playing.tracks.length > 0) {
      playing.track_index--
      playing.track_index = (playing.track_index >= 0) ? playing.track_index : 0
      await playTrack(playing.tracks[playing.track_index].id)
    }
  }

  return {
    progress,
    state,
    trackPlayling,
    playlistPlayling,
    albumPlayling,
    shuffling,
    repeatMode,
    oneOf,
    stop,
    pause,
    resume,
    toggleShuffle,
    repeat,
    togglePlay,
    playTrack,
    playPlaylist,
    playAlbum,
    playNext,
    playPrevious
  }
})
