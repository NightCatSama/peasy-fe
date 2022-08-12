<script setup lang="ts">
import { provide, onMounted, nextTick, watch, reactive, onBeforeUnmount } from 'vue'
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
import { useFont } from '@/components/libs/hooks/font'
import { persistToken } from '@/utils/mande'
import { Alert, AlertError } from '@/utils/alert'
import { useRoute, useRouter } from 'vue-router'
import { saveStoragePageState, haveStoragePageState, clearStoragePageState, getStoragePageState } from '@/stores'
import { Modal } from '@/components/modal'
import ProjectModal from '@/components/modal/ProjectModal.vue'

const route = useRoute()
const router = useRouter()
const id = $computed(() => route.params?.id as string || '')

const pageStore = usePageStore()
const { setting, activeSection, allPageData, colorVars, font, project } = storeToRefs(pageStore)
const { setActiveSection, setActiveNode, updateAllPageNode, getAssetsData, getProjectData, download, saveProjectData } =
  pageStore

const displayStore = useDisplayStore()
const { setDeviceByParent, setDevice } = displayStore
const { deviceType, displayMode } = storeToRefs(displayStore)

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory, isSave } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory, setIsSave } = historyStore

let showProjectModal = $ref(false)

/** 下载当前页面 */
const handleDownload = async () => {
  const res = await download()
  downloadHtml(res.data)
}

/** 保存项目 */
const handleSaveProject = async () => {
  if (allPageData.value.length === 0) {
    return
  }
  // TODO: 后续需要弹窗设置项目名与封面图
  if (!project.value.name) {
    showProjectModal = true
    return
  }
  const data = await saveProjectData(id, project.value)
  showProjectModal = false
  Alert('保存成功')
  if (!id) {
    router.replace({
      name: 'edit',
      params: {
        id: data.id,
      }
    })
  }
  setIsSave(true)
}

let showLeftPanel = $ref(false)

onMounted(async () => {
  emitter.on('switchMaterialsPanel', (show?: boolean) => {
    showLeftPanel = show === void 0 ? !showLeftPanel : show
  })

  /** 记录编辑记录 */
  let inAction = false
  pageStore.$onAction(({ name, store, args, after, onError }) => {
    if (
      !inAction &&
      [
        'insertNode',
        'swapNode',
        'addSection',
        'removeSection',
        'swapSection',
        'deleteActiveNode',
        'copyActiveNode',
        'separateActiveNode',
        'setActiveNodeHide',
        'switchActiveNodeConfigMode',
        'unlinkActiveNodeProp',
        'unlinkActiveNodePropGroup',
      ].includes(name)
    ) {
      inAction = true
      after(() => {
        inAction = false
        saveHistory(store.allPageData)
      })
    }

    onError((error: any) => {
      AlertError(error?.body?.message || error?.message || error?.msg || '未知错误')
    })
  })
  // 记录数据记录
  emitter.on('saveHistory', () => {
    saveHistory(allPageData.value)
  })

  window.addEventListener('beforeunload', preventUnload);

  // 初始化加载页面数据
  getAssetsData()

  if (id) {
    await getProjectData(id)
    if (haveStoragePageState(id)) {
      if (await Modal.confirm('你有未保存的数据，是否应用？')) {
        pageStore.$state = getStoragePageState(id, pageStore.$state)
        setIsSave(false)
      }
      clearStoragePageState()
    }
    nextTick(() => emitter.emit('location', true))
  } else {
    setTimeout(() => emitter.emit('location', true))
  }
  if (setting.value.client === 'mobile') {
    deviceType.value = 'mobile'
    setDevice(0)
  }
})

onBeforeUnmount(() => window.removeEventListener('beforeunload', preventUnload))

const preventUnload = (event: BeforeUnloadEvent) => {
  if (!isSave.value) {
    event.preventDefault()
    event.returnValue = ''
    saveStoragePageState(id)
  }
}

// 快捷键 - 重做
useKeyPress(ShortcutKey.undo, (e) => {
  if (e.shiftKey) return
  if (!canUndoHistory.value) return
  e.preventDefault()
  updateAllPageNode(undoHistory())
})

// 快捷键 - 撤销
useKeyPress(ShortcutKey.redo, (e) => {
  if (!canRedoHistory.value) return
  e.preventDefault()
  updateAllPageNode(redoHistory())
})

// 快捷键 - 折叠/展开全部
useKeyPress(ShortcutKey.collapseAll, (e) => {
  e.preventDefault()
  emitter.emit('collapseGroup')
})

// 快捷键 - 切换 Section
useKeyPress(ShortcutKey.switchSection, (e) => {
  e.preventDefault()
  if (e.key === '0') {
    switchSectionToIndex(-1)
  } else if (+e.key > 0) {
    switchSectionToIndex(+e.key - 1)
  }
})
useKeyPress(ShortcutKey.nextSection, (e) => {
  if (e.shiftKey) return
  e.preventDefault()
  switchSectionByRound(1)
})
useKeyPress(ShortcutKey.prevSection, (e) => {
  e.preventDefault()
  switchSectionByRound(-1)
})

const switchSectionByRound = $computed(() => (change: number) => {
  const index = allPageData.value.findIndex((item) => item === activeSection.value)
  switchSectionToIndex(index + change)
})
const switchSectionToIndex = $computed(() => (index: number) => {
  if (index === -1) {
    setActiveSection(null)
  } else if (allPageData.value[index]) {
    setActiveSection(allPageData.value[index])
    setActiveNode(allPageData.value[index])
  }
  nextTick(() => emitter.emit('location'))
})

// 向子组件传递当前编辑模式，在 lib/ 下的组件中使用
// 为啥使用 provide，因为需要保持 lib/ 下的依赖干净，在纯页面生成时是不需要 store 相关数据引用的
let context = reactive({ isEditMode: true, displayMode: displayMode.value })
provide('editContext', context)

// 更新 provide 的 displayMode
watch(
  () => displayMode.value,
  () => (context.displayMode = displayMode.value),
  { immediate: true, flush: 'sync' }
)

// 更新颜色变量
watch(
  () => colorVars.value,
  () => useColorVars(colorVars.value),
  { deep: true, immediate: true, flush: 'sync' }
)

// 更新字体配置
watch(
  () => font.value,
  () => useFont(font.value, '.edit-content'),
  { deep: true, immediate: true, flush: 'sync' }
)
</script>

<template>
  <div class="page">
    <!-- 左侧操作栏 -->
    <Sidebar
      :active-materials-panel="showLeftPanel"
      @change-materials-panel="(val) => (showLeftPanel = val)"
    ></Sidebar>
    <div class="container">
      <ConfigHeader
        @download="handleDownload"
        @save="handleSaveProject"
        @project-setting="showProjectModal = true"
      ></ConfigHeader>
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
    <ProjectModal v-model="showProjectModal" @save="handleSaveProject"></ProjectModal>
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

<style lang="scss">
body {
  overflow: hidden;
}
</style>
