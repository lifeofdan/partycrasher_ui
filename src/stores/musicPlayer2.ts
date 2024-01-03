import { defineStore } from 'pinia'
import { makeMediaClient } from 'src/api/entity_api/media'
import { TrackEntity, makeTrackClient } from 'src/api/entity_api/track'
import { computed, reactive } from 'vue'

export type RepeatMode = 'off' | 'one' | 'all'

export interface AudioCurrentlyPlaying {
  playlist_id: string
  state: 'playing' | 'pause' | 'stop' | 'ended'
  album_id: string
  tracks: TrackEntity[]
  track: TrackEntity | null
  volume: number
  track_index: number
  progress: number
  duration: number
  shuffle: boolean
  repeat: RepeatMode
  at: number
}

const trackClient = makeTrackClient()
const mediaClient = makeMediaClient()

function makeDefaultPlaying (): AudioCurrentlyPlaying {
  return {
    playlist_id: '',
    album_id: '',
    state: 'stop',
    tracks: [],
    track: null,
    volume: 30,
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

  player.volume = playing.volume / 100

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
    if (playing.repeat === 'one' && playing.track !== null) {
      void playTrack(playing.track.id)
      return
    }

    if (playing.shuffle && playing.tracks.length > 0) {
      let nextTrack: TrackEntity
      do {
        nextTrack = playing.tracks[Math.floor(Math.random() * playing.tracks.length - 1)]
      } while (playing.track !== null && nextTrack.id === playing.track.id)
      void playTrack(nextTrack.id)
      return
    }

    if (playing.repeat === 'all') {
      void playNext()
      return
    }

    playing.state = 'ended'
  })

  const progress = computed(() => playing.progress)
  const state = computed(() => playing.state)
  const trackPlaying = computed(() => playing.track)
  const playlistPlaying = computed(() => playing.playlist_id)
  const albumPlaying = computed(() => playing.album_id)
  const shuffling = computed(() => playing.shuffle)
  const repeatMode = computed(() => playing.repeat)
  const albumImg = computed(() => {
    const coverArt = playing.track?.metadata.pictures.cover_art_front ?? null
    return coverArt !== null ? mediaClient.byId(coverArt) : '/album.jpeg'
  })
  const volume = computed(() => playing.volume)
  const oneOf = computed(() => (trackId: string, playlistId: string, albumId: string) => {
    if (trackId.length > 0 && trackId === playing.track?.id) {
      return true
    }
    if (playlistId.length <= 0 && albumId.length <= 0) {
      return false
    }

    if ((playlistId === playing.playlist_id || albumId === playing.album_id) && trackId.length <= 0) {
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
    if (playing.track !== null) {
      if (playing.state === 'playing') {
        player.pause()
      } else {
        await player.play()
      }
    }
  }

  async function playTrack (track: string | TrackEntity, playlistId = '', albumId = ''): Promise<void> {
    if (playlistId.length > 0) {
      return await playPlaylist(playlistId, track)
    }

    if (albumId.length > 0) {
      return await playAlbum(albumId, track)
    }

    playing.track = null
    player.pause()
    player.currentTime = 0
    player.src = await trackClient.stream(track)
    playing.track = (typeof track === 'string') ? (await trackClient.byId(track)).data : track
    await player.play()
  }

  async function playPlaylist (id: string, track: TrackEntity | string = ''): Promise<void> {
    const response = await trackClient.byPlaylist(id)
    const trackId = (typeof track === 'string') ? track : track.id

    if (response.success) {
      playing.playlist_id = id
      playing.album_id = ''
      playing.tracks = response.data ?? []
      if (playing.tracks.length > 0) {
        if (trackId.length > 0) {
          playing.tracks.find((aTrack, index) => {
            if (aTrack.id === trackId) {
              playing.track_index = index
              return true
            }
            return false
          })
        } else {
          playing.track_index = 0
        }
        await playTrack(playing.tracks[playing.track_index])
      }
    }
  }

  async function playAlbum (id: string, track: TrackEntity | string = ''): Promise<void> {
    const response = await trackClient.byAlbum(id)
    const trackId = (typeof track === 'string') ? track : track.id
    if (response.success) {
      playing.album_id = id
      playing.playlist_id = ''
      playing.tracks = response.data ?? []
      if (playing.tracks.length > 0) {
        if (trackId.length > 0) {
          playing.tracks.find((aTrack, index) => {
            if (aTrack.id === trackId) {
              playing.track_index = index
              return true
            }
            return false
          })
        } else {
          playing.track_index = 0
        }

        await playTrack(playing.tracks[playing.track_index])
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

  function setVolume (volume: number): void {
    player.volume = volume / 100
    playing.volume = volume
  }

  return {
    progress,
    state,
    trackPlaying,
    playlistPlaying,
    albumPlaying,
    shuffling,
    repeatMode,
    oneOf,
    albumImg,
    volume,
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
    playPrevious,
    setVolume
  }
})
