import { BaseEntity } from '.'

class MediaApiClient extends BaseEntity {
  private readonly baseUrl: string
  constructor (version = 'v1') {
    super(`/api/${version}`)
    this.baseUrl = `/api/${version}`
  }

  public byId (id: string): string {
    return `${this.baseUrl}/serve/${id}`
  }

  public byTrackId (id: string): string {
    return `${this.baseUrl}/stream/${id}`
  }
}

export function makeMediaClient (): MediaApiClient {
  return new MediaApiClient()
}
