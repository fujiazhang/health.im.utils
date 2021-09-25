export type StatusType = 'web' | 'rn' | 'wx'

export interface NetOptions {
  getToken: () => string | Promise<string>
  prefix?: string
  statusType?: StatusType
  uploadUrl?: string
}

export interface NetFetchRequest {
  url: any
  queryData?: string
  data?: any
  headers?: any
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
}

export default class Net {
  getToken: () => string | Promise<string>
  prefix: string
  statusType: StatusType
  uploadUrl: string

  constructor(options: NetOptions) {
    this.getToken = options.getToken
    this.prefix = options.prefix || '/api'
    this.statusType = options.statusType || 'web'
    this.uploadUrl = options.uploadUrl || ''
  }

  async fetch(request: NetFetchRequest) {
    const { url, queryData, data, headers, ...props } = request
    const token = await this.getToken()
    const fetchUrl = url || this.uploadUrl + queryData
    return fetch(`${this.prefix}${fetchUrl}`, {
      body: JSON.stringify(data),
      headers: Object.assign(
        {},
        {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json;charset=UTF-8'
        },
        headers || {}
      ),
      ...props
    }).then(response => {
      if (response.ok) {
        return response.json()
      }
      throw response
    })
  }
}
