import { ComponentName, getTagClassName, getUniqueName, GroupPropType } from "@/config"
import { computed, reactive, ref } from "vue"
import { useAnimation } from "./animation"
import { useEffect } from "./effect"
import { useEvent } from "./event"
import { useAnimationStyle, useBackgroundStyle, useBorderStyle, useContainerStyle, useEffectStyle, useFontStyle, useIconBasicStyle, useImageBasicStyle, useLayoutStyle, usePositionStyle, useSizeStyle, useSpacingStyle, useStyle } from "./style"

export type IProps<T extends ComponentName = any> = {
  inheritAttrs?: any
  tags: string[]
  componentName: string
  direction?: 'row' | 'column'
} & GroupPropType<T>

export const useProps = <T extends IProps<any> = IProps>(props: T, componentTypeName: string) => {
  const propsRef = reactive(props)
  const elem = ref<HTMLDivElement | null>(null)

  useEvent(propsRef.event, elem)

  const { animationMap } = useAnimation(propsRef.animation, elem, propsRef.position)

  useEffect(propsRef.effect, propsRef.componentName)

  const style = computed(() =>
    useStyle({
      ...(
        componentTypeName === 'Image'
          ? useImageBasicStyle(propsRef.basic)
          : componentTypeName === 'Icon'
            ? useIconBasicStyle(propsRef.basic)
            : {}
      ),
      ...useFontStyle(propsRef.font),
      ...useLayoutStyle(propsRef.layout),
      ...useSizeStyle(propsRef.size, propsRef.direction),
      ...useSpacingStyle(propsRef.spacing),
      ...useBorderStyle(propsRef.border),
      ...useBackgroundStyle(propsRef.background),
      ...useContainerStyle(propsRef.container),
      ...usePositionStyle(propsRef.position),
      ...useAnimationStyle(animationMap),
      ...useEffectStyle(propsRef.effect, propsRef.componentName)
    })
  )

  const uName = computed(() => getUniqueName(propsRef.componentName))
  const tagClassNames = computed(() => propsRef.tags.map(tag => getTagClassName(tag)))

  return {
    elem,
    style,
    uName,
    tagClassNames,
    props: propsRef,
  }
}