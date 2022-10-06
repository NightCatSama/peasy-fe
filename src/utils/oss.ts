import { $t } from '@/constants/i18n'
import { v4 as uuidv4 } from 'uuid'
import { AlertError } from './alert'

export const getClient = async() => {
  const OSS = (await import('ali-oss')).default
  const client = new OSS({
    region: 'oss-cn-shanghai',
    accessKeyId: 'LTAI5tKHL8vmNGSxc3zbwxoD',
    accessKeySecret: 'hJ5z4JyZOfeIY0d2FLPhyayeu1jiz9',
    bucket: 'peasy',
  })
  return client
}

export const upload = async (file: File) => {
  try {
    const client = await getClient()
    const res = await client.put(uuidv4(), file)
    return res.url.replace(/peasy.oss-cn-shanghai.aliyuncs.com/, 'peasy.soapphoto.com')
  } catch (e) {
    alert(e)
  }
}

/** 将 base64 位上传为文件 */
export const uploadByBase64 = async (base64: string) => {
  try {
    let arr = base64.split(',')
    let mime = arr[0].match(/:(.*?);/)?.[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    const blob = new File([u8arr], 'image.png', { type: mime })
    return await upload(blob)
  } catch (e) {
    console.error(e)
    AlertError($t('imageError'))
  }
}

/** 直接处理文件上传事件 */
export const uploadByEvent = async (e: InputEvent, cb: (img: string) => void) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) {
    if (files[0].size <= 10 * 1024) {
      var reader = new FileReader()
      reader.readAsDataURL(files[0])
      reader.onload = function (e) {
        cb(reader.result as string)
      }
    } else {
      const url = await upload(files[0])
      cb(url as string)
    }
  }
  ;(e.target as HTMLInputElement).value = ''
}
