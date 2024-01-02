import { BaseEntity } from '.'

class MediaApiClient extends BaseEntity {
  private readonly baseUrl: string
  constructor (version = 'v1') {
    super(`/api/${version}`)
    this.baseUrl = `/api/${version}`
  }

  public async byId (id: string): Promise<string> {
    return `${this.baseUrl}/serve/${id}`
  }

  public async byTrackId (id: string): Promise<string> {
    return `${this.baseUrl}/stream/${id}`
  }
}

export function makeMediaClient (): MediaApiClient {
  return new MediaApiClient()
}
