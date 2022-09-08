import { getColorVarStylesheet } from '@/utils/core'

export const variableColorSymbol = '$'

let dynamicAnimationStyles = null as HTMLStyleElement | null

export const useColorVars = (colorVars: IColorVarItem[]) => {
  // 初始化动态样式表
  if (!dynamicAnimationStyles) {
    dynamicAnimationStyles = document.createElement('style')
    document.head.appendChild(dynamicAnimationStyles)
  }
  dynamicAnimationStyles.innerHTML = getColorVarStylesheet(colorVars)
}

export const getColor = (color: string) => {
  if (color?.[0] === variableColorSymbol) {
    return `var(--${color.slice(1)})`
  }
  return color
}
