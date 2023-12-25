import { defineStore } from 'pinia'
import { TrackEntity, makeTrackClient } from 'src/api/entity_api/track'
import { reactive } from 'vue'

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

export const useMusicPlayerStore2 = defineStore('musicPlayer2', {
  state (): { _player: HTMLAudioElement, _playing: AudioCurrentlyPlayling } {
    const player = new Audio()
    const playing = reactive(makeDefaultPlaying())
    const playTrack = this.actions?.playTrack
    const playNext = this.actions?.playNext

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
      if (playing.shuffle && playing.tracks.length > 0 && playTrack !== undefined) {
        let nextId = ''
        do {
          nextId = playing.tracks[Math.floor(Math.random() * playing.tracks.length - 1)].id
        } while (nextId === playing.track_id)
        void playTrack(nextId)
        return
      }

      if (playing.repeat === 'one' && playTrack !== undefined) {
        void playTrack(playing.track_id)
        return
      }

      if (playing.repeat === 'all' && playNext !== undefined) {
        void playNext()
        return
      }

      playing.state = 'ended'
    })

    return {
      _player: player,
      _playing: playing
    }
  },
  getters: {
    oneOf: (store) => (trackId: string, playlistId: string, albumId: string) => {
      if (trackId.length > 0 && trackId === store._playing.track_id) {
        return true
      }
      if (trackId !== store._playing.track_id) {
        return false
      }

      if ((playlistId.length > 0 && playlistId === store._playing.playlist_id) || (albumId.length > 0 && albumId === store._playing.album_id)) {
        return true
      }
      return false
    },
    progress: (store) => store._playing.progress,
    state: (store) => store._playing.state,
    trackPlayling: (store) => store._playing.track_id,
    playlistPlayling: (store) => store._playing.playlist_id,
    albumPlayling: (store) => store._playing.album_id,
    shuffling: (store) => store._playing.shuffle,
    repeatMode: (store) => store._playing.repeat
  },
  actions: {
    stop () {
      if (this._playing.state === 'playing') {
        this._player.pause()
        this._player.currentTime = 0
        this._player.src = ''
        this._playing.state = 'stop'
      }
    },
    pause () {
      if (this._playing.state === 'playing') {
        this._player.pause()
      }
    },
    async resume () {
      if (this._playing.state === 'pause') {
        await this._player.play()
      }
    },
    toggleShuffle () {
      this._playing.shuffle = !this._playing.shuffle
    },
    repeat (mode: RepeatMode) {
      this._playing.repeat = mode
    },
    async togglePlay () {
      if (this._playing.track_id !== null) {
        if (this._playing.state === 'playing') {
          this._player.pause()
        } else {
          await this._player.play()
        }
      }
    },
    async playTrack (id: string, playlistId = '', albumId = ''): Promise<void> {
      if (playlistId.length > 0) {
        return await this.playPlaylist(playlistId, id)
      }

      if (albumId.length > 0) {
        return await this.playAlbum(albumId, id)
      }

      this._playing.track_id = ''
      this._player.pause()
      this._player.currentTime = 0
      this._player.src = await trackClient.stream(id)
      this._playing.track_id = id
      await this._player.play()
    },
    async playPlaylist (id: string, trackId = ''): Promise<void> {
      const response = await trackClient.byPlaylist(id)
      if (response.success) {
        this._playing.playlist_id = id
        this._playing.album_id = ''
        this._playing.tracks = response.data ?? []
        if (this._playing.tracks.length > 0) {
          if (trackId.length > 0) {
            this._playing.tracks.find((track, index) => {
              if (track.id === trackId) {
                this._playing.track_index = index
                return true
              }
              return false
            })
          } else {
            this._playing.track_index = 0
          }
          await this.playTrack(this._playing.tracks[this._playing.track_index].id)
        }
      }
    },
    async playAlbum (id: string, trackId = ''): Promise<void> {
      const response = await trackClient.byAlbum(id)
      if (response.success) {
        this._playing.album_id = id
        this._playing.playlist_id = ''
        this._playing.tracks = response.data ?? []
        if (this._playing.tracks.length > 0) {
          if (trackId.length > 0) {
            this._playing.tracks.find((track, index) => {
              if (track.id === trackId) {
                this._playing.track_index = index
                return true
              }
              return false
            })
          } else {
            this._playing.track_index = 0
          }

          await this.playTrack(this._playing.tracks[this._playing.track_index].id)
        }
      }
    },

    async playNext (): Promise<void> {
      if (this._playing.tracks.length > 0) {
        this._playing.track_index = (this._playing.track_index + 1) % this._playing.tracks.length
        await this.playTrack(this._playing.tracks[this._playing.track_index].id)
      }
    },
    async playPrevious (): Promise<void> {
      if (this._playing.tracks.length > 0) {
        this._playing.track_index--
        this._playing.track_index = (this._playing.track_index >= 0) ? this._playing.track_index : 0
        await this.playTrack(this._playing.tracks[this._playing.track_index].id)
      }
    }
  }
})
