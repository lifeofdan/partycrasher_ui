import { BaseEntity } from '.'
import { IResponse } from '../client'
import { TrackEntityMetadata } from './track'

export interface SearchEntity {
  id: string
  entity: 'track' | 'album'
  entity_id: string
  metadata: {
    entity_metadata: TrackEntityMetadata
    title?: ''
  }
}

class SearchEntityApiClient extends BaseEntity {
  // eslint-disable-next-line space-before-function-paren
  constructor (version = 'v1') {
    super(`/api/${version}/search`)
  }

  public async search (term: string): Promise<IResponse<SearchEntity[]>> {
    return await this.doGet(`?_q=${term}`)
  }
}

export function makeSearchClient (): SearchEntityApiClient {
  return new SearchEntityApiClient()
}
