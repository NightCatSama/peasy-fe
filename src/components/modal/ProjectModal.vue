<script lang="ts">
export default {
  inheritAttrs: true
}
</script>

<script setup lang="ts">
import { DefaultColor, IModuleConfigGroup, PageNode } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import SelectItem from '../configs/items/SelectItem.vue'
import Icon from '../widgets/Icon.vue'
import InputItem from '../configs/items/InputItem.vue'
import Btn from '../widgets/Btn.vue'
import SwitchItem from '../configs/items/SwitchItem.vue'
import Modal from './Modal.vue'
import { createMaterialSnapshot } from '@/utils/snapshot'
import { useAttrs, ref, watch } from 'vue'
import { useSourceNode } from '@/utils/config'
import Input from '../widgets/Input.vue'
import TreeNode from '../biz/TreeNode.vue'
import JSONEditor from 'jsoneditor'
import ImageItem from '../configs/items/ImageItem.vue'
import { Alert, AlertError } from '@/utils/alert'
import { useUserStore } from '@/stores/user'

const pageStore = usePageStore()
const { activeNode, project } = storeToRefs(pageStore)
const { fetchSaveMaterial } = pageStore

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const node = $computed(() => activeNode.value ? useSourceNode(activeNode.value) : null)
const emit = defineEmits(['save'])

let modal = $ref<InstanceType<typeof Modal> | null>(null)

const handleSave = () => {
  if (!project.value.name) {
    AlertError('Project Name not empty')
    return
  }
  emit('save')
}

const handleCreateCover = async () => {
  const elem = document.querySelector(`.edit-content`) as HTMLElement
  project.value.cover = elem ? await createMaterialSnapshot(elem) : ''
}
</script>

<template>
  <Modal ref="modal" class="project-modal" :title="`Save Project`" :width="'360px'" v-bind="$attrs">
    <div class="info-wrapper">
      <InputItem
        label="Name"
        v-model="project.name"
      ></InputItem>
      <ImageItem
        label="Cover"
        v-model="project.cover"
        :rows="5"
      >
      </ImageItem>
    </div>
    <div class="btn-wrapper">
      <Btn class="create-cover-btn" type="text" size="sm" @click="handleCreateCover">Auto Create Cover</Btn>
      <Btn class="save-btn" type="inner" text="Save" @click="handleSave"></Btn>
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
      .jsoneditor, .jsoneditor-outer, .jsoneditor-text {
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

    .create-cover-btn {
      flex: 1;
    }

    .save-btn {
      min-height: 36px;
      width: 120px;
    }
  }
}
</style>
