import { BaseEntity, PaginatorClient } from '.'
import { IResponse } from '../client'
import { makeMediaClient } from './media'

export interface TrackEntityMetadata {
  title: string
  artist: string
  album: string
  genre: string
  track: number
  disk: number
  year: number
  pictures: {
    cover_art_front?: string
  }
}

export interface TrackEntity {
  id: string
  title: string
  metadata: TrackEntityMetadata
}

class TrackEntityApiClient extends BaseEntity {
  constructor (version = 'v1') {
    super(`/api/${version}/tracks`)
  }

  public async byId (id: string): Promise<IResponse<TrackEntity>> {
    return await this.doGet(`/${id}`)
  }

  public async byAlbum (albumId: string): Promise<IResponse<TrackEntity[]>> {
    return await this.doGet(`/album/${albumId}`)
  }

  public async byPlaylist (playlistId: string): Promise<IResponse<TrackEntity[]>> {
    return await this.doGet(`/playlist/${playlistId}`)
  }

  public async stream (track: string | TrackEntity): Promise<string> {
    const mediaClient = makeMediaClient()
    return await mediaClient.byTrackId((typeof track === 'string') ? track : track.id)
  }

  public all (): PaginatorClient<TrackEntity> {
    return this.paginate()
  }
}

export function makeTrackClient (): TrackEntityApiClient {
  return new TrackEntityApiClient()
}
