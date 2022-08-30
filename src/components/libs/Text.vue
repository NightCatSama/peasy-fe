<script lang="ts">
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
import { getTextChildClassName, getUniqueName } from '@/config';
import { h, nextTick, onMounted, onUpdated, useAttrs, useSlots, watch } from 'vue'
import { useProps, IProps } from './hooks/common'

const { elem, uName, style, props, tagClassNames } = useProps(
  useAttrs() as unknown as IProps<'Text'>,
  'Text'
)

const classNames = $computed(() => ['text', uName.value, ...tagClassNames.value])

watch(() => [props.basic.text, props.children], () => {
  if (!props.basic.isSonText && props.children?.length) {
    nextTick(() => {
      if (!elem.value) return
      const textElem = elem.value.querySelector('.text') as HTMLElement
      const textChildElem = elem.value.querySelector('.text-children') as HTMLElement
      props.children?.forEach((c, index) => {
        const beReplaceElem = textElem.querySelector('[data-textchild="' + index + '"]')
        const replaceElem = textChildElem.querySelector('#' + getUniqueName(c.name))
        console.log('1 => ', beReplaceElem, replaceElem)
        if (beReplaceElem && replaceElem) {
          const newNode = replaceElem.cloneNode(true) as HTMLElement
          newNode.dataset.textchild = '' + index
          textElem.replaceChild(newNode, beReplaceElem)
        }
      })
    })
  }
}, { immediate: true, deep: true })

onUpdated(() => {
  if (props.basic.isSonText) {
    // nextTick(() => {
    //   if (!elem.value) return
    //   const parentElem = elem.value.parentElement as HTMLElement
    //   const textElem = elem.value.querySelector('.text') as HTMLElement
    //   const textChildElem = elem.value.querySelector('.text-children') as HTMLElement
    //   props.children?.forEach((c, index) => {
    //     const beReplaceElem = textElem.querySelector('[data-textchild="' + index + '"]')
    //     const replaceElem = textChildElem.querySelector('#' + getUniqueName(c.name))
    //     if (beReplaceElem && replaceElem) {
    //       textElem.replaceChild(replaceElem.cloneNode(true), beReplaceElem)
    //     }
    //   })
    // })
  }
})

const renderText = $computed(() => {
  let text = props.basic.text
  if (!elem.value) return text
  const textChild = text.match(/{{{(\d+?)}}}/ig) || []
  textChild.forEach((t: string) => {
    const index = parseInt(t.slice(3, -3)) || 0
    const reg = new RegExp('{{{(' + index + ')}}}', 'ig')
    text = text.replace(reg, `<span data-textchild="${index}"></span>`)
  })
  return text
})
</script>

<template>
  <div ref="elem" class="text-wrapper" :id="uName" v-bind="props.inheritAttrs">
    <span :style="style" :class="classNames" v-html="renderText"></span>
    <div v-if="!props.basic.isSonText" class="text-children"><slot></slot></div>
  </div>
</template>

<style lang="scss" scoped>
.text-wrapper {
  display: inline-block;
}
.text-children {
  display: none;
}
</style>
