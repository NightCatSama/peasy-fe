import { parsePageData } from '@/utils/core'
import type { IPage, PageNode } from '@/config'
import JSZip from 'jszip'
import { Project } from '@@/entities/project.entity'

// import temp from '../../template-dist/index.html?raw'

const temp = ''

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

export const downloadAllPages = (project: Project[]) => {
  const zip = new JSZip()
  project.forEach((p) => {
    zip.file(`${p.filename || 'index'}.html`, parsePageData(p.page, temp))
  })
  zip.generateAsync({ type: 'blob' }).then((content) => {
    const url = URL.createObjectURL(content)
    let a = document.createElement('a')
    a.href = url
    a.download = `p-easy.zip`
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  })
}