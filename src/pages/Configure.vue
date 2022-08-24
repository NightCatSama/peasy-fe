<script setup lang="ts">
import { provide, onMounted, nextTick, watch, reactive, onBeforeUnmount, inject } from 'vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

import ConfigSection from '@/components/ConfigSection.vue'
import { downloadHtml } from '@/utils/download'
import Sidebar from '@/components/Sidebar.vue'
import ConfigHeader from '@/components/ConfigHeader.vue'
import MaterialsPanel from '@/components/MaterialsPanel.vue'
import Keyboard from '@/components/Keyboard.vue'
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
import {
  saveStoragePageState,
  haveStoragePageState,
  clearStoragePageState,
  getStoragePageState,
} from '@/stores'
import { Modal } from '@/components/modal'
import ProjectModal from '@/components/modal/ProjectModal.vue'
import { destroyMoveable } from '@/utils/moveable'
import { $t } from '@/constants/i18n'
import { useUserStore } from '@/stores/user'
import { getJSONEditor } from '@/utils/jsoneditor'
import { getSetLoading } from '@/utils/context'

const route = useRoute()
const router = useRouter()
const id = $computed(() => (route.params?.id as string) || '')

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const pageStore = usePageStore()
const { setting, activeSection, allPageData, colorVars, font, project } = storeToRefs(pageStore)
const {
  setActiveSection,
  setActiveNode,
  updateAllPageNode,
  getAssetsData,
  getProjectData,
  download,
  saveProjectData,
  loadTemplateData,
} = pageStore

const displayStore = useDisplayStore()
const { setDeviceByParent, setDevice } = displayStore
const { deviceType, displayMode, lockScriptTrigger } = storeToRefs(displayStore)

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory, isSave } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory, setIsSave } = historyStore

let showProjectModal = $ref(false)
let showKeyboard = $ref(false)

const setGlobalLoading = getSetLoading()

/** 下载当前页面 */
const handleDownload = async () => {
  let hide: any
  const timer = setTimeout(() => hide = setGlobalLoading($t('downloadLoading')), 300)
  try {
    const res = await download()
    downloadHtml(res.data)
  } finally {
    clearTimeout(timer)
    hide?.()
  }
}

/** 保存项目 */
const handleSaveProject = async (editProject?: IProject) => {
  const saveProject = editProject || project.value
  if (allPageData.value.length === 0) {
    return
  }
  if (!saveProject.name) {
    showProjectModal = true
    return
  }
  const data = await saveProjectData(id, saveProject)
  showProjectModal = false
  Alert($t('saveSuccess'))
  if (!id) {
    router.replace({
      name: 'edit',
      params: {
        id: data.id,
      },
    })
  }
  setIsSave(true)
}

emitter.on('saveProject', handleSaveProject)

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
        'getProjectData',
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
        saveHistory(store.allPageData, name === 'getProjectData')
      })
    }
  })
  // 记录数据记录
  emitter.on('saveHistory', () => {
    saveHistory(allPageData.value)
  })
  window.addEventListener('beforeunload', preventUnload)
  // 初始化加载页面数据
  getAssetsData()

  const hide = setGlobalLoading?.($t('loading'))
  if (id) {
    try {
      await getProjectData(id)
    } catch (e) {
      router.replace({ name: 'create' })
    } finally {
      hide?.()
    }
    if (haveStoragePageState(id)) {
      if (await Modal.confirm($t('notSaveDataTip'))) {
        pageStore.$state = getStoragePageState(id, pageStore.$state)
        setIsSave(false)
      }
      clearStoragePageState()
    }
    nextTick(() => emitter.emit('location', true))
  } else {
    if (route.query.templateId && typeof route.query.templateId === 'string') {
      await loadTemplateData(route.query.templateId)
      router.replace({ name: 'create' })
    }
    hide?.()
    setTimeout(() => emitter.emit('location', true))
  }
  if (setting.value.client === 'mobile') {
    deviceType.value = 'mobile'
    setDevice(0)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', preventUnload)
  destroyMoveable()
})

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
// 快捷键 - 切换快捷键是否展示
useKeyPress(ShortcutKey.switchShortcut, (e) => {
  e.preventDefault()
  showKeyboard = !showKeyboard
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
let context = reactive({ isEditMode: true, displayMode: displayMode.value, lockScriptTrigger: lockScriptTrigger.value })
provide('editContext', context)

// 更新 provide
watch(
  () => [displayMode.value, lockScriptTrigger.value],
  () => {
    context.displayMode = displayMode.value
    context.lockScriptTrigger = lockScriptTrigger.value
  },
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

watch (
  () => isAdmin.value,
  (val) => val && getJSONEditor(),
  { immediate: true }
)
</script>

<template>
  <div class="page">
    <!-- 左侧操作栏 -->
    <Sidebar
      :active-materials-panel="showLeftPanel"
      v-model:keyboard="showKeyboard"
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
        <!-- 快捷键展示 -->
        <Keyboard :show="showKeyboard"></Keyboard>
      </div>
    </div>
    <ProjectModal
      v-if="project"
      v-model="showProjectModal"
      :project="project"
      @save="handleSaveProject"
    ></ProjectModal>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  color: $color;
  overflow: hidden;
  height: 100vh;
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
@import '@/styles/draggable.scss';
@import '@/styles/page.scss';
@import '@/styles/moveable.scss';
</style>
