/**
 * 此文件会在 build 模板时 copy 到后端使用
 * 不要在此引入其他文件
 */

import type { IPage } from 'types/config'
import { escapeHtml } from './xss'

export const parsePageData = (data: IPage, temp: string) => {
  const replaceFn = (key: string, value: any) => {
    if (typeof value === 'string') {
      return value.replace(/"/g, '\\"')
    }
    return value
  }
  const dataScript = `<script>window.data = "${escapeHtml(
    JSON.stringify(data, replaceFn)
  )}"</script>`

  let file = temp
  file = file.replace(/<!--app-data-->/g, () => dataScript)
  file = file.replace(
    /<!--app-favicon-->/g,
    () => `<link rel="icon" href="${data.setting?.favicon}" />`
  )
  file = file.replace(/<!--app-title-->/g, () => data.setting?.title)
  file = file.replace(/<!--app-meta-->/g, () =>
    data.setting?.description
      ? `<meta name="description" content="${data.setting.description}" />`
      : ''
  )
  file = file.replace(/<!--app-style-->/g, () =>
    `
    <style>${getColorVarStylesheet(data.colorVars)}</style>
    <style>${getFontStylesheet(data.font, 'html')}</style>
  `.trim()
  )
  file = file.replace(/<!--app-google-analytic-->/g, () =>
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
`.trim()
    : ''
}
  `.trim()
  )
  file = file.replace(/<!--app-custom-code-->/g, () =>
    data.setting.customCode ? data.setting.customCode : ''
  )

  return file
}

export const getColorVarStylesheet = (colorVars: IColorVarItem[]) => {
  let stylesheet = ``
  colorVars.forEach(({ name, color }) => {
    if (!name || name.length <= 1) return
    stylesheet += `--${name.slice(1)}: ${color};`
  })
  return `
    :root {${stylesheet}}
  `.trim()
}

export const getFontStylesheet = (font: IFontSetting, wrapper: string) => {
  let stylesheet = ``
  if (font.fontFamily) {
    stylesheet += `${wrapper} { font-family: ${font.fontFamily}; }`
  }
  if (font.fontSize) {
    stylesheet += `${wrapper} { font-size: ${font.fontSize}px; }`
  }
  if (font.mediaFontSize && Object.keys(font.mediaFontSize).length > 0) {
    Object.entries(font.mediaFontSize).forEach(([width, size]) => {
      stylesheet += `@media screen and (min-width: ${width}px) { ${wrapper} { font-size: ${size}px; } }`
    })
  }
  if (font.customFontFace) {
    font.customFontFace.forEach((item) => {
      if (typeof item === 'object') {
        if (!item.fontFamily || !item.url) return
        stylesheet += `
          @font-face {
            font-family: ${item.fontFamily};
            src: url(${item.url}) format('${item.url.split('.').pop()}');
            font-weight: ${item.fontWeight};
            font-style: ${item.fontStyle};
          }
        `.trim()
      } else if (item) {
        stylesheet =
          `
          @import url('${item}');
        `.trim() + stylesheet
      }
    })
  }
  return stylesheet
}
