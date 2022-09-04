<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import InputItem from '../configs/items/InputItem.vue'
import Btn from '../widgets/Btn.vue'
import Modal from './Modal.vue'
import { createMaterialSnapshot } from '@/utils/snapshot'
import ImageItem from '../configs/items/ImageItem.vue'
import { Alert, AlertError, AlertLoading } from '@/utils/alert'
import { reactive, useAttrs, watch } from 'vue'
import { $t } from '@/constants/i18n'
import { uploadByBase64 } from '@/utils/oss'
import SwitchItem from '../configs/items/SwitchItem.vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { verifySubDomain } from '@/utils/validation'
import { usePageStore } from '@/stores/page'

interface IProjectModalProps {
  project: IProject
  hideCreateCover?: boolean
}

const userStore = useUserStore()
const { isVIP } = storeToRefs(userStore)

const pageStore = usePageStore()
const { allProjectData } = storeToRefs(pageStore)

const { project, hideCreateCover } = defineProps<IProjectModalProps>()
const propsRef = reactive(useAttrs())

const emit = defineEmits(['save'])
const defaultDomain = $computed(() => isVIP.value ? 'your-domain' : '')
let editProject: IProject | null = $ref({
  name: '',
  cover: '',
  isPublic: false,
  domain: defaultDomain,
  host: '',
  filename: '',
})

let modal = $ref<InstanceType<typeof Modal> | null>(null)

const isSubPage = $computed(() => project?.parentPage)

watch(
  () => [project, propsRef.modelValue],
  () => {
    if (propsRef.modelValue && editProject) {
      editProject.id = project.id
      editProject.name = project.name
      editProject.cover = project.cover
      editProject.isPublic = !!project.isPublic
      editProject.domain = project.domain || defaultDomain
      editProject.host = project.host || ''
      editProject.filename = project.filename || ''
      editProject.parentPage = project?.parentPage || ''
    }
  },
  { immediate: true }
)

const handleSave = () => {
  if (!editProject?.name) {
    AlertError($t('projectNameRequired'))
    return
  }
  if (isSubPage && !editProject?.filename) {
    AlertError($t('projectFilenameRequired'))
    return
  }
  // Filename 不允许重复
  if (
    isSubPage &&
    (
      editProject?.filename === 'index' ||
      Object.values(allProjectData.value || [])
        .find((item) => editProject?.id !== item.id && editProject?.filename === item.filename)
    )
  ) {
    AlertError($t('projectFilenameExist'))
    return
  }
  if (editProject.domain && !verifySubDomain(editProject.domain)) {
    return
  }
  emit('save', editProject)
}

let coverLoading = $ref(false)
const handleCreateCover = async () => {
  if (!editProject) return
  try {
    coverLoading = true
    const elem = document.querySelector(`.edit-content`) as HTMLElement
    const cover = elem ? await createMaterialSnapshot(elem) : ''
    if (cover.length >= 10000) {
      const url = await uploadByBase64(cover)
      editProject.cover = url!
    } else {
      editProject.cover = cover
    }
  } finally {
    coverLoading = false
  }
}

const verifyDomain = (event: Event) => {
  if (!editProject) return
  const elem = event.target as HTMLDivElement
  elem.scrollLeft = 0
  const text = elem.innerText
  verifySubDomain(text)
  elem.innerText = text.replace(/[^a-zA-Z0-9-]/g, '').toLocaleLowerCase()
  editProject.domain = elem.innerText
}

const filename = $computed({
  get() {
    return editProject?.filename || ''
  },
  set(value) {
    if (editProject) {
      editProject.filename = value
    }
  },
})
</script>

<template>
  <Modal
    ref="modal"
    class="project-modal"
    :title="$t('projectSetting')"
    :width="'360px'"
    close-on-click-mask
    v-bind="$attrs"
  >
    <div class="info-wrapper" v-if="editProject">
      <InputItem v-if="isSubPage" :label="$t('filename')" v-model="filename"></InputItem>
      <InputItem :label="$t('name')" v-model="editProject.name"></InputItem>
      <ImageItem
        :label="$t('cover')"
        :loading="coverLoading"
        v-model="editProject.cover"
        :rows="5">
      </ImageItem>
      <template v-if="!isSubPage">
        <SwitchItem
          v-model="editProject.isPublic"
          :label="$t('isPublic')"
          :tip="$t('isPublicTip')"
        >
        </SwitchItem>
        <div class="domain-input item" v-if="editProject.isPublic">
          <div class="label">{{ $t('domain') }}</div>
          <div class="domain">
            <span
              :class="['sub-domain', { disabled: !isVIP }]"
              :contenteditable="isVIP ? 'true' : 'false'"
              v-tooltip="{ content: $t('domainTip'), disabled: isVIP }"
              @keydown.enter.stop="(e: Event) => (e.target as HTMLDivElement)?.blur()"
              @blur="verifyDomain"
            >{{ editProject.domain || (isVIP ? '' : $t('domainRandom')) }}</span>
            <span>.p-easy.net</span>
          </div>
        </div>
      </template>
    </div>
    <div class="btn-wrapper">
      <div class="btn-wrapper-left">
        <Btn
          v-if="!hideCreateCover"
          class="create-cover-btn"
          type="text"
          size="sm"
          @click="handleCreateCover"
          >{{ $t('autoCreateCover') }}</Btn
        >
      </div>
      <Btn class="save-btn" type="inner" :text="$t('save')" @click="handleSave"></Btn>
    </div>
  </Modal>
</template>

<style lang="scss">
.project-modal {
  .info-wrapper {
    display: flex;
    flex-direction: column;
    padding-bottom: 10px;
  }
  .item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
    .label {
      flex: none;
      width: 60px;
      margin-right: 12px;
      font-size: 14px;
    }
    .input {
      flex: 1;
    }
  }
  .domain-input {
    .label {
      flex: 1;
    }
    .domain {
      font-size: 14px;
      color: $grey;
      display: flex;
      align-items: center;

      .sub-domain {
        position: relative;
        top: 1px;
        display: inline-flex;
        color: $blue;
        background: $panel-dark;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: $inner-radius;
        margin-right: 4px;
        outline: none;
        border: none;
        min-width: 20px;
        text-align: right;
        max-width: 120px;
        overflow-x: auto;
        white-space: nowrap;

        &:focus {
          outline: none;
          border: none;
        }

        &.disabled {
          color: $panel-light;
          cursor: not-allowed;
        }
      }
    }
  }

  .module-setting-wrapper {
    display: flex;
    height: 200px;
    padding: 8px;
    border-radius: $normal-radius;
    border: 1px dashed rgba($color, 60%);
    margin-bottom: 10px;

    .module-input {
      flex: 1;
      height: 100%;
      overflow: hidden;
      border-radius: $inner-radius 0 0 $inner-radius;
      .jsoneditor,
      .jsoneditor-outer,
      .jsoneditor-text {
        width: 100%;
        height: 100%;
      }
      .jsoneditor-text {
        resize: none;
        outline: none;
        border: none;
        background-color: $item-bg;
        color: $color;
        overflow: auto;
      }
    }
    .node-tree {
      width: 220px;
      height: 100%;
      overflow: auto;
      background: $panel-content;
      border-radius: 0 $inner-radius $inner-radius 0;
      padding: 8px;
    }
  }
  .btn-wrapper {
    display: flex;
    justify-content: flex-end;

    &-left {
      flex: 1;
      display: flex;
    }

    .create-cover-btn {
      margin-left: -4px;
      flex: none;
    }

    .save-btn {
      min-height: 36px;
      width: 120px;
    }
  }
  .image-item.column .label {
    width: 60px;
  }
}
</style>
