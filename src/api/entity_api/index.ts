import {
  IResponse,
  IResponsePaginated,
  Paginator,
  makeRequestInit
} from '../client'

export class BaseEntity {
  private readonly endpoint: string = ''
  // eslint-disable-next-line space-before-function-paren
  constructor (endpoint: string) {
    this.endpoint = endpoint
  }

  protected async doGet<R> (to: string | null): Promise<IResponse<R>> {
    const url = this.endpoint + (typeof to === 'string' ? to : '')
    const response = await fetch(`${url}`, makeRequestInit('GET'))
    return await response.json()
  }

  public async doGetBlob (to: string | null): Promise<Blob> {
    const url = this.endpoint + (typeof to === 'string' ? to : '')
    const response = await fetch(`${url}`, makeRequestInit('GET'))
    return await response.blob()
  }

  protected async doPost<D, R> (to: string | null, data: D): Promise<IResponse<R>> {
    const url = this.endpoint + ((typeof to === 'string') ? to : '')

    const response = await fetch(`${url}`, {
      ...makeRequestInit('POST'),
      body: JSON.stringify(data)
    })
    return await response.json()
  }

  protected async doPut<D, R> (to: string | null, data: D): Promise<IResponse<R>> {
    const url = this.endpoint + ((typeof to === 'string') ? to : '')

    const response = await fetch(`${url}`, {
      ...makeRequestInit('POST'),
      body: JSON.stringify(data)
    })
    return await response.json()
  }

  protected async doDelete<R> (to: string | null): Promise<IResponse<R>> {
    const url = this.endpoint + ((typeof to === 'string') ? to : '')
    const response = await fetch(`${url}`, makeRequestInit('DELETE'))
    return await response.json()
  }

  protected paginate<R> (): PaginatorClient<R> {
    return new PaginatorClient(this.endpoint, null)
  }
}

export class PaginatorClient<R> {
  private readonly endpoint: string = ''
  private paginator: Paginator | null = null

  // eslint-disable-next-line space-before-function-paren
  constructor (endpoint: string, paginator: Paginator | null) {
    this.endpoint = endpoint
    this.paginator = paginator
  }

  public async next (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginator?.next)
    this.paginator = response.paginator
    return response
  }

  public async previous (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginator?.previous)
    this.paginator = response.paginator
    return response
  }

  public async current (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginator?.current)
    this.paginator = response.paginator
    return response
  }

  protected async doGet (page = ''): Promise<IResponsePaginated<R>> {
    const url = this.endpoint + ((page.length > 0 ? `?_page=${page}` : ''))
    const response = await fetch(`${url}`, makeRequestInit('GET'))
    return await response.json()
  }
}
