<script setup lang="ts">
import { useLogto } from '@logto/vue'
import Avatar from '@/components/widgets/Avatar.vue'
import { materialApi, projectApi } from '@/utils/mande'
import { onErrorCaptured, onMounted, reactive } from 'vue'
import { IMaterialItem, IPage } from '@/config'
import { Project } from '@@/entities/project.entity'
import { IResponse } from '@@/types/response'
import { useRoute, useRouter } from 'vue-router'
import { Modal } from '@/components/modal'
import ProjectModal from '@/components/modal/ProjectModal.vue'
import { AlertError, AlertSuccess } from '@/utils/alert'
import SaveMaterialModal from '@/components/modal/SaveMaterialModal.vue'
import { SaveProjectDto } from '@@/dto/data.dto'
import { $t } from '@/constants/i18n'
import { getSetLoading } from '@/utils/context'
import Icon from '@/components/widgets/Icon.vue'
import Dashboard from './menu/Dashboard.vue'
import Templates from './menu/Templates.vue'
import Materials from './menu/Materials.vue'
import Settings from './menu/Settings.vue'
import Chat from '@/components/biz/Chat.vue'
import { emitter } from '@/utils/event'
import { useUserStoreHelper } from '@/hooks/store'

const router = useRouter()
const route = useRoute()

const { userName, avatar, vipName, isLogin } = useUserStoreHelper()

const { signOut, signIn } = useLogto()
const handleSignIn = () => {
  sessionStorage.setItem('redirect', location.href)
  signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
}
const handleSignOut = async () => {
  if (await Modal.confirm('', { title: $t('signOutTipTitle') })) {
    signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)
  }
}

let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)
let curEditProject = $ref<Project | null>(null)
let curMenu = $ref(route.query.page || 'dashboard')

let showMap = reactive<{
  [key: string]: (IMaterialItem | Project)[]
}>({
  project: [],
  template: [],
  section: [],
  component: [],
})

onMounted(async () => {
  if (!isLogin.value) {
    showMap['project'] = []
    curMenu = ''
    handleSignIn()
    return
  }
  const setGlobalLoading = getSetLoading()
  const hide = setGlobalLoading?.($t('loading'))
  const { data } = await projectApi.get<IResponse<Project[]>>('')
  showMap['project'] = data
  const res = await materialApi.get<IResponse<{ [type: string]: IMaterialItem[] }>>('', {
    query: { section: true, component: true, template: true, onlySelf: true },
  })
  hide?.()
  ;['template', 'section', 'component'].forEach((key) => {
    if (res.data[key]?.length > 0) {
      showMap[key] = res.data[key]
    } else {
      showMap[key] = []
    }
  })
})

onErrorCaptured((error: any) => {
  AlertError(error?.body?.message || error?.message || error?.msg || $t('unknownError'))
})

let projectList = $computed<Project[]>(() => (showMap['project'] as Project[]) || [])

const handleGotoProject = (project?: Project) => {
  if (!project) {
    router.push({
      name: 'template',
    })
  } else {
    router.push({
      name: 'edit',
      params: {
        id: project.id,
      },
    })
  }
}

const handleDeleteProject = async (project: Project) => {
  if (await Modal.confirm($t('deleteConfirmMsg', project.name), { title: $t('deleteConfirm', project.name), inputVerify: project.name })) {
    await projectApi.delete(project.id)
    showMap['project'] = projectList.filter((p) => p.id !== project.id)
    AlertSuccess($t('deleteSuccess'))
  }
}

const handleOpenProjectModal = (project: Project) => {
  showProjectModal = true
  curEditProject = project
}

const handleSaveProject = async (project: IProject) => {
  if (!curEditProject) return
  await projectApi.patch<IResponse<Project>>(curEditProject.id, {
    name: project.name,
    cover: project.cover,
    isPublic: project.isPublic || false,
    domain: project.domain || '',
    host: project.host || ''
  })
  curEditProject.name = project.name
  curEditProject.cover = project.cover
  curEditProject.domain = project.domain
  curEditProject.isPublic = project.isPublic
  curEditProject.host = project.host
  showProjectModal = false
  curEditProject = null
  AlertSuccess($t('saveSuccess'))
}

const handleSaveToTemplate = async (project: Project) => {
  setCurMaterialByProject(project)
  showSaveMaterialModal = true
}

/** 处理物料展示图片的点击事件 */
const handleMaterialImageClick = async (material: IMaterialItem) => {
  if (material.type === 'template') {
    if (await Modal.confirm($t('createTemplateTip'))) {
      const { data } = await projectApi.patch<IResponse<Project>>('', {
        name: material.name,
        cover: material.cover,
        page: material.page,
        isPublic: false,
        domain: '',
        host: ''
      } as SaveProjectDto)
      handleGotoProject(data)
    }
  } else {
    curMaterial = material
    showSaveMaterialModal = true
  }
}

/** 打开物料编辑弹窗 */
const handleMaterialSetting = async (material: IMaterialItem) => {
  curMaterial = material
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

const updateMaterial = (material: IMaterialItem) => {
  if (!curMaterial) return
  // 有 id 则为更新
  if (curMaterial.id) {
    showMap[curMaterial.type] = showMap[curMaterial.type].map((m) => {
      if (m.id === curMaterial!.id) {
        return material
      }
      return m
    })
  } else {
    ;(showMap[curMaterial.type] as IMaterialItem[]).push(material)
  }
}

/** 删除物料 */
const handleDeleteMaterial = async (material: IMaterialItem) => {
  if (await Modal.confirm($t('deleteConfirm', material.name))) {
    await materialApi.delete(material.id!)
    showMap[material.type] = (showMap[material.type] as IMaterialItem[]).filter(
      (p) => p.id !== material.id
    )
    AlertSuccess($t('deleteSuccess'))
  }
}

/** 处理编辑物料 */
const handleEditMaterial = (material: IMaterialItem) => {
  if (material.type === 'template') {
    router.push({
      name: 'template-edit',
      params: {
        id: material.id,
      }
    })
  }
}

const openLink = (link: string) => {
  let a: HTMLAnchorElement | null = document.createElement('a')
  a.href = link
  a.setAttribute('target', '_blank')
  a.click()
  a.remove()
  a = null
}

const openChat = () => {
  emitter.emit('openChat')
}

const handleSwitchPage = (menuType: string) => {
  curMenu = menuType
  router.replace({
    name: route.name!,
    query: menuType !== 'dashboard' ? {
      page: menuType,
    } : {}
  })
}
</script>

<template>
  <div class="me-page">
    <div class="left-sidebar">
      <div class="user-info">
        <Avatar :image="avatar" :size="80"></Avatar>
        <div class="user-name">{{ userName }}</div>
        <span v-if="vipName" :class="['tag', vipName]">{{ vipName }}</span>
      </div>
      <div class="menu-list" v-if="isLogin">
        <div :class="['menu-item', { active: curMenu === 'dashboard' }]" @click="handleSwitchPage('dashboard')">
          <Icon class="menu-item-icon" name="home" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('dashboard') }}</div>
        </div>
        <div :class="['menu-item', { active: curMenu === 'template' }]" @click="handleSwitchPage('template')">
          <Icon class="menu-item-icon" name="template" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('templates') }}</div>
        </div>
        <div :class="['menu-item', { active: curMenu === 'material' }]" @click="handleSwitchPage('material')">
          <Icon class="menu-item-icon" name="material" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('materials') }}</div>
        </div>
        <div :class="['menu-item', { active: curMenu === 'setting' }]" @click="handleSwitchPage('setting')">
          <Icon class="menu-item-icon" name="advanced" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('settings') }}</div>
        </div>
      </div>
      <div class="menu-list">
        <div class="menu-item link" @click="openLink('https://discord.gg/AXQP9YUSXk')">
          <Icon class="menu-item-icon" name="discord" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('discord') }}</div>
        </div>
        <div class="menu-item link" @click="openChat">
          <Icon class="menu-item-icon" name="chat" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('supportChat') }}</div>
        </div>
      </div>
      <div class="menu-list">
        <div v-if="isLogin" class="menu-item danger" @click="handleSignOut">
          <Icon class="menu-item-icon" name="signout" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('signOut') }}</div>
        </div>
        <div v-else class="menu-item primary" @click="handleSignIn">
          <Icon class="menu-item-icon" name="signin" :size="16"></Icon>
          <div class="menu-item-text">{{ $t('signIn') }}</div>
        </div>
      </div>
    </div>
    <div class="content">
      <Dashboard
        v-show="curMenu === 'dashboard'"
        :projects="(showMap['project'] as Project[])"
        :sub-projects="[]"
        @on-project-click="handleGotoProject"
        @on-save-template="handleSaveToTemplate"
        @on-setting-project="handleOpenProjectModal"
        @on-delete-project="handleDeleteProject"
      ></Dashboard>
      <Templates
        v-if="curMenu === 'template'"
        :templates="(showMap['template'] as IMaterialItem[])"
        @on-material-click="handleMaterialImageClick"
        @on-setting-material="handleMaterialSetting"
        @on-delete-material="handleDeleteMaterial"
        @on-edit-material="handleEditMaterial"
      ></Templates>
      <Materials
        v-if="curMenu === 'material'"
        :section="(showMap['section'] as IMaterialItem[])"
        :component="(showMap['component'] as IMaterialItem[])"
        @on-setting-material="handleMaterialSetting"
        @on-delete-material="handleDeleteMaterial"
      ></Materials>
      <Settings v-if="curMenu === 'setting'"></Settings>
    </div>
    <ProjectModal
      v-if="curEditProject"
      v-model="showProjectModal"
      :project="curEditProject"
      hide-create-cover
      @save="handleSaveProject"
    ></ProjectModal>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="curMaterial.id ? $t('edit') : $t('saveOf')"
      :material="curMaterial"
      hide-create-cover
      v-model="showSaveMaterialModal"
      :on-save="updateMaterial"
    ></SaveMaterialModal>
    <Chat></Chat>
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  position: relative;
  color: $white;
  background: $bg-default-gradient;
  height: 100vh;
  font-family: $font-family;
  display: flex;

  .left-sidebar {
    width: 280px;
    height: 100%;
    background: $panel-sidebar-gradient;
    display: flex;
    flex-direction: column;
    padding: 80px 32px;
  }

  .user-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 12px;
  }
  .tag {
    font-size: 13px;
    border-radius: $inner-radius;
    color: $white;
    background: $purple-gradient;
    padding: 2px 8px;
    display: flex;
    align-self: start;
    margin-bottom: 12px;

    &.Advanced {
      background: $purple-gradient;
    }

    &.Professional {
      background: $orange-gradient;
    }

    &.Basic {
      background: $grey-gradient;
    }
  }
  .user-name {
    display: flex;
    align-items: center;
    font-size: 24px;
    color: $yellow;
    margin: 6px 0;
    word-break: break-word;
    font-weight: bold;
  }

  .menu-list {
    margin-top: 40px;

    .menu-item {
      padding: 8px;
      color: $color;
      display: flex;
      align-items: center;
      border-radius: $normal-radius;
      margin-bottom: 4px;
      cursor: pointer;
      transition: all .3s;

      &.active, &:hover {
        background-color: rgba(0, 0, 0, .25);
      }

      &.link:hover {
        color: $cyan;
        background-color: rgba(0, 0, 0, .05);
      }

      &.primary {
        &.active, &:hover {
          background-color: rgba($green, .5);
        }
      }

      &.danger {
        &.active, &:hover {
          background-color: rgba($red, .5);
        }
      }

      &-icon {
        margin-right: 6px;
      }
    }
  }

  .data-wrapper {
    padding: 20px 60px 0px;
    &:first-child {
      padding-top: 20px;
    }
    &:last-child {
      padding-bottom: 40px;
    }
    .data-title {
      margin-top: 20px;
      font-size: 30px;
      color: $panel;
      font-weight: bold;
    }
    .data-list {
      display: flex;
      flex-wrap: wrap;
    }
    .empty-tip {
      margin-top: 12px;
      font-size: 14px;
      color: #9e9ea7;
    }
  }

  :deep(.material-card) {
    color: $color;
  }
  .content {
    flex: 1;
    height: 100%;
    overflow: auto;
    padding: 120px 48px 20px;
  }
}
</style>
