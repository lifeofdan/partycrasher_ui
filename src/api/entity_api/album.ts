import { BaseEntity, PaginatorClient } from '.'
import { IResponse } from '../client'
import { TrackEntity, makeTrackClient } from './track'

export interface AlbumEntity {
  id: string
  title: string
  year: number
  metadata: {
    pictures?: {
      cover_art_front?: string
    }
  }
}

class AlbumEntityClient extends BaseEntity {
  // eslint-disable-next-line space-before-function-paren
  constructor (version = 'v1') {
    super(`/api/${version}/albums`)
  }

  public async byId (id: string): Promise<IResponse<AlbumEntity>> {
    return await this.doGet(`/${id}`)
  }

  public all (): PaginatorClient<AlbumEntity> {
    return this.paginate()
  }

  public async tracks (id: string): Promise<IResponse<TrackEntity[]>> {
    return await makeTrackClient().byAlbum(id)
  }
}

export function makeAlbumClient (): AlbumEntityClient {
  return new AlbumEntityClient()
}
