import { IResponse, IResponsePaginated, Paginator, makeRequestInit } from '../client'

export class BaseEntity {
  private endpoint = ''
  // eslint-disable-next-line space-before-function-paren
  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  protected async doGet<R> (to: string): Promise<IResponse<R>> {
    const url = this.endpoint + ((typeof to === 'string') ? to : '')
    const resonse = await fetch(`${url}`, makeRequestInit('GET'))
    return await resonse.json()
  }

  public async doGetBlob (to: string): Promise<Blob> {
    const url = this.endpoint + ((typeof to === 'string') ? to : '')
    const resonse = await fetch(`${url}`, makeRequestInit('GET'))
    return await resonse.blob()
  }

  protected async doPost<D, R> (to: string, data: D): Promise<IResponse<R>> {
    const url = this.endpoint + (typeof to === 'string') ? to : ''

    const resonse = await fetch(`${url}`, { ...makeRequestInit('POST'), body: JSON.stringify(data) })
    return await resonse.json()
  }

  protected async doPut<D, R> (to: string, data: D): Promise<IResponse<R>> {
    const url = this.endpoint + (typeof to === 'string') ? to : ''

    const resonse = await fetch(`${url}`, { ...makeRequestInit('POST'), body: JSON.stringify(data) })
    return await resonse.json()
  }

  protected async doDelete<R> (to: string): Promise<IResponse<R>> {
    const url = this.endpoint + (typeof to === 'string') ? to : ''
    const resonse = await fetch(`${url}`, makeRequestInit('DELETE'))
    return await resonse.json()
  }

  protected paginate<R> (): PaginatorClient<R> {
    return new PaginatorClient(this.endpoint, null)
  }
}

export class PaginatorClient<R> {
  private endpoint = ''
  private paginators: Paginator | null = null

  // eslint-disable-next-line space-before-function-paren
  constructor(endpoint: string, paginators: Paginator | null) {
    this.endpoint = endpoint
    this.paginators = paginators
  }

  public async next (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginators?.next || '')
    this.paginators = response.paginators
    return response
  }

  public async previous (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginators?.previous || '')
    this.paginators = response.paginators
    return response
  }

  public async current (): Promise<IResponsePaginated<R>> {
    const response = await this.doGet(this.paginators?.current || '')
    this.paginators = response.paginators
    return response
  }

  protected async doGet (page = ''): Promise<IResponsePaginated<R>> {
    const url = this.endpoint + ((page) ? `?_page=${page}` : '')
    const resonse = await fetch(`${url}`, makeRequestInit('GET'))
    return await resonse.json()
  }
}
