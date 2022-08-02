import { getTagClassName, getUniqueName } from '@/config'
import { onBeforeUnmount, ref, watch } from 'vue'
import { getColor } from './color'

export const effectName2PropertyMap: { [name: string]: string } = {
  color: 'color',
  fontSize: 'font-size',
  borderColor: 'border-color',
  backgroundColor: 'background-color',
  opacity: 'opacity',
  hide: 'display',
}

export const selectorPriority: { [selector: string]: number } = {
  hover: 1,
  active: 2,
}

export const useEffect = (effect: IEffect, name: string) => {
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)
  let removeListenerList = $ref<(() => void)[]>([])

  watch(
    () => effect.effectList,
    () => {
      if (!effect?.effectList?.length) {
        if (dynamicAnimationStyles) dynamicAnimationStyles.innerHTML = ''
        return
      }
      const uName = getUniqueName(name)
      // 初始化动态样式表
      if (!dynamicAnimationStyles) {
        dynamicAnimationStyles = document.createElement('style')
        document.head.appendChild(dynamicAnimationStyles)
        removeListenerList.push(() => document.head.removeChild(dynamicAnimationStyles!))
      }

      const effectList = effect.effectList as IEffectItem[]
      let styles: string[] = []

      effectList.forEach((item) => {
        if (!Object.keys(item?.styles).length) return
        Object.entries(item?.styles).forEach(([key, val]) => {
          let value = getColor(val)

          if (item.name === 'hide') {
            if (value) value = 'none'
            else value = 'flex'
          }
          if (item?.targetType === 'self') {
            styles[key === 'hover' ? 'unshift' : 'push'](
              `#${uName}:${key} { ${effectName2PropertyMap[item.name]}: ${value}!important; }`
            )
          }
          if (item?.targetType === 'name') {
            styles[key === 'hover' ? 'unshift' : 'push'](
              `.${uName}:${key} .${getUniqueName(item.target)} { ${
                effectName2PropertyMap[item.name]
              }: ${value}!important; }`
            )
          }
          if (item?.targetType === 'tag') {
            styles[key === 'hover' ? 'unshift' : 'push'](
              `.${uName}:${key} .${getTagClassName(item.target)} { ${
                effectName2PropertyMap[item.name]
              }: ${value}!important; }`
            )
          }
        })
      })

      dynamicAnimationStyles.innerHTML = styles.join('\n')
    },
    { immediate: true, deep: true }
  )

  onBeforeUnmount(() => removeListenerList.forEach((fn) => fn()))
}
