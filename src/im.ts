import * as qs from 'qs'
import mitt from 'mitt'

import Net from './net'

export type Role = 'guest' | 'user' | 'doctor' | 'pharmacy' | 'root'

export interface User {
  id: number
  role: Role // 当前角色
}

export interface InitParams {
  currentUser: User
  friendUserRole: Role
}

export interface GetRoomsParams {
  keyword?: string
  excludeAssistant?: boolean
  pageIndex?: number
  pageSize?: number
}

export interface GetMessageListParams {
  roomId: number
  lastMsgId?: number
  msgTypes?: string
  keyword?: string
  pageIndex?: number
  pageSize?: number
}

export interface SendMessageParams {
  roomId: number
  type: 'Text' | 'Picture' | 'File' | 'Voice'
  data: any
}

export default class IM {
  emitter: mitt.Emitter = mitt()

  state = false
  inited = false
  connection: any
  interval: any

  net: Net
  currentUser?: User
  friendUserRole?: Role
  constructor(net: Net) {
    this.net = net
  }

  async init(params: InitParams) {
    this.currentUser = params.currentUser
    this.friendUserRole = params.friendUserRole
    if (!this.inited) {
      if (this.net.statusType === 'web') {
        await this.initSignalr()
      } else {
        await this.initWebSocket()
      }
    }
  }

  stop() {
    if (this.connection) {
      if (this.net.statusType === 'web') {
        this.connection.stop()
      } else {
        this.connection.close()
      }
      this.state = false
    }
  }

  onMessage(callback: (data: any) => void) {
    this.emitter.on('message', callback)
  }

  offMessage(callback: (data: any) => void) {
    this.emitter.off('message', callback)
  }

  async getRooms(params: GetRoomsParams) {
    const data = await this.net.fetch({
      url: `/Session/rooms?${qs.stringify({
        role: this.currentUser ? this.currentUser.role : '',
        friendUserRole: this.friendUserRole,
        ...params
      })}`
    })
    return data.data
  }

  async setRead(roomId: number) {
    const data = await this.net.fetch({
      url: `/Msg/read/${roomId}`,
      method: 'PUT'
    })
    return data.data
  }

  async getMessageList(params: GetMessageListParams) {
    const data = await this.net.fetch({
      url: `/Msg/history?${qs.stringify(params)}`
    })
    return data.data
  }

  async sendMessage(params: SendMessageParams) {
    const request = this.getMessageRequest(params)
    const data = await this.net.fetch({
      url: request.url,
      data: request.body,
      method: 'POST'
    })
    return data
  }

  private async initSignalr() {
    const { HubConnectionBuilder, LogLevel } = await require('@aspnet/signalr')
    const hubBuilder = new HubConnectionBuilder()
    const token = await this.net.getToken()
    this.connection = hubBuilder
      .withUrl(`${this.net.prefix}/messages?token=${token}`)
      .configureLogging(LogLevel.Information)
      .build()

    this.connection.on('receiveMsg', (data: any) => {
      this.emitter.emit('message', data)
    })

    const start = async () => {
      this.connection
        .start()
        .then(() => {
          this.state = true
        })
        .catch((e: any) => {
          return Promise.reject(e)
        })
    }

    await start()
    this.inited = true

    this.connection.onclose(async () => {
      if (this.state) {
        await start()
      }
    })
  }

  private async initWebSocket() {
    const baseUrl = this.net.prefix.replace(/(http\:)|(https:)/, 'wss:')
    const token = await this.net.getToken()

    const start = () => {
      this.connection = new WebSocket(`${baseUrl}/ws/messages?token=${token}`)
      this.connection.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data)
        if (data.command && data.command === 'receiveMsg') {
          this.emitter.emit('message', JSON.parse(data.data))
        }
      }

      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
      }

      this.interval = setInterval(() => {
        if (this.connection) {
          this.connection.send('')
        }
      }, 30 * 1000)
    }

    start()
    this.inited = true
    this.connection.onclose = () => {
      if (this.state) {
        start()
      }
    }
  }

  private getMessageRequest(params: SendMessageParams): any {
    if (params.type === 'Text') {
      return {
        url: '/Msg/text',
        body: {
          roomId: params.roomId,
          text: params.data.text
        }
      }
    }

    if (params.type === 'Picture') {
      return {
        url: '/Msg/picture',
        body: {
          roomId: params.roomId,
          url: params.data.url,
          size: params.data.size
        }
      }
    }

    if (params.type === 'File') {
      return {
        url: '/Msg/file',
        body: {
          roomId: params.roomId,
          url: params.data.url,
          size: params.data.size,
          ext: params.data.ext,
          fileName: params.data.fileName,
          fileType: params.data.fileType
        }
      }
    }

    if (params.type === 'Voice') {
      return {
        url: '/Msg/voice',
        body: {
          roomId: params.roomId,
          url: params.data.url,
          length: params.data.length
        }
      }
    }
    return {}
  }
}
