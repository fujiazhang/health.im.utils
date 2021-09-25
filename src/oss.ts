import Net from './net'

export default class OSS {
  net: Net
  constructor(net: Net) {
    this.net = net
  }

  async getPolicy(ext: string = '') {
    const query = ext ? `?ext=${ext}` : ''
    const response = await this.net.fetch({ url: `/health/foundation/osspolicy${query}` })
    const data = await response.json()
    if (data.code !== 1) {
      throw Error(`policy error: ${JSON.stringify(data)}`)
    }
    return data.data
  }

  async upload(file: File, policy: any) {
    const formData = new FormData()
    formData.append('key', policy.key)
    formData.append('OSSAccessKeyId', policy.accessId)
    formData.append('policy', policy.policy)
    formData.append('Signature', policy.signature)
    formData.append('file', file)
    await fetch(policy.host, {
      method: 'POST',
      body: formData
    })
    return {
      url: policy.url,
      size: file.size,
      type: file.type
    }
  }
}
