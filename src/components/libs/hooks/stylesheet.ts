/**
 * 此文件会在 build 模板时 copy 到后端使用
 * 不要在此引入其他文件
 */
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