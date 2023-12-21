/* global RequestInit */

export type APIError = {
  success: boolean
  message: string
}

export interface IResponse<T> extends APIError {
  data: T | null
}

export interface IGetMeData {
  id: string
  name: string,
  api_token: string,
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
  async loginTokenAuth (loginToken: string): Promise<IResponse<IGetMeData>> {
    return await doGet(`/open/api/v1/clients/auth/${loginToken}`)
  },
  async getMe (): Promise<IResponse<IGetMeData>> {
    return await doGet('/api/v1/clients/me')
  },
  getPlaylistsDefault: async (): Promise<IResponse<IGetPlaylistsData>> => {
    return await doGet('/api/v1/playlists/default')
  },

  getPlaylists: async (): Promise<IResponsePaginated<IGetPlaylistsData>> => {
    const response = await fetch('/api/v1/playlists', makeRequestInit('GET'))
    return await response.json()
  },

  getPlaylist: async (playlistId: string): Promise<IResponse<IGetPlaylistsData>> => {
    return await doGet(`/api/v1/playlists/${playlistId}`)
  },

  getTracks: async (): Promise<IResponsePaginated<IGetTrackData>> => {
    const response = await fetch('/api/v1/tracks', makeRequestInit('GET'))
    return await response.json()
  },

  getPlaylistTracks: async (playlistId: string): Promise<IResponse<IGetPlaylistTracks[]>> => {
    return await doGet(`/api/v1/tracks/playlist/${playlistId}`)
  }
}

function makeRequestInit (method: 'GET' | 'POST' | 'PUT' | 'DELETE'): RequestInit {
  const token = window.localStorage.getItem('pc_token')
  return {
    method,
    credentials: 'include',
    headers: {

      'Cache-Control': 'no-cache',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

async function doGet<T> (segmentUrl: string): Promise<IResponse<T>> {
  try {
    const response = await fetch(segmentUrl, makeRequestInit('GET'))

    return await response.json()
  } catch (e) {
    return { data: null, success: false, message: (e as Error).message }
  }
}
