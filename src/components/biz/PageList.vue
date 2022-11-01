<script setup lang="ts">
import { IMaterialItem } from '@/config'
import { $t } from '@/constants/i18n'
import { useHistoryStoreHelper, usePageStoreHelper } from '@/hooks/store'
import { Alert, AlertSuccess } from '@/utils/alert'
import { emitter } from '@/utils/event'
import { Project } from '@@/entities/project.entity'
import { useRoute } from 'vue-router'
import { Modal } from '../modal'
import ProjectModal from '../modal/ProjectModal.vue'
import SaveMaterialModal from '../modal/SaveMaterialModal.vue'
import MaterialCard from '../widgets/MaterialCard.vue'

const { mainProject, allProjectData, project, saveProjectData, switchProject, deleteProject } =
  usePageStoreHelper()

const { isSave, clearHistory } = useHistoryStoreHelper()

const route = useRoute()

let curEditProject = $ref<IProject | null>(null)
let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)

const curId = $computed(() => project.value.id)

const handleOpenProjectModal = (item: IProject) => {
  if (!curId) {
    Alert($t('subPageTip'))
    return
  }
  curEditProject = {
    name: '',
    cover: '',
    isPublic: false,
    domain: '',
    host: '',
    filename: '',
    parentPage: mainProject.value?.id as string,
  }
  showProjectModal = true
}

/** 保存子页面 */
const handleSaveProject = async (item: IProject) => {
  await saveProjectData(
    item.id || '',
    item,
    item.id ? false : true // 新增子页面时，需要创建默认的页面数据
  )
  showProjectModal = false
  curEditProject = null
  AlertSuccess($t('saveSuccess'))
}

/** 切换页面 */
const handleSwitchProject = async (item: IProject) => {
  if (!item.id || item.id === curId) return
  if (!isSave.value) {
    Alert($t('subPageRouterTip'))
    return
  }
  await switchProject(item.id)
  clearHistory()
  emitter.emit('saveHistory', true)
}

/** 保存为模板 */
const handleSaveToTemplate = async (project: Project) => {
  setCurMaterialByProject(project)
  showSaveMaterialModal = true
}

/** 设置物料数据 */
const setCurMaterialByProject = (project: Project) => {
  curMaterial = {
    name: project.name,
    enName: '',
    type: 'template',
    category: '',
    categoryEn: '',
    cover: project.cover || '',
    page: project.page,
  }
}

const handleDeleteProject = async (project: Project) => {
  if (project.id === mainProject.value?.id) {
    Alert($t('deleteMainPageTip'))
    return
  }
  if (await Modal.confirm($t('deleteConfirm', project.name))) {
    await deleteProject(project.id)
    AlertSuccess($t('deleteSuccess'))
  }
}

const handleSettingProject = async (project: Project) => {
  showProjectModal = true
  curEditProject = project
}
</script>

<template>
  <div class="page-list">
    <MaterialCard
      v-for="(item, id) in allProjectData"
      class="page-item"
      type="project"
      :key="id"
      :item="(item as any)"
      :selected="id === curId"
      show-filename
      @on-save-template="handleSaveToTemplate"
      @on-project-click="handleSwitchProject"
      @on-delete-project="handleDeleteProject"
      @on-setting-project="handleSettingProject"
    ></MaterialCard>
    <MaterialCard
      class="page-item"
      type="project"
      hide-operate
      is-new
      :new-text="''"
      @on-project-click="handleOpenProjectModal"
    ></MaterialCard>
    <ProjectModal
      v-if="curEditProject"
      v-model="showProjectModal"
      :project="curEditProject"
      :hide-create-cover="curEditProject.id !== project.id"
      @save="handleSaveProject"
    ></ProjectModal>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="curMaterial.id ? $t('edit') : $t('saveOf')"
      :material="curMaterial"
      hide-create-cover
      v-model="showSaveMaterialModal"
    ></SaveMaterialModal>
  </div>
</template>

<style lang="scss">
.page-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  overflow-x: auto;
  background-color: rgba($panel-header, 98%);
  z-index: $header-page-list-zIndex;
  border-top: 1px solid $border;
  transition: all 0.2s;
  height: 0;
  padding: 0 24px 0;
  overflow: hidden;
  display: flex;
  align-items: center;

  &.show {
    padding: 16px 24px 12px;
    height: 160px;
  }

  .page-item.material-card {
    height: 132px;
    width: 90px;
    cursor: pointer;
    margin: 0 18px 0 0;
    border-radius: $normal-radius;
    color: $yellow;

    .material-card-info {
      height: 24px;
      margin-top: 4px;
    }

    &.selected .material-card-image::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
