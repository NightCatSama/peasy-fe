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

interface IProjectModalProps {
  project: IProject
  hideCreateCover?: boolean
}

const { project, hideCreateCover } = defineProps<IProjectModalProps>()
const propsRef = reactive(useAttrs())

const emit = defineEmits(['save'])
let editProject: IProject | null = $ref({
  name: '',
  cover: '',
})

let modal = $ref<InstanceType<typeof Modal> | null>(null)

watch(
  () => [project, propsRef.modelValue],
  () => {
    if (propsRef.modelValue && editProject) {
      editProject.name = project.name
      editProject.cover = project.cover
    }
  }
)

const handleSave = () => {
  if (!editProject?.name) {
    AlertError($t('projectNameRequired'))
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
      <InputItem :label="$t('name')" v-model="editProject.name"></InputItem>
      <ImageItem
        :label="$t('cover')"
        :loading="coverLoading"
        v-model="editProject.cover"
        :rows="5">
      </ImageItem>
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
