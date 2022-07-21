import OSS from 'ali-oss'
import { v4 as uuidv4 } from 'uuid';

const client = new OSS({
  region: 'oss-cn-shanghai',
  accessKeyId: 'LTAI5tKHL8vmNGSxc3zbwxoD',
  accessKeySecret: 'hJ5z4JyZOfeIY0d2FLPhyayeu1jiz9',
  bucket: 'peasy'
});

export const put = async (file: File) => {
  try {
    const res = await client.put(uuidv4(), file)
    return res.url
  } catch (e) {
    alert(e)
  }
}