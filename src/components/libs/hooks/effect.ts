import { getTagClassName, getUniqueName } from '@/config'
import { onBeforeUnmount, reactive, ref, watch } from 'vue'
import { getColor } from './color'
import type { IProps } from './common'

export const effectName2PropertyMap: { [name: string]: string } = {
  color: 'color',
  fontSize: 'font-size',
  borderColor: 'border-color',
  backgroundColor: 'background-color',
  opacity: 'opacity',
  hide: 'display',
  blur: 'filter',
  transform: 'transform',
  custom: '',
}

export const covertValue = (name: string, value: any) => {
  if (name === 'blur') {
    return `blur(${value}px)`
  }
  return value
}

export const selectorPriority: { [selector: string]: number } = {
  hover: 1,
  active: 2,
  focus: 3,
}

export const useEffect = (propsRef: IProps<any>) => {
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)
  let removeListenerList = $ref<(() => void)[]>([])
  const effect = $computed(() => propsRef.effect)

  watch(
    () => effect,
    () => {
      if (!effect?.effectList?.length) {
        if (dynamicAnimationStyles) dynamicAnimationStyles.innerHTML = ''
        return
      }
      const uName = getUniqueName(propsRef.componentName)
      // 初始化动态样式表
      if (!dynamicAnimationStyles) {
        dynamicAnimationStyles = document.createElement('style')
        document.head.appendChild(dynamicAnimationStyles)
        removeListenerList.push(() => document.head.removeChild(dynamicAnimationStyles!))
      }

      const effectList = effect.effectList as IEffectItem[]
      let styles: { style: string; priority: number }[] = []

      effectList.forEach((item) => {
        if (!Object.keys(item?.styles).length) return
        Object.entries(item?.styles).forEach(([key, val]) => {
          let value = getColor(val)
          if (item.name === 'hide') {
            if (value) value = 'none'
            else value = 'flex'
          }
          if (item?.targetType === 'self') {
            styles.push({
              priority: selectorPriority[key] || 0,
              style: `#${uName}:${key} { ${getEffectStyle(item, value)} }`,
            })
          }
          if (item?.targetType === 'name') {
            styles.push({
              priority: selectorPriority[key] || 0,
              style: `.${uName}:${key} .${getUniqueName(item.target)} { ${getEffectStyle(
                item,
                value
              )} }`,
            })
          }
          if (item?.targetType === 'tag') {
            styles.push({
              priority: selectorPriority[key] || 0,
              style: `.${uName}:${key} .${getTagClassName(item.target)} { ${getEffectStyle(
                item,
                value
              )} }`,
            })
          }
        })
      })
      styles.sort((a, b) => a.priority - b.priority)
      dynamicAnimationStyles.innerHTML = styles.map((s) => s.style).join('\n')
    },
    { immediate: true, deep: true }
  )

  onBeforeUnmount(() => removeListenerList.forEach((fn) => fn()))
}

export const getEffectStyle = (item: IEffectItem, value: string) => {
  if (item.name === 'custom') {
    return `${value}!important;`
  } else {
    return `${effectName2PropertyMap[item.name]}: ${covertValue(item.name, value)}!important;`
  }
}
