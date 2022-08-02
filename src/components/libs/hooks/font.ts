import { variableColorSymbol } from '@/config'

let dynamicAnimationStyles = null as HTMLStyleElement | null
export const useFont = (font: IFontSetting, wrapper = 'body') => {
  // 初始化动态样式表
  if (!dynamicAnimationStyles) {
    dynamicAnimationStyles = document.createElement('style')
    document.head.appendChild(dynamicAnimationStyles)
  }
  let stylesheet = ``
  if (font.fontFamily) {
    stylesheet += `${wrapper} { font-family: ${font.fontFamily}; }`
  }
  // TODO: 先只处理字符串类型
  if (typeof font.fontSize === 'string') {
    stylesheet += `${wrapper} { font-size: ${font.fontSize}; }`
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
  dynamicAnimationStyles.innerHTML = stylesheet.trim()
}
