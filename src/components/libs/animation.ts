import type { PageNode } from "@/config"
import { watch } from "vue"

let uniqueId = 0
const map = new WeakMap()

export const getAnimateName = (anim: IAnimationItem) => {
  let id
  if (map.has(anim)) {
    id = map.get(anim)
  } else {
    id = uniqueId++
    map.set(anim, id)
  }
  return `${anim.name}-${id}`
}

export const useAnimation = (animation: IAnimation, name: string) => {
  let dynamicAnimationStyles = $ref<HTMLStyleElement | null>(null)

  watch(() => [animation, name], () => {
    if (!animation?.animationList?.length) return
    if (!dynamicAnimationStyles) {
      dynamicAnimationStyles = document.createElement('style');
      document.head.appendChild(dynamicAnimationStyles);
    }
    const animationList = animation?.animationList as IAnimationItem[]
    let stylesheet = ''
    animationList.forEach((anim) => {
      const animName = getAnimateName(anim)
      const keyframeBody = getKeyframeBody(anim)
      const keyframe = getKeyframe(animName, keyframeBody)
      stylesheet += keyframe
    })
    dynamicAnimationStyles.innerHTML = stylesheet
  }, { deep: true, immediate: true })
}

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

function getKeyframe(keyframeName: string, keyframeBody: string) {
  if (!keyframeBody || !keyframeName) return ''

  let keyframe = `@keyframes ${keyframeName} {
    ${keyframeBody}
  }`
  return keyframe.replace(/\n/g, '').replace(/\s+/g, ' ')
}
