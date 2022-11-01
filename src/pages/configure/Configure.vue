<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, watch } from 'vue'

import ConfigHeader from '@/components/ConfigHeader.vue'
import ConfigSection from '@/components/ConfigSection.vue'
import EditSection from '@/components/EditSection.vue'
import Keyboard from '@/components/Keyboard.vue'
import { useColorVars } from '@/components/libs/hooks/color'
import { useFont } from '@/components/libs/hooks/font'
import MaterialsPanel from '@/components/MaterialsPanel.vue'
import { Modal } from '@/components/modal'
import DownloadModal from '@/components/modal/DownloadModal.vue'
import ProjectModal from '@/components/modal/ProjectModal.vue'
import SaveMaterialModal from '@/components/modal/SaveMaterialModal.vue'
import Sidebar from '@/components/Sidebar.vue'
import { IMaterialItem } from '@/config'
import { $t } from '@/constants/i18n'
import {
  useDisplayStoreHelper,
  useHistoryStoreHelper,
  usePageStoreHelper,
  useUserStoreHelper,
} from '@/hooks/store'
import {
  clearStoragePageState,
  getStoragePageState,
  haveStoragePageState,
  saveStoragePageState,
} from '@/stores'
import { AlertProcess } from '@/utils/alert'
import { useEditorStylesheet } from '@/utils/color'
import { getSetLoading } from '@/utils/context'
import { emitter } from '@/utils/event'
import { getJSONEditor } from '@/utils/jsoneditor'
import { templatePreviewUrl } from '@/utils/mande'
import { destroyMoveable } from '@/utils/moveable'
import { useRoute, useRouter } from 'vue-router'
import { useProvide } from './hooks/provide'
import { useShortCut } from './hooks/shortcut'

const route = useRoute()
const router = useRouter()
const id = $computed(() => (route.params?.id as string) || '')
const projectId = $computed(() => (project.value?.id as string) || '')

const { isAdmin } = useUserStoreHelper()

const {
  pageStore,
  setting,
  allPageData,
  colorVars,
  font,
  project,
  allProjectData,
  template,
  getAssetsData,
  getProjectData,
  download,
  downloadAll,
  saveProjectData,
  loadTemplateData,
  fetchSaveMaterial,
} = usePageStoreHelper()

const { deviceType, setDevice, editorSettings } = useDisplayStoreHelper()

const { isSave, saveHistory, setIsSave } = useHistoryStoreHelper()

let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let showDownloadModal = $ref(false)

const { showKeyboard } = useShortCut()

useProvide()

/** 模板编辑 */
const isEditTemplate = $computed(() => route.name === 'template-edit')

const setGlobalLoading = getSetLoading()

/** 下载当前页面 */
const handleDownload = async () => {
  let hide: any
  const timer = setTimeout(() => (hide = setGlobalLoading($t('downloadLoading'))), 300)
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
  const timer = setTimeout(() => (hide = setGlobalLoading($t('downloadLoading'))), 300)
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
    },
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

/** 打开模板预览链接 */
const openPreviewTemplate = () => {
  let a: HTMLAnchorElement | null = document.createElement('a')
  a.href = templatePreviewUrl(template.value?.id!)
  a.setAttribute('target', '_blank')
  a.click()
  a.remove()
  a = null
}

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

// 更新编辑器配置
watch(
  () => editorSettings.value,
  () => {
    const stylesheet = `
      :root {
        --editor-background-color: ${editorSettings.value.backgroundColor};
        --contours-color: ${editorSettings.value.contoursColor};
      }
      .rCS19atnxs.moveable-control-box {
        --moveable-color: ${editorSettings.value.selectColor};
      }
    `
    useEditorStylesheet(stylesheet)
  },
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
        @save="() => (!isEditTemplate ? handleSaveProject() : handleSaveMaterial())"
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
