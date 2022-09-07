<script setup lang="ts">
import { provide, onMounted, nextTick, watch, reactive, onBeforeUnmount, inject } from 'vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

import ConfigSection from '@/components/ConfigSection.vue'
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
import { Alert, AlertError, AlertProcess, AlertSuccess } from '@/utils/alert'
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
import DownloadModal from '@/components/modal/DownloadModal.vue'
import SaveMaterialModal from '@/components/modal/SaveMaterialModal.vue'
import { IMaterialItem } from '@/config'
import { templatePreviewUrl } from '@/utils/mande'

const route = useRoute()
const router = useRouter()
const id = $computed(() => (route.params?.id as string) || '')
const projectId = $computed(() => (project.value?.id as string) || '')

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const pageStore = usePageStore()
const {
  activeNode,
  setting,
  activeSection,
  allPageData,
  colorVars,
  font,
  project,
  activeNodeIsSonText,
  allProjectData,
  template,
} = storeToRefs(pageStore)
const {
  setActiveSection,
  setActiveNode,
  updateAllPageNode,
  getAssetsData,
  getProjectData,
  download,
  downloadAll,
  saveProjectData,
  loadTemplateData,
  pasteClipboardNode,
  copyActiveNodeToClipboard,
  fetchSaveMaterial
} = pageStore

const displayStore = useDisplayStore()
const { setDeviceByParent, setDevice } = displayStore
const { deviceType, displayMode, lockScriptTrigger } = storeToRefs(displayStore)

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory, isSave } = storeToRefs(historyStore)
const { saveHistory, undoHistory, redoHistory, setIsSave } = historyStore

let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let showKeyboard = $ref(false)
let showDownloadModal = $ref(false)

/** 模板编辑 */
const isEditTemplate = $computed(() => route.name === 'template-edit')

const setGlobalLoading = getSetLoading()

/** 下载当前页面 */
const handleDownload = async () => {
  let hide: any
  const timer = setTimeout(() => hide = setGlobalLoading($t('downloadLoading')), 300)
  try {
    download()
    // const res = await download()
    // downloadHtml(res.data)
  } finally {
    clearTimeout(timer)
    hide?.()
  }
}

/** 下载整个项目 */
const handleDownloadAll = async () => {
  let hide: any
  const timer = setTimeout(() => hide = setGlobalLoading($t('downloadLoading')), 300)
  try {
    downloadAll()
    // const res = await download()
    // downloadHtml(res.data)
  } finally {
    clearTimeout(timer)
    hide?.()
  }
}

/** 保存项目 */
const handleSaveProject = async (editProject?: IProject) => {
  const saveProject = editProject || project.value
  if (!saveProject.name) {
    showProjectModal = true
    return
  }
  const [alertCb, hide] = AlertProcess($t('saving'))
  try {
    const data = await saveProjectData(projectId, saveProject)
    alertCb($t('saveSuccess'))
    showProjectModal = false
    if (!id) {
      router.replace({
        name: 'edit',
        params: {
          id: data.id,
        },
      })
    }
    setIsSave(true)
  } catch (e: any) {
    hide()
    throw e
  }
}

/** 保存模板 */
const handleSaveMaterial = async () => {
  const [alertCb, hide] = AlertProcess($t('saving'))
  const material: IMaterialItem = {
    ...template.value!,
    page: {
      pageData: allPageData.value,
      /** 颜色变量 */
      colorVars: colorVars.value,
      /** 页面配置 */
      setting: setting.value,
      /** 字体配置 */
      font: font.value,
    }
  }
  try {
    const data = await fetchSaveMaterial(material)
    alertCb($t('saveSuccess'))
    setIsSave(true)
  } catch (e: any) {
    hide()
    throw e
  }
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
        'copyNode',
        'separateActiveNode',
        'setActiveNodeHide',
        'switchActiveNodeConfigMode',
        'unlinkActiveNodeProp',
        'unlinkActiveNodePropGroup',
        'syncNodeModuleConfig',
        'changeNodeName',
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
  emitter.on('saveHistory', (init?: boolean) => {
    saveHistory(allPageData.value, init)
  })
  window.addEventListener('beforeunload', preventUnload)
  // 初始化加载页面数据
  getAssetsData()

  const hide = setGlobalLoading?.($t('loading'))
  if (id) {
    try {
      if (isEditTemplate) {
        await loadTemplateData(id, true)
      } else {
        await getProjectData(id)
      }
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
    saveStoragePageState(projectId)
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
// 复制粘贴
useKeyPress(ShortcutKey.cut, async (e) => {
  if (!activeNode.value) return
  e.preventDefault()
  await copyActiveNodeToClipboard(true)
  Alert($t('cutSuccess'))
})
useKeyPress(ShortcutKey.copyToClipboard, async (e) => {
  const selectText = document.getSelection()?.toString()
  if (!activeNode.value || selectText || activeNodeIsSonText.value) return
  e.preventDefault()
  await copyActiveNodeToClipboard()
  Alert($t('copySuccess'))
})
useKeyPress(ShortcutKey.pasteToInside, async (e) => {
  e.preventDefault()
  handlePasteNode(true)
})
useKeyPress(ShortcutKey.paste, async (e) => {
  if (e.shiftKey) return
  e.preventDefault()
  handlePasteNode(false)
})

const handlePasteNode = async(pasteToInside?: boolean) => {
  if (!activeNode.value) return
  if (await pasteClipboardNode(pasteToInside)) {
    Alert($t('pasteSuccess'))
  }
}

/** 打开模板预览链接 */
const openPreviewTemplate = () => {
  let a: HTMLAnchorElement | null = document.createElement('a')
  a.href = templatePreviewUrl(template.value?.id!)
  a.setAttribute('target', '_blank')
  a.click()
  a.remove()
  a = null
}

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

watch(
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
        :is-template="isEditTemplate"
        @download="showDownloadModal = true"
        @preview="openPreviewTemplate"
        @save="() => !isEditTemplate ? handleSaveProject() : handleSaveMaterial()"
        @project-setting="showProjectModal = true"
        @template-setting="showSaveMaterialModal = true"
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
    <SaveMaterialModal
      v-if="template"
      :action-text="$t('edit')"
      :material="template"
      v-model="showSaveMaterialModal"
      :on-save="() => setIsSave(true)"
    ></SaveMaterialModal>
    <DownloadModal
      :project="project"
      :show-download-all="Object.keys(allProjectData).length > 1"
      v-model="showDownloadModal"
      @download="handleDownload"
      @download-all="handleDownloadAll"
    ></DownloadModal>
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
