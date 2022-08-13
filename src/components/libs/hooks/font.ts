import { getFontStylesheet } from './stylesheet'

let dynamicAnimationStyles = null as HTMLStyleElement | null
export const useFont = (font: IFontSetting, wrapper = 'html') => {
  // 初始化动态样式表
  if (!dynamicAnimationStyles) {
    dynamicAnimationStyles = document.createElement('style')
    document.head.appendChild(dynamicAnimationStyles)
  }
  const stylesheet = getFontStylesheet(font, wrapper)
  dynamicAnimationStyles.innerHTML = stylesheet
}
