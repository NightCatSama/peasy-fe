import { parsePageData } from '@/utils/core'
import type { IPage, PageNode } from '@/config'
import temp from '../../template-dist/index.html?raw'

export const downloadByPageNode = (data: IPage) => {
  let file = parsePageData(data, temp)
  return downloadHtml(file)
}

export const downloadHtml = (html: string) => {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  let a = document.createElement('a')
  a.href = url
  a.download = 'index.html'
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
