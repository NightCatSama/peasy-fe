import { onBeforeUnmount, reactive, Ref, watch } from 'vue'
import type { IProps } from './common'
import { getPositionTransform } from './style'

export type AnimationMapType = Map<
  IAnimationItem,
  {
    animationName: string
    disabled: boolean
    isAnimate?: boolean
  }
>

export const useIntersectionObserver = (
  target: HTMLElement,
  setIsIntersection: (isIntersecting: boolean) => void
) => {
  // 当观察到变动时执行的回调函数
  const callback: IntersectionObserverCallback = function (entries, observer) {
    if (entries[0].isIntersecting) {
      setIsIntersection(true)
    } else if (entries[0].boundingClientRect.top >= 0) {
      setIsIntersection(false)
    }
  }

  // 创建一个观察器实例并传入回调函数
  const observer = new IntersectionObserver(callback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.0,
  })

  observer.observe(target)

  return observer
}

/**
 * Animation 处理流程：
 * 1. 遍历 animationList 列表生成 {name} + {keyframes} 的样式表，更新到页面中
 * 2. 将对应的 animation 和 {name} + {disabled} 的添加到 animationMap 中
 * 3. 绑定对应的事件去更新 animationMap 中的 disabled 值
 * 4. 返回 animationMap 用于组件中获取
 */
export const useAnimation = (propsRef: IProps, el: Ref<HTMLDivElement | null>) => {
  const animation = $computed(() => propsRef.animation)
  const position = $computed(() => propsRef.position)
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)
  let observer = $ref<IntersectionObserver | null>(null)
  let removeListenerList: (() => void)[] = $ref([])
  let animationMap: AnimationMapType = reactive(
    new Map<IAnimationItem, { animationName: string; disabled: boolean, isAnimate?: boolean }>()
  )
  let isBindClick = $ref(false)
  let isBindHover = $ref(false)

  const onBindIntersectionObserver = (el: HTMLElement) => {
    if (observer) return
    observer = useIntersectionObserver(el, (isIntersecting) => {
      animationMap.forEach((item, anim) => {
        if (isIntersecting) {
          if (item.isAnimate) return
          item.isAnimate = true
          setTimeout(() => (item.isAnimate = false), (anim.duration + anim.delay) * 1000)
        }
        if (anim.trigger === 'scrollIntoView') {
          item.disabled = !isIntersecting
        }
      })
    })
    removeListenerList.push(() => observer?.disconnect())
  }

  const onBindClick = (el: HTMLElement) => {
    if (isBindClick) return
    isBindClick = true
    const clickHandler = (e: MouseEvent) => {
      animationMap.forEach((item, anim) => {
        if (anim.trigger === 'click' && item.disabled) {
          item.disabled = false
          setTimeout(() => (item.disabled = true), (anim.duration + anim.delay) * 1000)
        }
      })
    }
    el.addEventListener('click', clickHandler, true)
    removeListenerList.push(() => el.removeEventListener('click', clickHandler))
  }

  const onBindHover = (el: HTMLElement) => {
    if (isBindHover) return
    isBindHover = true
    const hoverHandler = (e: MouseEvent) => {
      animationMap.forEach((item, anim) => {
        if (anim.trigger === 'hover' && item.disabled) {
          item.disabled = false
        }
      })
    }
    const leaveHandler = (e: MouseEvent) => {
      animationMap.forEach((item, anim) => {
        if (anim.trigger === 'hover' && !item.disabled) {
          item.disabled = true
        }
      })
    }
    el.addEventListener('mouseenter', hoverHandler, true)
    el.addEventListener('mouseleave', leaveHandler, true)
    removeListenerList.push(() => {
      el.removeEventListener('mouseenter', hoverHandler)
      el.removeEventListener('mouseleave', leaveHandler)
    })
  }

  watch(
    () => [animation, position, el],
    () => {
      if (!animation?.animationList?.length || el.value === null) {
        animationMap.clear()
        return
      }
      // 初始化动态样式表
      if (!dynamicAnimationStyles) {
        dynamicAnimationStyles = document.createElement('style')
        document.head.appendChild(dynamicAnimationStyles)
        removeListenerList.push(() => document.head.removeChild(dynamicAnimationStyles!))
      }

      const animationList = animation?.animationList as IAnimationItem[]
      let stylesheet = ''
      let bindEvents: { [key in IAnimationItem['trigger']]?: any } = {}

      animationList.forEach((anim) => {
        bindEvents[anim.trigger] = true
        const animName = getAnimateName(anim)
        const keyframeBody = getKeyframeBody(anim, position)
        const keyframe = getKeyframe(animName, keyframeBody)
        stylesheet += keyframe
        animationMap.set(anim, { animationName: animName, disabled: anim.trigger !== 'always', isAnimate: false })
      })

      dynamicAnimationStyles.innerHTML = stylesheet

      if (bindEvents['scrollIntoView'] && el.value) {
        onBindIntersectionObserver(el.value)
      }
      if (bindEvents['click'] && el.value) {
        onBindClick(el.value)
      }
      if (bindEvents['hover'] && el.value) {
        onBindHover(el.value)
      }
    },
    { deep: true, immediate: true }
  )

  onBeforeUnmount(() => removeListenerList.forEach((fn) => fn()))

  return {
    animationMap,
  }
}

/** 根据 IAnimationItem 获得 keyframes 题 */
function getKeyframeBody(anim: IAnimationItem, position: IPosition) {
  let setting
  if (anim.name === 'fade') {
    setting = anim.settings.fade
    return `
      from {
        opacity: ${setting?.opacity ?? 1};
      }
    `
  }
  if (anim.name.startsWith('slide')) {
    setting = anim.settings.slide
    const offset = setting?.offset ?? 100
    let x = anim.name === 'slide-left' ? offset : anim.name === 'slide-right' ? -offset : 0
    let y = anim.name === 'slide-up' ? offset : anim.name === 'slide-down' ? -offset : 0
    const { horizontal, vertical } = getPositionTransform(position)
    return `
      from {
        transform: translate(${x + (horizontal?.center ? -50 : 0)}%, ${
      y + (vertical?.center ? -50 : 0)
    }%);
        opacity: ${setting?.opacity ?? 1};
      }
    `
  }
  if (anim.name.startsWith('zoom')) {
    setting = anim.settings.zoom
    const zoom = setting?.zoom ?? 1
    const { transform } = getPositionTransform(position)
    return `
      from {
        transform: scale(${anim.name === 'zoom-in' ? 1 - zoom : 1 + zoom})${
      transform ? ` ${transform}` : ''
    };
        opacity: ${setting?.opacity ?? 1};
      }
    `
  }
  if (anim.name.startsWith('rotate')) {
    setting = anim.settings.rotate
    const angle = setting?.angle ?? 0
    const { transform } = getPositionTransform(position)
    return `
      from {
        transform: rotate${anim.name === 'rotate-x' ? 'X' : 'Y'}(${angle}deg)${
      transform ? ` ${transform}` : ''
    };
        opacity: ${setting?.opacity ?? 1};
      }
    `
  }
  return ''
}

/** 组合 name 和 keyframes */
function getKeyframe(keyframeName: string, keyframeBody: string) {
  if (!keyframeBody || !keyframeName) return ''

  let keyframe = `@keyframes ${keyframeName} {
    ${keyframeBody}
  }`
  return keyframe.replace(/\n/g, '').replace(/\s+/g, ' ')
}

/** 获得一个唯一的 animation name */
let uniqueId = 0
const uniqueMap = new WeakMap()
export const getAnimateName = (anim: IAnimationItem) => {
  let id
  if (uniqueMap.has(anim)) {
    id = uniqueMap.get(anim)
  } else {
    id = uniqueId++
    uniqueMap.set(anim, id)
  }
  return `__${anim.name}-${id}__`
}
