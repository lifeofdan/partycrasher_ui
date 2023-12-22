import { ApiResponse, BaseEntity, PaginatorClient } from '.'

export interface ClientEntity {
  id: string
  name: string
  api_token: string
  login_token: string
  role: 'user' | 'admin'
}

class ClientEntityClient extends BaseEntity {
  constructor (version = 'v1') {
    super(`/api/${version}/clients`)
  }

  public all (): PaginatorClient<ClientEntity> {
    return this.paginate()
  }

  public async getRandomClient (): ApiResponse<ClientEntity> {
    return await this.doGet('/random-user')
  }
}

export function makeClientClient (): ClientEntityClient {
  return new ClientEntityClient()
}
