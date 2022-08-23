<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { useLogto } from '@logto/vue'
import Btn from '@/components/widgets/Btn.vue'
import Icon from '@/components/widgets/Icon.vue'
import Avatar from '@/components/widgets/Avatar.vue'
import ImageItem from '@/components/configs/items/ImageItem.vue'
import { materialApi, projectApi } from '@/utils/mande'
import { onMounted, reactive } from 'vue'
import { IMaterialItem, IPage } from '@/config'
import { Project } from '@@/entities/project.entity'
import { IResponse } from '@@/types/response'
import { useRouter } from 'vue-router'
import { Modal } from '@/components/modal'
import ProjectModal from '@/components/modal/ProjectModal.vue'
import { Alert } from '@/utils/alert'
import SaveMaterialModal from '@/components/modal/SaveMaterialModal.vue'
import { SaveProjectDto } from '@@/dto/data.dto'
import { usePageStore } from '@/stores/page'
import { $t } from '@/constants/i18n'
import { placements } from 'floating-vue'
import MaterialCard from '@/components/widgets/MaterialCard.vue'

const router = useRouter()

const userStore = useUserStore()
const { userName, avatar } = storeToRefs(userStore)
const { updateAvatar } = userStore

const pageStore = usePageStore()
const { deleteMaterial } = pageStore

const { signOut, signIn, isAuthenticated } = useLogto()
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

let showMap = reactive<{
  [key: string]: (IMaterialItem | Project)[]
}>({})

let titleMap: { [key: string]: string } = {
  project: $t('project'),
  template: $t('template'),
  component: $t('component'),
  section: $t('section'),
}

onMounted(async () => {
  if (!isAuthenticated.value) {
    showMap['project'] = []
    return
  }
  const { data } = await projectApi.get<IResponse<Project[]>>('')
  showMap['project'] = data
  const res = await materialApi.get<IResponse<{ [type: string]: IMaterialItem[] }>>('', {
    query: { section: true, component: true, template: true, onlySelf: true },
  })
  ;['template', 'section', 'component'].forEach((key) => {
    if (res.data[key]?.length > 0) {
      showMap[key] = res.data[key]
    } else {
      showMap[key] = []
    }
  })
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
    Alert($t('deleteSuccess'))
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
  })
  curEditProject.name = project.name
  curEditProject.cover = project.cover
  showProjectModal = false
  curEditProject = null
  Alert($t('saveSuccess'))
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
    await deleteMaterial(material.id!)
    showMap[material.type] = (showMap[material.type] as IMaterialItem[]).filter(
      (p) => p.id !== material.id
    )
    Alert($t('deleteSuccess'))
  }
}
</script>

<template>
  <div class="me-page">
    <div class="user-info">
      <Avatar :image="avatar" :size="120" can-upload :on-upload="handleUpdateAvatar"></Avatar>
      <div v-if="!isAuthenticated">
        <Btn class="sign-btn" type="btn" color="primary" @click="handleSignIn">{{ $t('signIn') }}</Btn>
      </div>
      <template v-else>
        <div class="user-name">{{ userName }}</div>
        <Btn class="sign-btn" type="btn" color="default" @click="handleSignOut">{{ $t('signOut') }}</Btn>
      </template>
    </div>
    <div
      :class="['data-wrapper', `data-wrapper-${type}`]"
      v-for="(list, type) in showMap"
      v-show="type === 'project' || list.length > 0"
      :key="type"
    >
      <div class="data-title">{{ titleMap[type] }}</div>
      <div class="data-list">
        <MaterialCard
          v-if="type === 'project'"
          type="project"
          is-new
          @on-project-click="handleGotoProject"
        >
        </MaterialCard>
        <MaterialCard
          v-for="(item, index) in list"
          :key="item.name + index"
          :type="type"
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
  background: #e9e9e9;
  min-height: 100vh;
  font-family: $font-family;
  .user-info {
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $panel-gradient;
  }
  .user-name {
    margin-top: 20px;
    font-size: 30px;
    color: $yellow;
  }

  .sign-btn {
    margin-top: 10px;
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
  }
}
</style>
