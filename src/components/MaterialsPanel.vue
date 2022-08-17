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
import { Alert, AlertError } from '@/utils/alert'
import { useUserStore } from '@/stores/user'
import { Modal } from './modal'
import { materialApi } from '@/utils/mande'
import SaveMaterialModal from './modal/SaveMaterialModal.vue'
import { $t, lang } from '@/constants/i18n'

const pageStore = usePageStore()
const { pageData, materialData } = storeToRefs(pageStore)
const { addSection, deleteMaterial } = pageStore

const dragStore = useDragStore()
const { setDragNode, setIsCancelDrag } = dragStore

const displayStore = useDisplayStore()
const { displayMode } = storeToRefs(displayStore)
const { setDisplayMode } = displayStore

const userStore = useUserStore()
const { isAdmin, uid } = storeToRefs(userStore)

let preDisplayMode = $ref<DisplayMode>('edit')

let currentType = $ref('section')
let draggableRef = $ref<any>(null)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)

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
  if (data.type === 'component' && pageData.value.length === 0) {
    Alert($t('noSectionTip'))
  }
  setDragNode(data)
  preDisplayMode = displayMode.value
  setDisplayMode('drag')
  setTimeout(() => emitter.emit('switchMaterialsPanel', false), 100)
}

const handleDelete = async (item: IMaterialItem) => {
  if (await Modal.confirm($t('deleteConfirm', getName(item)))) {
    await deleteMaterial(item.id)
    Alert($t('deleteSuccess'))
  }
}

const getName = (item: IMaterialItem) => lang === 'en' && item.enName || item.name
const getCategory = (item: IMaterialItem) => lang === 'en' && item.categoryEn || item.category

const currentNodeList = $computed(() => (materialData.value as any)[currentType])
const currentCategory = $computed(() => {
  let map: { [category: string]: IMaterialItem[] } = {}
  currentNodeList.forEach((item: IMaterialItem) => {
    const category = getCategory(item) || $t('notGroup')
    if (!map[category]) map[category] = []
    map[category].push(item)
  })
  return map
})
</script>

<template>
  <div class="materials-panel">
    <Tabs
      class="materials-panel-tabs"
      :data="{ section: $t('section'), component: $t('component') }"
      v-model="currentType"
      type="float"
    ></Tabs>
    <section
      v-for="(list, category) in currentCategory"
      v-show="Array.isArray(list) && list.length > 0"
    >
      <div class="title">{{ category }}</div>
      <draggable
        ref="draggableRef"
        class="element-list"
        tag="div"
        :model-value="(list as IMaterialItem[])"
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
              :name="getName(item)"
              :can-operate="isAdmin || item.uid === uid"
              @click="handleAddSection(item.node)"
              @delete="handleDelete(item)"
              @edit="() => {
                curMaterial = item
                showSaveMaterialModal = true
              }"
            ></Element>
          </div>
        </template>
      </draggable>
    </section>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="$t('edit')"
      :material="curMaterial"
      v-model="showSaveMaterialModal"
    ></SaveMaterialModal>
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
    margin-top: 20px;
    font-size: 20px;
    font-weight: bold;
    padding: 0px 8px;
    color: $color;
  }

  .element-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .element-item {
    margin-bottom: 8px;
    width: 50%;
    height: 120px;
    padding: 8px;
    font-size: 12px;
    color: darken($color, 20%);
    display: flex;
    justify-content: center;
    align-items: center;

    > .element {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
