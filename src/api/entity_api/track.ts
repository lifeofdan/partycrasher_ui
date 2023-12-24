import { BaseEntity, PaginatorClient } from '.'
import { IResponse } from '../client'

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

export interface TrackEntityPlusSrcImg extends TrackEntity {
  src: string
  img: string
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

  public async stream (track: string | TrackEntity): Promise<string> {
    const base = new BaseEntity('/api/v1/stream/')
    return URL.createObjectURL(await base.doGetBlob((typeof track === 'string') ? track : track.id))
  }

  public async player (track: string | TrackEntity): Promise<HTMLAudioElement> {
    return new Audio(await this.stream(track))
  }

  public all (): PaginatorClient<TrackEntity> {
    return this.paginate()
  }
}

export function makeTrackClient (): TrackEntityApiClient {
  return new TrackEntityApiClient()
}
