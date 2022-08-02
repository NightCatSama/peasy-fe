/** TODO: 判断是否为标准颜色格式 */
export const isColor = (color: string): boolean => {
  return true
}

let recentColorsMaxLen = 16
let recentColors = [
  '#000000',
  '#333333',
  '#666666',
  '#999999',
  '#AAAAAA',
  '#CCCCCC',
  '#EEEEEE',
  '#FFFFFF',
  '#3da8f5',
  '#d71345',
  '#ffaf38',
  '#00b281',
  '#2fbdb3',
  '#7973c9',
  '#f7acbc',
  '#7b5d5f',
] as string[];


export const getRecentColors = (): string[] => recentColors

export const pushRecentColor = (color: string) => {
  const index = recentColors.indexOf(color);
  if (index > -1) {
    recentColors.unshift(recentColors.splice(index, 1)[0])
  } else {
    recentColors.unshift(color)
  }
  if (recentColors.length > recentColorsMaxLen) {
    recentColors.pop()
  }
  sessionStorage?.setItem?.('__recentColors__', JSON.stringify(recentColors))
  return recentColors
}

export const initRecentColors = () => {
  try {
    const rcStr = sessionStorage.getItem('__recentColors__')
    if (rcStr) {
      const list = JSON.parse(rcStr)
      if (Array.isArray(list)) {
        recentColors = list
      }
    }
  } catch (error) {
    console.log('recentColor read error: ', error)
  }
}
