import { getColorVarStylesheet, getFontStylesheet } from '@/components/libs/hooks/stylesheet'
import type { IPage, PageNode } from '@/config'
import temp from '../../template-dist/index.html'

export const downloadByPageNode = (data: IPage) => {
  const dataScript = `<script>window.data = ${JSON.stringify(data)}</script>`

  let file = temp
  file = file.replace(/<!--app-data-->/g, dataScript)
  file = file.replace(/<!--app-favicon-->/g, `<link rel="icon" href="${data.setting?.favicon}" />`)
  file = file.replace(/<!--app-title-->/g, data.setting?.title)
  file = file.replace(
    /<!--app-meta-->/g,
    data.setting?.description
      ? `<meta name="description" content="${data.setting.description}" />`
      : ''
  )
  file = file.replace(
    /<!--app-style-->/g,
    `
    <style>${getColorVarStylesheet(data.colorVars)}</style>
    <style>${getFontStylesheet(data.font, 'html')}</style>
  `.trim()
  )

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
