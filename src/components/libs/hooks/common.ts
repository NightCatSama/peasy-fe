import { ComponentName, getTagClassName, getUniqueName, GroupPropType, PageNode } from '@/config'
import { getIsEditMode } from '@/utils/context'
import { computed, onBeforeMount, onMounted, reactive, ref } from 'vue'
import { useAnimation } from './animation'
import { useEffect } from './effect'
import { useEvent } from './event'
import { useScrollByOffset } from './position'
import {
  useAnimationStyle,
  useBackgroundStyle,
  useBorderStyle,
  useCodeStyle,
  useContainerStyle,
  useEffectStyle,
  useFontStyle,
  useIconBasicStyle,
  useImageBasicStyle,
  useLayoutStyle,
  usePositionStyle,
  useSizeStyle,
  useSpacingStyle,
  useStyle,
  useTextBasicStyle,
} from './style'

export type IProps<T extends ComponentName = any> = {
  inheritAttrs?: any
  tags: string[]
  componentName: string
  direction?: 'row' | 'column'
  /** 子元素的名字列表，目前用于 Text 子文本查找 */
  children?: PageNode<any>[]
} & GroupPropType<T>

/** 所有基础组件的公共处理逻辑 */
export const useProps = <T extends IProps<any> = IProps>(props: T, componentTypeName?: string) => {
  const propsRef = reactive(props)
  const elem = ref<HTMLDivElement | null>(null)
  const isEditMode = getIsEditMode()

  useEvent(propsRef, elem)
  const { animationMap } = useAnimation(propsRef, elem)
  useEffect(propsRef)

  if (propsRef?.position?.position === 'fixed' && propsRef?.position?.showByOffset) {
    useScrollByOffset(
      propsRef.position.showByOffset,
      (show: boolean) => (propsRef.common.hide = !show)
    )
  }

  const styleMap = computed(() => ({
    basic:
      componentTypeName === 'Text'
        ? useTextBasicStyle(propsRef.basic)
        : componentTypeName === 'Image'
        ? useImageBasicStyle(propsRef.basic)
        : componentTypeName === 'Icon'
        ? useIconBasicStyle(propsRef.basic)
        : {},
    font: useFontStyle(propsRef.font),
    layout: useLayoutStyle(propsRef.layout),
    size: useSizeStyle(propsRef.size, propsRef.direction),
    spacing: useSpacingStyle(propsRef.spacing),
    border: useBorderStyle(propsRef.border),
    background: useBackgroundStyle(propsRef.background),
    container: useContainerStyle(propsRef.container),
    position: usePositionStyle(propsRef.position),
    animation: useAnimationStyle(animationMap),
    effect: useEffectStyle(propsRef.effect, propsRef.componentName),
    common: propsRef.common.hide ? { display: 'none' } : null,
    code: useCodeStyle(propsRef.code),
  }))

  const style = computed(() =>
    useStyle({
      ...styleMap.value.basic,
      ...styleMap.value.font,
      ...styleMap.value.layout,
      ...styleMap.value.size,
      ...styleMap.value.spacing,
      ...styleMap.value.border,
      ...styleMap.value.background,
      ...styleMap.value.container,
      ...styleMap.value.position,
      ...styleMap.value.animation,
      ...styleMap.value.effect,
      ...styleMap.value.common,
      ...styleMap.value.code,
    })
  )

  const uName = computed(() => getUniqueName(propsRef.componentName))
  const tagClassNames = computed(() => propsRef.tags.map((tag) => getTagClassName(tag)))

  onMounted(() => {
    if (!elem.value) return
    ;(elem.value as any).__node__ = props
    if (props.code?.script && !isEditMode) {
      const args = '...args'
      const fn = new Function(
        args,
        `var [
        elem,
        props,
      ] = args;${props.code.script}`
      )
      fn(elem.value, propsRef)
    }
  })

  onBeforeMount(() => {
    if (!elem.value) return
    delete (elem.value as any).__node__
  })

  return {
    elem,
    styleMap,
    style,
    uName,
    tagClassNames,
    props: propsRef,
  }
}
