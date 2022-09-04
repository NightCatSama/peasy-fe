import { parsePageData } from '@/utils/core'
import type { IPage, PageNode } from '@/config'
import temp from '../../template-dist/index.html?raw'

export const downloadByPageNode = (data: IPage, filename = '') => {
  let file = parsePageData(data, temp)
  return downloadHtml(file, filename)
}

export const downloadHtml = (html: string, filename = '') => {
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  let a = document.createElement('a')
  a.href = url
  a.download = `${filename || 'index'}.html`
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}
