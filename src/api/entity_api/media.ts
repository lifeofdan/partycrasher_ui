import { BaseEntity } from '.'

class MediaApiClient extends BaseEntity {
  constructor (version = 'v1') {
    super(`/api/${version}`)
  }

  public async byId (id: string): Promise<string> {
    return URL.createObjectURL(await this.doGetBlob(`/serve/${id}`))
  }

  public async byTrackId (id: string): Promise<string> {
    return URL.createObjectURL(await this.doGetBlob(`/stream/${id}`))
  }
}

export function makeMediaClient (): MediaApiClient {
  return new MediaApiClient()
}
