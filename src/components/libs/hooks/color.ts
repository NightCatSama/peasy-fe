import { getColorVarStylesheet } from "./stylesheet"

export const variableColorSymbol = '$'

let dynamicAnimationStyles = null as HTMLStyleElement | null
export const useColorVars = (colorVars: IColorVarItem[]) => {
  // 初始化动态样式表
  if (!dynamicAnimationStyles) {
    dynamicAnimationStyles = document.createElement('style')
    document.head.appendChild(dynamicAnimationStyles)
  }
  let stylesheet = ``
  colorVars.forEach(({ name, color }) => {
    if (!name || name.length <= 1) return
    stylesheet += `--${name.slice(1)}: ${color};`
  })
  dynamicAnimationStyles.innerHTML = getColorVarStylesheet(colorVars)
}

export const getColor = (color: string) => {
  if (color?.[0] === '$') {
    return `var(--${color.slice(1)})`
  }
  return color
}
