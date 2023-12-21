export interface IResponse<T> {
  data?: T
  success: boolean
  message: string | null
}

export interface IGetMeData {
  id: string
  name: string
  role: 'user' | 'admin'
}

export interface IGetPlaylistsData {
  id: string
  name: string
  is_default: true
  description: string
}

interface ITrackMetadata {
  title: string
  artist: string
  album: string
  genre: string
  track: number
  disk: number
  year: number
  pictures: Map<string, string>
}

export interface IGetPlaylistTrack {
  id: string
  title: string
  media_id: string
  metadata: ITrackMetadata
}

export interface IGetTrackData {
  id: string
  title: string
  media_id: string
  metadata: ITrackMetadata
}

export interface IResponsePaginated<T> {
  page: T[]
  paginators: {
    current: string
    next: string
    previous: string
  }
}

export const api = {
  getMe: async (): Promise<IResponse<IGetMeData>> => {
    const response = await fetch('/api/v1/clients/me', {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylistsDefault: async (): Promise<IResponse<IGetPlaylistsData>> => {
    const response = await fetch('/api/v1/playlists/default', {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylists: async (): Promise<IResponsePaginated<IGetPlaylistsData>> => {
    const response = await fetch('/api/v1/playlists', {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylist: async (playlistId: string): Promise<IResponse<IGetPlaylistsData>> => {
    const response = await fetch(`/api/v1/playlists/${playlistId}`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getTracks: async (): Promise<IResponsePaginated<IGetTrackData>> => {
    const response = await fetch('/api/v1/tracks', {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getTrack: async (id: string): Promise<IResponse<IGetTrackData>> => {
    const response = await fetch(`/api/v1/tracks/${id}`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylistTracks: async (playlistId: string): Promise<IResponse<IGetPlaylistTrack[]>> => {
    const response = await fetch(`/api/v1/tracks/playlist/${playlistId}`, {
      headers: setTokenHeader()
    })

    return await response.json()
  }
}

function setTokenHeader (): Headers {
  const token = window.localStorage.getItem('pc_token')?.split('|')[1]
  const header = new Headers({
    'Cache-Control': 'no-cache',
    Authorization: `Bearer ${token ?? ''}`,
    'Content-Type': 'application/json'
  })

  return header
}
