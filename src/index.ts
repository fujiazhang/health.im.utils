import Net, { NetOptions } from './net'
import IM from './im'
import OSS from './oss'
import HeImage from './image'
import fileTypes from './file-types'

export type ModuleName = 'im'

export interface SDKUtilsOptions extends NetOptions {
  version?: string
}

export default class SDKUtils {
  net: Net
  im: IM
  oss: OSS

  constructor(options: SDKUtilsOptions) {
    this.net = new Net(options)
    this.im = new IM(this.net)
    this.oss = new OSS(this.net)
  }

  /**
   *
   * @param file File 文件对象
   * @returns data { url, size, type }
   */
  async upload(file: File) {
    if (navigator.userAgent && navigator.userAgent.match(/iPhone/i)) {
      const heImage = new HeImage(file)
      file = await heImage.fixIOSRotate()
    }

    const fileType = fileTypes.find(({ type }) => type === file.type)
    if (!fileType) {
      throw Error(`file type not supported: ${file.type}`)
    }
    const policy = await this.oss.getPolicy(fileType.ext)
    const data = await this.oss.upload(file, policy)
    return data
  }
}
