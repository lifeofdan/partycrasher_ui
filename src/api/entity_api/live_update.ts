export interface PlaylistTrackToggle {
  order_number: number
  playlist_id: string
  track_id: string
}

export interface PlaylistSetDefault {
  playlist_id: string
}

export interface PlaylistEvent {
  event: {
    default_playlist?: PlaylistSetDefault
    track_added?: PlaylistTrackToggle
    track_removed?: PlaylistTrackToggle
  }
}

export interface PlayerEvent {
  event: {
    progress?: {
      position: number[]
      total: number[]
    }
    play_playlist?: {
      playlist_id: string
    }
    play_track?: {
      track_id: string
    }
    play_album?: {
      album_id: string
    }
    play?: {
      play: boolean
    }
    skip?: {
      next: boolean
    }
  }
}

export interface ConnectionEvent {
  event: 'open' | 'close' | 'error'
  payload: Event
}

export type Topic = 'playlist_event' | 'player_event' | 'connection_event'
export type TopicPayload = PlaylistEvent | PlayerEvent | ConnectionEvent

export type DispatchedTopic = {
  [playlist_event in Topic]: TopicPayload
}

class LiveUpdateClient {
  private readonly endpoint: string
  private readonly ws: WebSocket
  private readonly subscribers: Map<Topic, Array<(payload: TopicPayload) => void>> = new Map()

  constructor (endpoint: string) {
    this.endpoint = endpoint
    const token = localStorage.getItem('pc_token') ?? ''
    let host = (window.location.protocol === 'http:' ? 'wss://' : 'ws://') + window.location.host
    if (process?.env.API_URL !== undefined) {
      host = process.env.API_URL.replace('http', 'ws')
        .replace('https', 'wss')
    }

    this.ws = new WebSocket(`${host}${this.endpoint}?_token=${token}`)

    this.ws.onopen = (ev) => this.handleOpen(ev)
    this.ws.onclose = (ev) => this.handleClose(ev)
    this.ws.onmessage = (ev) => this.handleMessage(ev)
    this.ws.onerror = (ev) => this.handleError(ev)
  }

  public subscribe (topic: Topic, handler: (topic: TopicPayload) => void): this {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, [])
    }

    this.subscribers.get(topic)?.push(handler)
    return this
  }

  private handleMessage (ev: MessageEvent<string>): void {
    try {
      const data = JSON.parse(ev.data) as DispatchedTopic
      for (const key in data) {
        const payload = data[key as Topic]
        this.doDispatch(key as Topic, payload)
      }
    } catch (e) {
      // TODO: Handle this error properly
      // gracefully ignore all errors for now
    }
  }

  private doDispatch (topic: Topic, payload: TopicPayload): void {
    this.subscribers.get(topic)?.forEach((handler) => {
      handler(payload)
    })
  }

  private handleOpen (payload: Event): void {
    this.doDispatch('connection_event', {
      event: 'open',
      payload
    })
  }

  private handleClose (payload: Event): void {
    this.doDispatch('connection_event', {
      event: 'close',
      payload
    })
  }

  private handleError (payload: Event): void {
    this.doDispatch('connection_event', {
      event: 'error',
      payload
    })
  }
}

// Keep singleton instance
let instance: LiveUpdateClient | null = null

export function setupWs (): LiveUpdateClient {
  if (instance === null) {
    instance = new LiveUpdateClient('/api/v1/live/ws')
  }
  return instance
}

export function makeLiveUpdateClient (): LiveUpdateClient {
  if (instance === null) {
    return setupWs()
  }
  return instance
}
