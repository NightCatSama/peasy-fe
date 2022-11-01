<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getUniqueName } from '@/config'
import { getIsEditMode } from '@/utils/context'
import { escapeHtml } from '@/utils/xss'
import { nextTick, useAttrs, watch } from 'vue'
import { IProps, useProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Text'>,
  'Text'
)

const classNames = $computed(() => ['text', uName.value, ...tagClassNames.value])

const nextProcessFn: any = getIsEditMode() ? nextTick : setTimeout

watch(
  () => [props],
  () => {
    // 若有子节点，则需要在渲染完成之后
    // 从 text-children 中取出节点渲染到 text-content 中
    if (!props.basic.isSonText && props.children) {
      nextProcessFn(() => {
        if (!elem.value) return
        const textElem = elem.value.querySelector('.text-content') as HTMLElement
        const textChildElem = elem.value.querySelector('.text-children') as HTMLElement
        props.children?.forEach((child, index) => {
          const beReplaceElem = textElem.querySelector('[data-textchild="' + index + '"]')
          const replaceElem = textChildElem.querySelector('#' + getUniqueName(child.name))
          if (beReplaceElem && replaceElem) {
            const newNode = replaceElem.cloneNode(true) as HTMLElement
            newNode.dataset.textchild = '' + index
            newNode.classList.remove('lib-component')
            newNode.style.pointerEvents = 'none'
            textElem.replaceChild(newNode, beReplaceElem)
          }
        })
      })
    }
  },
  { immediate: true, deep: true }
)

const renderText = $computed(() => {
  let text = escapeHtml(props.basic.text)
  if (!elem.value) return text
  const textChild = text.match(/{{(\d+?)}}/gi) || []
  textChild.forEach((t: string) => {
    const index = parseInt(t.slice(2, -2))
    if (!props?.children?.[index - 1]) return
    const reg = new RegExp('{{(' + index + ')}}', 'ig')
    text = text.replace(reg, `<span data-textchild="${index - 1}"></span>`)
  })
  return text
})
</script>

<template>
  <div ref="elem" :style="style" :class="classNames" :id="uName" v-bind="props.inheritAttrs">
    <span class="text-content" v-html="renderText"></span>
    <div v-if="!props.basic.isSonText" class="text-children"><slot></slot></div>
  </div>
</template>

<style lang="scss" scoped>
.text {
  display: inline-block;
}
.text-children {
  display: none;
}
</style>
