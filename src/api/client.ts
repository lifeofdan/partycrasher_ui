const API_URL = process.env.API_URL
const defaultIResponse = {
  data: undefined,
  success: false,
  message: 'url not found'
}
const defaultIResponsePaginated = {
  page: [],
  paginators: {
    current: '',
    next: '',
    previous: ''
  }
}

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

export interface IGetPlaylistTracks {
  id: string
  title: string
  media_id: string
  metadata: ITrackMetadata
}

export interface IGetTrackData {
  id: string
  title: string
  path: string
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
    if (API_URL === undefined) return defaultIResponse

    const response = await fetch(`${API_URL}/api/v1/clients/me`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylistsDefault: async (): Promise<IResponse<IGetPlaylistsData>> => {
    if (API_URL === undefined) return defaultIResponse

    const response = await fetch(`${API_URL}/api/v1/playlists/default`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylists: async (): Promise<IResponsePaginated<IGetPlaylistsData>> => {
    if (API_URL === undefined) {
      return defaultIResponsePaginated
    }

    const response = await fetch(`${API_URL}/api/v1/playlists`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylist: async (playlistId: string): Promise<IResponse<IGetPlaylistsData>> => {
    if (API_URL === undefined) return defaultIResponse

    const response = await fetch(`${API_URL}/api/v1/playlists/${playlistId}`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getTracks: async (): Promise<IResponsePaginated<IGetTrackData>> => {
    if (API_URL === undefined) return defaultIResponsePaginated

    const response = await fetch(`${API_URL}/api/v1/tracks`, {
      headers: setTokenHeader()
    })

    return await response.json()
  },

  getPlaylistTracks: async (playlistId: string): Promise<IResponse<IGetPlaylistTracks[]>> => {
    if (API_URL === undefined) return defaultIResponse

    const response = await fetch(`${API_URL}/api/v1/tracks/playlist/${playlistId}`, {
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
