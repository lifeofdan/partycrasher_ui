import { BaseEntity } from '.'
import { IResponse } from '../client'

export type SearchEntity = {
  id: string,
  entity: string,
  entity_id: string,
  metadata: {
    entity_metadata: Record<string, unknown>
  }
}

class SearchEntityApiClient extends BaseEntity {
  // eslint-disable-next-line space-before-function-paren
  constructor(version = 'v1') {
    super(`/api/${version}/search`)
  }

  public async search (term: string): Promise<IResponse<Array<SearchEntity>>> {
    return await this.doGet(`?_q=${term}`)
  }
}

export function makeSearchClient (): SearchEntityApiClient {
  return new SearchEntityApiClient()
}
