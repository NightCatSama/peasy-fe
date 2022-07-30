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
  const {
    componentName: name,
    direction,
    tags,
    basic,
    font,
    layout,
    size,
    spacing,
    border,
    background,
    container,
    position,
    event,
    effect,
    animation,
  } = props

  const elem = ref<HTMLDivElement | null>(null)

  const propsRef = reactive(props)

  useEvent(event, elem)

  const { animationMap } = useAnimation(animation, elem, position)

  useEffect(effect, name)

  const style = computed(() =>
    useStyle({
      ...(
        componentTypeName === 'Image'
          ? useImageBasicStyle(basic)
          : componentTypeName === 'Icon'
            ? useIconBasicStyle(basic)
            : {}
      ),
      ...useFontStyle(font),
      ...useLayoutStyle(layout),
      ...useSizeStyle(size),
      ...useSpacingStyle(spacing),
      ...useBorderStyle(border),
      ...useBackgroundStyle(background),
      ...useContainerStyle(container),
      ...usePositionStyle(position),
      ...useAnimationStyle(animationMap),
      ...useEffectStyle(effect, name)
    })
  )

  const uName = computed(() => getUniqueName(name))
  const tagClassNames = computed(() => propsRef.tags.map(tag => getTagClassName(tag)))

  return {
    elem,
    style,
    uName,
    tagClassNames,
    props: propsRef,
  }
}