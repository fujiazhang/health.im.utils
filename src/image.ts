import EXIF from 'exif-js-fix'

export default class HealthImage {
  file: File

  constructor(file: File) {
    this.file = file
  }

  async fixIOSRotate() {
    try {
      const orientation = await this.getTag('Orientation')
      const image = await this.getImage()
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!

      canvas.width = image.width
      canvas.height = image.height

      console.log('File Orientation', orientation)
      switch (Number(orientation)) {
        case 2:
          context.translate(image.width, 0)
          context.scale(-1, 1)
          context.drawImage(image, 0, 0, image.width, image.height)
          break
        case 3:
          context.rotate((180 * Math.PI) / 180)
          context.drawImage(image, -image.width, -image.height, image.width, image.height)
          break
        case 4:
          context.translate(image.width, 0)
          context.scale(-1, 1)
          context.rotate((180 * Math.PI) / 180)
          context.drawImage(image, -image.width, -image.height, image.width, image.height)
          break
        case 5:
          context.translate(image.width, 0)
          context.scale(-1, 1)
          context.rotate((90 * Math.PI) / 180)
          context.drawImage(image, 0, -image.width, image.height, image.width)
          break
        case 6:
          canvas.width = image.height
          canvas.height = image.width
          context.rotate((90 * Math.PI) / 180)
          context.drawImage(image, 0, 0, image.width, -image.height)
          break
        case 7:
          context.translate(image.width, 0)
          context.scale(-1, 1)
          context.rotate((270 * Math.PI) / 180)
          context.drawImage(image, -image.height, 0, image.height, image.width)
          break
        case 8:
          context.rotate((270 * Math.PI) / 180)
          context.drawImage(image, -image.height, 0, image.height, image.width)
          break
        default:
          context.drawImage(image, 0, 0, image.width, image.height)
      }

      const dataUri = canvas.toDataURL('image/jpeg')
      return this.dataUriToFile(dataUri)
    } catch (err) {
      console.error('fixIOSRotate 异常：', err)
      return this.file
    }
  }

  getImage(): Promise<HTMLImageElement> {
    return new Promise(resole => {
      const reader = new FileReader()
      reader.readAsDataURL(this.file)
      reader.onload = (e: any) => {
        const image = new Image()
        image.src = e.target.result
        image.onload = () => {
          resole(image)
        }
      }
    })
  }

  getTag(tag: any) {
    return new Promise(resole => {
      EXIF.getData(this.file as any, function(this: any) {
        resole(EXIF.getTag(this, tag))
      })
    })
  }

  dataUriToFile(dataUri: string) {
    let byteString
    if (dataUri.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataUri.split(',')[1])
    } else {
      byteString = unescape(dataUri.split(',')[1])
    }

    // write the bytes of the string to a typed array
    const bytes = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i += 1) {
      bytes[i] = byteString.charCodeAt(i)
    }
    return new File([bytes], this.file.name, { type: 'image/jpeg' })
  }
}
