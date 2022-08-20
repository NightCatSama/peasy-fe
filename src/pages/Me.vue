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

const router = useRouter()

const userStore = useUserStore()
const { userName, avatar } = storeToRefs(userStore)
const { updateAvatar } = userStore

const pageStore = usePageStore()
const { deleteMaterial } = pageStore

const { signOut, signIn, isAuthenticated } = useLogto()
const handleSignIn = () => signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
const handleSignOut = () => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)

const handleUpdateAvatar = (img: string) => {
  updateAvatar(img)
}

let showProjectModal = $ref(false)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)
let curEditProject = $ref<Project | null>(null)

let showMap = reactive<{
  [key: string]: Project[] | IMaterialItem[]
}>({})
let titleMap = {
  project: $t('project'),
  template: $t('template'),
  component: $t('component'),
  section: $t('section'),
}

onMounted(async () => {
  if (!isAuthenticated) return
  const { data } = await projectApi.get<IResponse<Project[]>>('')
  showMap['project'] = data
  const res = await materialApi.get<IResponse<{ [type: string]: IMaterialItem[] }>>('', {
    query: { includeTemplate: true, onlySelf: true },
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
      name: 'create',
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
  // 有 id 则为更新
  if (curMaterial.id) {
    showMap[curMaterial.type] = showMap[curMaterial.type].map((m) => {
      if (m.id === curMaterial.id) {
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
    await deleteMaterial(material.id)
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
      :class="['data-wrapper', `data-wrapper-${key}`]"
      v-for="(list, key) in showMap"
      v-show="key === 'project' || list.length > 0"
      :key="key"
    >
      <div class="data-title">{{ titleMap[key] }}</div>
      <div class="data-list">
        <div class="data-item" v-if="key === 'project'">
          <div class="data-image create" @click="handleGotoProject()">
            <div class="data-image-placeholder">
              <Icon name="add" :size="24" />
              <span>{{ $t('newProject') }}</span>
            </div>
          </div>
          <div class="data-info"></div>
        </div>
        <div class="data-item" v-for="(item, index) in list" :key="item.name + index">
          <div
            class="data-image"
            :style="{ backgroundImage: item.cover ? `url(${item.cover})` : void 0 }"
            @click="
              key === 'project'
                ? handleGotoProject(item as Project)
                : handleMaterialImageClick(item as IMaterialItem)
            "
          >
            <div v-if="!item.cover" class="data-image-placeholder">
              <Icon name="empty" :size="32" />
              <span>{{ $t('notCover') }}</span>
            </div>
          </div>
          <div class="data-info">
            <div class="data-info-name">{{ item.name }}</div>
            <template v-if="key === 'project'">
              <Icon
                type="circle"
                class="data-info-btn"
                name="save"
                :size="9"
                v-tooltip="{ content: $t('saveToTemplate'), placement: 'top', distance: 10 }"
                @click="handleSaveToTemplate(item as Project)"
              ></Icon>
              <Icon
                type="circle"
                class="data-info-btn"
                name="advanced"
                :size="11"
                v-tooltip="{ content: $t('setting'), placement: 'top', distance: 10 }"
                @click="handleOpenProjectModal(item as Project)"
              ></Icon>
              <Icon
                type="circle"
                class="data-info-btn danger"
                name="delete"
                :size="10"
                v-tooltip="{ content: $t('delete'), placement: 'top', distance: 10 }"
                @click="handleDeleteProject(item as Project)"
              ></Icon>
            </template>
            <template v-else>
              <Icon
                type="circle"
                class="data-info-btn"
                name="advanced"
                :size="11"
                v-tooltip="{ content: $t('setting'), placement: 'top', distance: 10 }"
                @click="handleMaterialSetting(item as IMaterialItem)"
              ></Icon>
              <Icon
                type="circle"
                class="data-info-btn danger"
                name="delete"
                :size="10"
                v-tooltip="{ content: $t('delete'), placement: 'top', distance: 10 }"
                @click="handleDeleteMaterial(item as IMaterialItem)"
              ></Icon>
            </template>
          </div>
        </div>
      </div>
    </div>
    <ProjectModal
      v-model="showProjectModal"
      :project="curEditProject"
      hide-create-cover
      @save="handleSaveProject"
    ></ProjectModal>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="curMaterial.id ? $t('edit') : $t('saveOf')"
      :material="curMaterial"
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
    &.data-wrapper-project,
    &.data-wrapper-template {
      .data-item {
        width: 130px;
        height: 185px;
      }
    }
    &.data-wrapper-section,
    &.data-wrapper-component {
      .data-item {
        width: 150px;
        height: 130px;
      }
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
    .data-item {
      display: inline-flex;
      flex-direction: column;
      margin: 12px 24px 12px 0;

      .data-image {
        width: 100%;
        flex: 1;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: $normal-radius;
        color: $grey;
        background-color: $white;
        cursor: pointer;
        transition: all 0.3s;

        &.create {
          border: 2px dashed $grey;
          background-color: $tr;

          &:hover {
            color: $theme;
            border-color: $tr;
            background-color: $white;
            box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
          }
        }

        &:not(.create):hover {
          box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
        }

        &-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-size: 14px;

          .icon {
            margin-bottom: 8px;
          }
        }
      }

      .data-info {
        display: flex;
        align-items: center;
        padding: 6px 0px 6px 4px;
        height: 32px;
        &-name {
          color: $panel-light;
          font-size: 14px;
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &-btn {
          position: relative;
          top: -1px;
          left: 2px;
          width: 16px;
          height: 16px;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-left: 2px;
          color: $white;
          background: $panel-light;
          border-radius: $inner-radius;
          cursor: pointer;
          opacity: 0;
          display: none;
          transition: all 0.3s;
          &:hover {
            background: $panel;
          }
          &.danger {
            &:hover {
              background: $red;
            }
            // color: $red;
            // background: $red;
          }
        }
      }
      &:hover {
        .data-info-name {
          color: $panel;
        }
        .data-info-btn {
          opacity: 1;
          display: flex;
        }
      }
    }
  }
}
</style>
