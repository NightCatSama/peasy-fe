<script setup lang="ts">
import { nextTick } from 'vue'
import draggable from 'vuedraggable'

import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { storeToRefs } from 'pinia'
import Element from './widgets/Element.vue'
import { useDragStore } from '@/stores/drag'
import { DisplayMode, useDisplayStore } from '@/stores/display'
import { PageNode, IMaterialItem } from '@/config'
import Tabs from './widgets/Tabs.vue'
import { Alert } from '@/utils/alert'

const pageStore = usePageStore()
const { pageData, materialData } = storeToRefs(pageStore)
const { addSection, deleteMaterial } = pageStore

const dragStore = useDragStore()
const { setDragNode, setIsCancelDrag } = dragStore

const displayStore = useDisplayStore()
const { displayMode } = storeToRefs(displayStore)
const { setDisplayMode } = displayStore

let preDisplayMode = $ref<DisplayMode>('edit')

let currentType = $ref('section')
let draggableRef = $ref<any>(null)

const handleAddSection = (template: PageNode) => {
  if (template.type === 'section') {
    addSection(template)
  }
}

const handleDragend = () => {
  setDragNode(null)
  setDisplayMode(preDisplayMode)
  setIsCancelDrag(false)
}

const handleDragStart = (event: DragEvent, data: PageNode) => {
  const imgElem = (event.target as HTMLDivElement).querySelector('.image') as HTMLDivElement
  event.dataTransfer!.setDragImage(imgElem, 0, 0)
  setDragNode(data)
  preDisplayMode = displayMode.value
  setDisplayMode('drag')
  setTimeout(() => emitter.emit('switchMaterialsPanel', false), 100)
}

const handleDelete = (item: IMaterialItem) => {
  deleteMaterial(item.id!)
  Alert('删除成功')
}

const currentNodeList = $computed(() => (materialData.value as any)[currentType]);
const tabData = $computed(() => ([
  {
    key: 'section',
    value: 'Section',
    active: currentType === 'section',
    onClick: (val: boolean) => val && (currentType = 'section')
  },
  {
    key: 'component',
    value: 'Component',
    active: currentType === 'component',
    onClick: (val: boolean) => val && (currentType = 'component')
  }
]))
</script>

<template>
  <div class="materials-panel">
    <Tabs
      class="materials-panel-tabs"
      :data="tabData"
      type="float"
    ></Tabs>
    <!-- <section v-for="(list, key) in materialData" v-show="key !== 'template'"> -->
      <!-- <div class="title">{{ currentType.toLocaleUpperCase() }}</div> -->
      <draggable
        ref="draggableRef"
        class="element-list"
        tag="div"
        :model-value="currentNodeList"
        :sort="false"
        :item-key="'id'"
        :group="{ name: currentType, pull: 'clone', put: false }"
        @end="handleDragend"
      >
        <template #item="{ element: item }">
          <div
            class="element-item"
            :key="item.name"
            @dragstart="(event: DragEvent) => handleDragStart(event, item.node)"
          >
            <Element
              :cover="item.cover"
              :name="item.name"
              :can-delete="true"
              @click="handleAddSection(item.node)"
              @delete="handleDelete(item)"
            ></Element>
          </div>
        </template>
      </draggable>
    <!-- </section> -->
  </div>
</template>

<style lang="scss" scoped>
.materials-panel {
  position: relative;
  width: $materials-panel-width;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  background: $panel;
  padding: 12px 16px;

  &-tabs {
    margin-bottom: 12px;
  }

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
