import { $t } from '@/constants/i18n'
import OSS from 'ali-oss'
import { v4 as uuidv4 } from 'uuid'
import { AlertError } from './alert'

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAI5tKHL8vmNGSxc3zbwxoD',
  accessKeySecret: 'hJ5z4JyZOfeIY0d2FLPhyayeu1jiz9',
  bucket: 'peasy',
})

export const upload = async (file: File) => {
  try {
    const res = await client.put(uuidv4(), file)
    return res.url
  } catch (e) {
    alert(e)
  }
}

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
    return upload(blob)
  } catch (e) {
    console.error(e)
    $t('imageError')
  }
}

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
