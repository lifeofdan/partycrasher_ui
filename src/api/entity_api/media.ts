import { BaseEntity } from '.'

class MediaApiClient extends BaseEntity {
  constructor (version = 'v1') {
    super(`/api/${version}/serve`)
  }

  public async byId (id: string): Promise<string> {
    return URL.createObjectURL(await this.doGetBlob(`/${id}`))
  }
}

export function makeMediaClient (): MediaApiClient {
  return new MediaApiClient()
}
