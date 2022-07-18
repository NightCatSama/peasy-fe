<script setup lang="ts">
import { nextTick } from 'vue'
import draggable from 'vuedraggable'

import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { storeToRefs } from 'pinia'
import Element from './widgets/Element.vue'
import { useDragStore } from '@/stores/drag'
import { DisplayMode, useDisplayStore } from '@/stores/display'

const pageStore = usePageStore()
const { pageData, modelData } = storeToRefs(pageStore)
const { addSection } = pageStore

const dragStore = useDragStore()
const { setDragNode } = dragStore

const displayStore = useDisplayStore()
const { displayMode } = storeToRefs(displayStore)
const { setDisplayMode } = displayStore

let preDisplayMode = $ref<DisplayMode>('edit')

const handleAddSection = (template: CNode) => {
  let noPageData = pageData.value.length === 0

  if (template.type === 'section') {
    addSection({ ...template, name: template.name + `${~~(Math.random() * 100)}` })
  }

  noPageData && nextTick(() => emitter.emit('location', true))
}

const handleDragend = () => {
  setDragNode(null)
  setDisplayMode(preDisplayMode)
}

const handleDragStart = (event: DragEvent, data: CNode) => {
  const imgElem = (event.target as HTMLDivElement).querySelector('.image') as HTMLDivElement;
  event.dataTransfer!.setDragImage(imgElem, imgElem.offsetWidth / 2, imgElem.offsetHeight / 2)
  setDragNode(data)
  preDisplayMode = displayMode.value
  setDisplayMode('drag')
}
</script>

<template>
  <div class="materials-panel">
    <section v-for="(list, key) in modelData" v-show="key !== 'template'">
      <div class="title">{{ key.toLocaleUpperCase() }}</div>
      <draggable
        class="element-list"
        tag="div"
        :model-value="list"
        :sort="false"
        :item-key="'name'"
        :group="{ name: key, pull: 'clone', put: false }"
        @end="handleDragend"
      >
        <template #item="{ element: item }">
          <div
            class="element-item"
            :key="item.name"
            @dragstart="(event: DragEvent) => handleDragStart(event, item)"
          >
            <Element
              :cover="item.cover"
              :name="item.name"
              @click="handleAddSection(item)"
            ></Element>
          </div>
        </template>
      </draggable>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.materials-panel {
  position: relative;
  width: 320px;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  background: $panel;
  padding: 12px 16px;

  .title {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: bold;
    color: $yellow;
  }

  .element-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .element-item {
    margin-bottom: 15px;
    width: 50%;
    height: 120px;
    padding: 8px;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:nth-child(2n) {
      padding-right: 0;
    }

    > .element {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
