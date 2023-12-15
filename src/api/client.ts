const API_URL = process.env.API_URL

export type TResponse<T> = {
  data?: T,
  success: boolean,
}

export type TGetMeData = {
  id: string,
  name: string,
  role: 'user' | 'admin'
}

export const api = {
  getMe: async (): Promise<TResponse<TGetMeData>> => {
    const response = await fetch(`${API_URL}/api/v1/clients/me`, {
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
