const API_URL = process.env.API_URL
const defaultIResponse = {
  data: undefined,
  success: false,
  message: 'url not found'
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

export interface IGetPlaylistsPaginated {
  page: IGetPlaylistsData[]
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

  getPlaylists: async (): Promise<IGetPlaylistsPaginated> => {
    if (API_URL === undefined) {
      return {
        page: [],
        paginators: {
          current: '',
          next: '',
          previous: ''
        }
      }
    }

    const response = await fetch(`${API_URL}/api/v1/playlists`, {
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
