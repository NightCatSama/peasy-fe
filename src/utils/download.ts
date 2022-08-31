import { getColorVarStylesheet, getFontStylesheet } from '@/components/libs/hooks/stylesheet'
import type { IPage, PageNode } from '@/config'
import temp from '../../template-dist/index.html?raw'

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
  file = file.replace(
    /<!--app-google-analytic-->/g,
    `
${
      data.setting.googleAnalytics
        ? `
<script async src="https://www.googletagmanager.com/gtag/js?id=${data.setting.googleAnalytics}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${data.setting.googleAnalytics}');
</script>
`.trim() : ''
}
  `.trim()
  )
  file = file.replace(
    /<!--app-custom-code-->/g,
    data.setting.customCode ? data.setting.customCode : ''
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
