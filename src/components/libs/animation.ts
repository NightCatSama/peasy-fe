import type { PageNode } from "@/config"
import { getIsEditMode } from "@/utils/context"
import { onBeforeMount, onBeforeUnmount, onMounted, reactive, Ref, ref, watch } from "vue"

export type AnimationMapType = Map<IAnimationItem, {
  animationName: string;
  disabled: boolean;
}>

export const useIntersectionObserver = (target: HTMLElement, setIsIntersection: (isIntersecting: boolean) => void) => {
  // 当观察到变动时执行的回调函数
  const callback: IntersectionObserverCallback = function(entries, observer) {
    if (entries[0].isIntersecting) {
      setIsIntersection(true)
    } else if (entries[0].boundingClientRect.top >= 0) {
      setIsIntersection(false)
    }
  };

  // 创建一个观察器实例并传入回调函数
  const observer = new IntersectionObserver(callback, {
    root: document.body,
    rootMargin: '0px',
    threshold: 0.0
  });

  observer.observe(target);

  return observer
}

/**
 * Animation 处理流程：
 * 1. 遍历 animationList 列表生成 {name} + {keyframes} 的样式表，更新到页面中
 * 2. 将对应的 animation 和 {name} + {disabled} 的添加到 animationMap 中
 * 3. 绑定对应的事件去更新 animationMap 中的 disabled 值
 * 4. 返回 animationMap 用于组件中获取
 */
export const useAnimation = (animation: IAnimation, name: string, el: Ref<HTMLDivElement | null>) => {
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)
  let observer = $ref<IntersectionObserver | null>(null)
  let removeListenerList: (() => void)[] = $ref([])
  let animationMap: AnimationMapType = reactive(new Map<IAnimationItem, { animationName: string; disabled: boolean }>())
  let isBindClick = $ref(false)
  let isBindHover = $ref(false)

  const onBindIntersectionObserver = (el: HTMLElement) => {
    if (observer) return
    observer = useIntersectionObserver(el, (isIntersecting) => {
      animationMap.forEach((handler, anim) => {
        if (anim.trigger === 'scrollIntoView') {
          handler.disabled = !isIntersecting
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
          setTimeout(() => item.disabled = true, anim.duration * 1000)
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
          setTimeout(() => item.disabled = true, anim.duration * 1000)
        }
      })
    }
    el.addEventListener('mouseenter', hoverHandler)
    removeListenerList.push(() => el.removeEventListener('mouseenter', hoverHandler))
  }

  watch(() => [animation, name], () => {
    if (!animation?.animationList?.length) {
      animationMap.clear()
      return
    }
    // 初始化动态样式表
    if (!dynamicAnimationStyles) {
      dynamicAnimationStyles = document.createElement('style');
      document.head.appendChild(dynamicAnimationStyles);
      removeListenerList.push(() => document.head.removeChild(dynamicAnimationStyles!))
    }

    const animationList = animation?.animationList as IAnimationItem[]
    let stylesheet = ''
    let bindEvents: { [key in IAnimationItem['trigger']]?: any } = {}

    animationList.forEach((anim) => {
      bindEvents[anim.trigger] = true
      const animName = getAnimateName(anim)
      const keyframeBody = getKeyframeBody(anim)
      const keyframe = getKeyframe(animName, keyframeBody)
      stylesheet += keyframe
      animationMap.set(anim, { animationName: animName, disabled: anim.trigger !== 'always' })
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
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => removeListenerList.forEach(fn => fn()))

  return {
    animationMap,
  }
}

/** 根据 IAnimationItem 获得 keyframes 题 */
function getKeyframeBody(anim: IAnimationItem) {
  let setting
  if (anim.name === 'fade') {
    setting = anim.settings.fade
    return `
      from {
        opacity: ${setting?.opacity || 0};
      }
    `
  }
  if (anim.name.startsWith('slide')) {
    setting = anim.settings[anim.name as 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down']
    const offset = setting?.offset || 100
    let x = anim.name === 'slide-left' ? offset : anim.name === 'slide-right' ? -offset : 0
    let y = anim.name === 'slide-up' ? offset : anim.name === 'slide-down' ? -offset : 0
    return `
      from {
        transform: translate(${x}%, ${y}%);
        opacity: ${setting?.opacity || 0};
      }
    `
  }
  if (anim.name.startsWith('zoom')) {
    setting = anim.settings[anim.name as 'zoom-in' | 'zoom-out']
    const zoom = setting?.zoom || 1
    return `
      from {
        transform: scale(${zoom});
        opacity: ${setting?.opacity || 0};
      }
    `
  }
  if (anim.name.startsWith('rotate')) {
    setting = anim.settings[anim.name as 'rotate-x' | 'rotate-y']
    const angle = setting?.angle || 0
    return `
      from {
        transform: rotate${anim.name === 'rotate-x' ? 'X' : 'Y'}(${angle}deg);
        opacity: ${setting?.opacity || 0};
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
  return `${anim.name}-${id}`
}