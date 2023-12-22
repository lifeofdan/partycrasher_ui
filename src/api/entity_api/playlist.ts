import { BaseEntity, PaginatorClient } from '.'
import { IResponse, ITrackMetadata } from '../client'

export interface PlaylistEntity {
  id: string
  name: string
  is_default: boolean
  description: string
}

export interface PlaylistTrackEntity {
  track_id: string
  playlist_id: string
  title: string
  id: string
  media_id: string
  metadata: ITrackMetadata
}

class PlaylistEntityClient extends BaseEntity {
  constructor (version = 'v1') {
    super(`/api/${version}/playlists`)
  }

  public async byId (id: string): Promise<IResponse<PlaylistEntity>> {
    return await this.doGet(`/${id}`)
  }

  public async byDefault (): Promise<IResponse<PlaylistEntity>> {
    return await this.doGet('/default')
  }

  public all (): PaginatorClient<PlaylistEntity> {
    return this.paginate()
  }

  public async addTracks (entries: Array<{ track_id: string, playlist_id: string }>): Promise<IResponse<PlaylistTrackEntity[]>> {
    return await this.doPost('/add-tracks', entries)
  }

  public async removeTracks (entries: Array<{ track_id: string, playlist_id: string }>): Promise<IResponse<PlaylistTrackEntity[]>> {
    return await this.doPost('/remove-tracks', entries)
  }
}

export function makePlaylistClient (): PlaylistEntityClient {
  return new PlaylistEntityClient()
}
