<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useLogto } from '@logto/vue'
import Btn from '@/components/widgets/Btn.vue'
import Icon from '@/components/widgets/Icon.vue'
import Avatar from '@/components/widgets/Avatar.vue'
import { materialApi, projectApi } from '@/utils/mande'
import { onErrorCaptured, onMounted, reactive } from 'vue'
import { IMaterialItem, IPage } from '@/config'
import { Project } from '@@/entities/project.entity'
import { IResponse } from '@@/types/response'
import { useRouter } from 'vue-router'
import { Modal } from '@/components/modal'
import ProjectModal from '@/components/modal/ProjectModal.vue'
import { Alert, AlertError, AlertSuccess } from '@/utils/alert'
import SaveMaterialModal from '@/components/modal/SaveMaterialModal.vue'
import { SaveProjectDto } from '@@/dto/data.dto'
import { $t } from '@/constants/i18n'
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import { getSetLoading } from '@/utils/context'

const router = useRouter()

const userStore = useUserStore()
const { userName, avatar, vipName, isLogin } = storeToRefs(userStore)
const { updateAvatar } = userStore

const { signOut, signIn } = useLogto()
const handleSignIn = () => {
  sessionStorage.setItem('redirect', location.href)
  signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
}
const handleSignOut = () => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)

const handleUpdateAvatar = (img: string) => {
  updateAvatar(img)
}

let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)
let curEditProject = $ref<Project | null>(null)
let curType = $ref('project')

let showMap = reactive<{
  [key: string]: (IMaterialItem | Project)[]
}>({
  project: [],
  template: [],
  section: [],
  component: [],
})

let titleMap: { [key: string]: string } = {
  project: $t('project'),
  template: $t('template'),
  component: $t('component'),
  section: $t('section'),
}

onMounted(async () => {
  if (!isLogin.value) {
    showMap['project'] = []
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
  if (await Modal.confirm($t('deleteConfirm', project.name))) {
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

/** 处理物流展示图片的点击事件 */
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

/** 设置物流数据 */
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

const setCurType = (type: string) => {
  curType = type
}
</script>

<template>
  <div class="me-page">
    <div class="user-info">
      <Avatar :image="avatar" :size="100" :can-upload="isLogin" :on-upload="handleUpdateAvatar"></Avatar>
      <div class="user-right" v-if="!isLogin">
        <Btn class="sign-btn" type="btn" size="sm" color="primary" @click="handleSignIn">{{ $t('signIn') }}</Btn>
      </div>
      <div class="user-right" v-else>
        <div class="user-name">
          <span>{{ userName }}</span>
          <span v-if="vipName" class="tag">{{ vipName }}</span>
        </div>
        <Btn class="sign-btn" type="btn" size="sm" color="default" @click="handleSignOut">{{ $t('signOut') }}</Btn>
      </div>
    </div>
    <div :class="['data-wrapper', `data-wrapper-${curType}`]" v-if="isLogin">
      <div class="type-tabs">
        <div
          :class="['type-tabs-item', { active: curType === type }]"
          v-for="(list, type) in showMap"
          :key="type"
          @click="setCurType(type as string)"
        >
          {{ titleMap[type] }}
          <span class="count">{{ list.length }}</span>
        </div>
      </div>
      <div class="data-list">
        <MaterialCard
          v-if="curType === 'project'"
          type="project"
          is-new
          @on-project-click="handleGotoProject"
        >
        </MaterialCard>
        <MaterialCard
          v-for="(item, index) in showMap[curType]"
          :key="item.name + index"
          :type="curType"
          :item="item"
          @on-project-click="handleGotoProject"
          @on-material-click="handleMaterialImageClick"
          @on-save-template="handleSaveToTemplate"
          @on-setting-project="handleOpenProjectModal"
          @on-delete-project="handleDeleteProject"
          @on-setting-material="handleMaterialSetting"
          @on-delete-material="handleDeleteMaterial"
        >
        </MaterialCard>
        <div class="empty-tip" v-if="showMap[curType].length === 0 && curType !== 'project'">
          {{ curType === 'template' ? $t('saveTemplateTip') : $t('saveMaterialTip') }}
        </div>
      </div>
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
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  position: relative;
  background: #e7e7e9;
  min-height: 100vh;
  font-family: $font-family;
  .user-info {
    height: 240px;
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $panel-gradient;
  }
  .user-right {
    display: flex;
    flex-direction: column;
    margin-left: 20px;
  }
  .user-name {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: $yellow;

    .tag {
      margin-left: 6px;
      font-size: 12px;
      border-radius: 4px;
      color: $white;
      background: $purple-gradient;
      padding: 1px 4px;
      transform: scale(.9);
    }
  }

  .type-tabs {
    display: flex;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba(0, 0, 0, .15);

    &-item {
      padding: 8px 12px;
      margin-right: 30px;
      color: $panel-light;
      cursor: pointer;
      user-select: none;

      &.active {
        color: $panel;
        font-weight: bold;
        .count {
          color: $theme;
        }
      }

      .count {
        color: #9e9ea7;
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
}
</style>
