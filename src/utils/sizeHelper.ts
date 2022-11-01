import { useDisplayStore } from '@/stores/display'
import { getIsEditMode } from './context'

export const isUnitType = (type: string): type is UnitType =>
  (['%', 'px', 'rem', 'vw', 'vh'] as UnitType[]).includes(type as unknown as UnitType)

export const getUnit = (s?: string): UnitType | '' => {
  if (!s || typeof s !== 'string') return ''
  if (s.slice(-3) === 'rem') {
    return 'rem'
  }
  if (s.slice(-2) === 'px') {
    return 'px'
  }
  if (s.slice(-2) === 'vw') {
    return 'vw'
  }
  if (s.slice(-2) === 'vh') {
    return 'vh'
  }
  if (s.slice(-1) === '%') {
    return '%'
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
  const nowUnit = getUnit(s)
  if (nowUnit !== 'px') return s
  else if (unit === 'px') return s
  else if (unit === 'rem')
    return `${fixedPointToNumber(parseFloat(s) / useDisplayStore().curFootSize)}rem`
  else if (unit === '%') return `${fixedPointToNumber((parseFloat(s) / (referSiz || 100)) * 100)}%`
  else if (unit === 'vw')
    return `${fixedPointToNumber(parseFloat(s) * (100 / useDisplayStore().device.width))}vw`
  else if (unit === 'vh')
    return `${fixedPointToNumber(parseFloat(s) * (100 / useDisplayStore().device.height))}vh`
  return s
}

/** 将各种格式的宽高转换成当前场景可用的样式 */
export const covertSize = (
  s?: string,
  options?: { isSection?: boolean; type?: 'width' | 'height' }
) => {
  if (!s) return s
  const unit = getUnit(s)
  const n = parseFloat(s)
  const { isSection = false, type = '' } = options || {}
  const isEditMode = getIsEditMode()
  switch (unit) {
    case '%':
      if (!type) return s
      // 如果是 Section 的宽高百分比，则特殊处理
      return isEditMode
        ? isSection
          ? `${useDisplayStore().device[type] * (n / 100)}px`
          : s
        : isSection
        ? `${n}${type === 'height' ? 'vh' : 'vw'}`
        : s
    case 'rem':
      return isEditMode ? `${useDisplayStore().curFootSize * n}px` : s
    case 'vw':
      return isEditMode ? `${n / (100 / useDisplayStore().device.width)}px` : s
    case 'vh':
      return isEditMode ? `${n / (100 / useDisplayStore().device.height)}px` : s
    case 'px':
    default:
      return s
  }
}
;(window as any).covertSize = covertSize

/** 转换格式时，保持原有数值不变 */
export const covertSizeToOtherUnit = (n: number, oldUnit: string, newUnit: string): number => {
  if (!n || !isUnitType(oldUnit) || !isUnitType(newUnit) || oldUnit === newUnit) return n
  if (oldUnit === 'px') {
    if (newUnit === 'rem') return fixedPointToNumber(n / useDisplayStore().curFootSize)
    if (newUnit === 'vw') return fixedPointToNumber(n * (100 / useDisplayStore().device.width))
    if (newUnit === 'vh') return fixedPointToNumber(n * (100 / useDisplayStore().device.height))
    return n
  }

  // 如果是其他格式进行转换，则先转为 px，再重复调用转换一次
  const toPx =
    oldUnit === 'rem'
      ? fixedPointToNumber(n * useDisplayStore().curFootSize)
      : oldUnit === 'vw'
      ? fixedPointToNumber(n / (100 / useDisplayStore().device.width))
      : oldUnit === 'vh'
      ? fixedPointToNumber(n / (100 / useDisplayStore().device.height))
      : n
  if (newUnit === 'vw' || newUnit === 'rem' || newUnit === 'vh')
    return covertSizeToOtherUnit(toPx, 'px', newUnit)
  return toPx
}
