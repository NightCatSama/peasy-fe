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
    console.log('animationList', animationList)
    animationList.forEach((anim) => {
      const animName = getAnimateName(anim)
      const keyframeBody = getKeyframeBody(anim)
      const keyframe = getKeyframe(animName, keyframeBody)
      stylesheet += keyframe
    })
    console.log('stylesheet', stylesheet)
    dynamicAnimationStyles.innerHTML = stylesheet
  }, { deep: true, immediate: true })
}

function getKeyframeBody(anim: IAnimationItem) {
  let setting
  switch (anim.name) {
    case 'fade':
      setting = anim.settings.fade!
      return `
        from {
          opacity: ${setting.opacity};
        }
      `
     case 'slide-up':
      setting = anim.settings["slide-up"]!
      return `
        from {
          opacity: ${setting.opacity};
          transform: translateY(-${setting.offset}px);
        }
      `
     default:
      return ''
  }
}

function getKeyframe(keyframeName: string, keyframeBody: string) {
  if (!keyframeBody || !keyframeName) return ''

  let keyframe = `@keyframes ${keyframeName} {
    ${keyframeBody}
  }`
  return keyframe.replace(/\n/g, '').replace(/\s+/g, ' ')
}
