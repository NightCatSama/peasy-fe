<script setup lang="ts">
import { DataStatus, IMaterialItem } from '@/config'
import { $t, getMaterialCategory, getMaterialName } from '@/constants/i18n'
import {
  useDisplayStoreHelper,
  useDragStoreHelper,
  usePageStoreHelper,
  useUserStoreHelper,
} from '@/hooks/store'
import { DisplayMode } from '@/stores/display'
import { Alert } from '@/utils/alert'
import { emitter } from '@/utils/event'
import { BuiltInComponent, BuiltInSection } from '@/utils/mock'
import draggable from 'vuedraggable'
import { Modal } from './modal'
import SaveMaterialModal from './modal/SaveMaterialModal.vue'
import Element from './widgets/Element.vue'
import Tabs from './widgets/Tabs.vue'

const { pageData, materialData, addSection, deleteMaterial } = usePageStoreHelper()

const { setDragNode, setIsCancelDrag } = useDragStoreHelper()

const { displayMode, setDisplayMode } = useDisplayStoreHelper()

const { isAdmin, uid } = useUserStoreHelper()

let preDisplayMode = $ref<DisplayMode>('edit')

let currentType = $ref('section')
let draggableRef = $ref<any>(null)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)

const handleAddSection = (material: IMaterialItem) => {
  const node = material.node
  if (node?.type === 'section') {
    if (material.uid === uid.value) {
      node.materialId = material.id
    }
    addSection(node)
  }
}

const handleDragend = () => {
  setDragNode(null)
  setDisplayMode(preDisplayMode)
  setIsCancelDrag(false)
}

const handleDragStart = (event: DragEvent, material: IMaterialItem) => {
  const imgElem = (event.target as HTMLDivElement).querySelector('.image') as HTMLDivElement
  const node = material.node
  if (!node) return
  event.dataTransfer!.setDragImage(imgElem, 0, 0)
  if (node.type === 'component' && pageData.value.length === 0) {
    Alert($t('noSectionTip'))
  }
  if (material.uid === uid.value) {
    node.materialId = material.id
  }
  setDragNode(node)
  preDisplayMode = displayMode.value
  setDisplayMode('drag')
  setTimeout(() => emitter.emit('switchMaterialsPanel', false), 100)
}

const handleDelete = async (item: IMaterialItem) => {
  if (await Modal.confirm($t('deleteConfirm', getMaterialName(item)))) {
    await deleteMaterial(item.id!)
    Alert($t('deleteSuccess'))
  }
}

const currentNodeList = $computed(() => {
  const list = (materialData.value as any)[currentType]
  if (isAdmin.value) {
    if (currentType === 'section') {
      return [...list, ...BuiltInSection]
    }
    if (currentType === 'component') {
      return [...list, ...BuiltInComponent]
    }
  }
  return list
})
const currentCategory = $computed(() => {
  let map: { [category: string]: IMaterialItem[] } = {}
  currentNodeList.forEach((item: IMaterialItem) => {
    const category = getMaterialCategory(item) || $t('notGroup')
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
            :class="['element-item', { 'status-hidden': (item as IMaterialItem).status === DataStatus.Hidden }]"
            :key="item.name"
            @dragstart="(event: DragEvent) => handleDragStart(event, item as IMaterialItem)"
          >
            <Element
              :cover="item.cover"
              :name="getMaterialName(item)"
              :can-operate="isAdmin || item.uid === uid"
              @click="handleAddSection(item as IMaterialItem)"
              @delete="handleDelete(item)"
              @edit="
                () => {
                  curMaterial = item
                  showSaveMaterialModal = true
                }
              "
            ></Element>
          </div>
        </template>
      </draggable>
    </section>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="$t('edit')"
      :material="curMaterial"
      hide-create-cover
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

    &.status-hidden {
      color: lighten($red, 20%);
    }

    > .element {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
