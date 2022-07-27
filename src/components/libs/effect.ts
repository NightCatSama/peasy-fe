import { onBeforeUnmount, ref, watch } from "vue"

export const effectName2PropertyMap: { [name: string]: string } = {
  color: 'color',
  fontSize: 'font-size',
  borderColor: 'border-color',
  backgroundColor: 'background-color',
  opacity: 'opacity',
}

export const selectorPriority: { [selector: string]: number } = {
  hover: 1,
  active: 2,
}

export const useEffect = (effect: IEffect) => {
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)
  let removeListenerList = $ref<(() => void)[]>([])
  let className = ref<string>('')

  watch(() => effect.effectList, () => {
    if (!effect?.effectList?.length) {
      return
    }
    className.value = getEffectClassName(effect)
    // 初始化动态样式表
    if (!dynamicAnimationStyles) {
      dynamicAnimationStyles = document.createElement('style');
      document.head.appendChild(dynamicAnimationStyles);
      removeListenerList.push(() => document.head.removeChild(dynamicAnimationStyles!))
    }

    const effectList = effect.effectList as IEffectItem[]
    let styles: { [selector: string]: string[] } = {}

    effectList.forEach(item => {
      if (!Object.keys(item?.styles).length) return
      Object.entries(item?.styles).forEach(([key, value]) => {
        if (!styles[key]) styles[key] = []
        styles[key].push(`${effectName2PropertyMap[item.name]}: ${value}!important;`)
      })
    })

    dynamicAnimationStyles.innerHTML = Object.entries(styles)
      .sort(([a], [b]) => selectorPriority[a] - selectorPriority[b])
      .map(([selector, styleList]) => `.${className.value}:${selector} { ${styleList.join('')} }`)
      .join('\n')
  }, { immediate: true, deep: true })

  onBeforeUnmount(() => removeListenerList.forEach(fn => fn()))

  return { className }
}

/** 获得一个唯一的 effect class name */
let uniqueId = 0
const uniqueMap = new WeakMap()
export const getEffectClassName = (effect: IEffect) => {
  let id
  if (uniqueMap.has(effect)) {
    id = uniqueMap.get(effect)
  } else {
    id = uniqueId++
    uniqueMap.set(effect, id)
  }
  return `__effect-${id}__`
}