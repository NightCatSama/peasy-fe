import { useDisplayStore } from '@/stores/display'

export const isUnitType = (type: string): type is UnitType =>
  (['%', 'px', 'rem'] as UnitType[]).includes(type as unknown as UnitType)

export const getUnit = (s: string): UnitType | '' => {
  if (!s || typeof s !== 'string') return ''
  if (s.slice(-1) === '%') {
    return '%'
  }
  if (s.slice(-2) === 'px') {
    return 'px'
  }
  if (s.slice(-3) === 'rem') {
    return 'rem'
  }
  return ''
}

/** 将数字格式化成保留两位小数 */
export const fixedPointToNumber = (s: string | number, decimal = 2): number =>
  +(parseFloat('' + s) || 0).toFixed(decimal)

/** 将带单位的数字字符串格式化成保留两位小数的字符串 */
export const fixedPoint = (s: string): string => {
  const unit = getUnit(s)
  if (!unit) return s
  return fixedPointToNumber(s.slice(0, -unit.length)) + unit
}

/** 将 px 转成其他格式 */
export const covertPXToUnit = (s: string, unit: string, referSiz?: number) => {
  if (!isUnitType(unit)) return s
  else if (unit === 'px') return s
  else if (unit === 'rem')
    return `${fixedPointToNumber(parseFloat(s) / useDisplayStore().curFootSize)}rem`
  else if (unit === '%') return `${fixedPointToNumber((parseFloat(s) / (referSiz || 1)) * 100)}%`
  return s
}

/** 将各种格式的宽高转换成当前场景可用的样式 */
export const covertSize = (
  s?: string,
  options?: { isEditMode?: boolean; isSection?: boolean; isHeight?: boolean }
) => {
  if (!s) return s
  const unit = getUnit(s)
  const n = parseFloat(s)
  const { isEditMode = false, isSection = false, isHeight = true } = options || {}
  switch (unit) {
    case '%':
      return isEditMode
        ? isSection
          ? `${useDisplayStore().device[isHeight ? 'height' : 'width'] * (n / 100)}px`
          : s
        : isSection
        ? `${n}${isHeight ? 'vh' : 'vw'}`
        : s
    case 'rem':
      return isEditMode ? `${useDisplayStore().device.fontSize * n}px` : s
    case 'px':
    default:
      return s
  }
}

/** TODO: 转换格式时，保持现有宽高不变 */
export const covertSizeToOtherUnit = (n: number, oldUnit: string, newUnit: string): number => {
  if (!n || !isUnitType(oldUnit) || !isUnitType(newUnit)) return n
  if (oldUnit === 'px' && newUnit === 'rem') return fixedPointToNumber(n / useDisplayStore().curFootSize)
  if (oldUnit === 'rem' && newUnit === 'px') return fixedPointToNumber(n * useDisplayStore().curFootSize)
  return n
}
