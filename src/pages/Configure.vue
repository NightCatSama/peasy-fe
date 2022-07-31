<script setup lang="ts">
import { provide, onMounted, nextTick, watch, reactive } from 'vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

import ConfigSection from '@/components/ConfigSection.vue'
import { downloadHtml } from '@/utils/download'
import Sidebar from '@/components/Sidebar.vue'
import ConfigHeader from '@/components/ConfigHeader.vue'
import MaterialsPanel from '@/components/MaterialsPanel.vue'
import EditSection from '@/components/EditSection.vue'
import { emitter } from '@/utils/event'
import { useDisplayStore } from '@/stores/display'
import { useColorVars } from '@/components/libs/hooks/color'
import { useHistoryStore } from '@/stores/history'
import { useKeyPress } from 'ahooks-vue'
import { ShortcutKey } from '@/constants/shortcut'

const pageStore = usePageStore()
const { pageData, allPageData, colorVars } = storeToRefs(pageStore)
const { updateAllPageNode, getAssetsData, getPageData, download } = pageStore

const displayStore = useDisplayStore()
const { setDeviceByParent } = displayStore
const { device, displayMode } = storeToRefs(displayStore)

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory } = historyStore

const handleDownload = async () => {
  const res = await download()
  downloadHtml(res.data)
}

let showLeftPanel = $ref(false)

onMounted(() => {
  emitter.on('switchMaterialsPanel', (show?: boolean) => {
    showLeftPanel = show === void 0 ? !showLeftPanel : show
  })

  /** 记录编辑记录 */
  let inAction = false
  pageStore.$onAction(({ name, store, args, after }) => {
    if (
      !inAction &&
      [
        'getPageData',
        'insertNode',
        'swapNode',
        'addSection',
        'removeSection',
        'swapSection',
        'deleteActiveNode',
        'copyActiveNode',
        'separateActiveNode'
      ].includes(name)
    ) {
      inAction = true;
      after(() => {
        inAction = false
        saveHistory(store.allPageData)
      })
    }
  })
  emitter.on('saveHistory', () => {
    saveHistory(allPageData.value)
  })

  getAssetsData()
  getPageData()
})

useKeyPress(ShortcutKey.undo, (e) => {
  if (e.shiftKey) return
  if (!canUndoHistory.value) return
  e.preventDefault()
  updateAllPageNode(undoHistory())
})

useKeyPress(ShortcutKey.redo, (e) => {
  if (!canRedoHistory.value) return
  e.preventDefault()
  updateAllPageNode(redoHistory())
})

let context = reactive({ isEditMode: true, displayMode: displayMode.value })
provide('editContext', context)

watch(
  () => displayMode.value,
  () => {
    context.displayMode = displayMode.value
  },
  { immediate: true, flush: 'sync' }
)

watch(
  () => colorVars.value,
  () => {
    useColorVars(colorVars.value)
  },
  { deep: true, immediate: true, flush: 'sync' }
)
</script>

<template>
  <div class="page">
    <!-- 左侧操作栏 -->
    <Sidebar :active-materials-panel="showLeftPanel" @change-materials-panel="(val) => (showLeftPanel = val)"></Sidebar>
    <div class="container">
      <ConfigHeader @download="handleDownload"></ConfigHeader>
      <!-- 页面主体内容 -->
      <div class="content">
        <!-- 左侧模板/组件选择区域 -->
        <div :class="['left-panel', { show: showLeftPanel }]">
          <MaterialsPanel></MaterialsPanel>
        </div>
        <!-- 页面编辑区 -->
        <EditSection></EditSection>
        <!-- 右侧组件参数配置区 -->
        <ConfigSection></ConfigSection>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  color: $color;
  overflow: hidden;
}

.container {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: $bg-default;

  .left-panel {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(-100%);
    transition: all 0.5s;
    z-index: $left-panel-zIndex;

    &.show {
      transform: translateX(0);
    }
  }

  .content {
    position: relative;
    flex: 1;
    display: flex;
    overflow: hidden;
  }
}
</style>
