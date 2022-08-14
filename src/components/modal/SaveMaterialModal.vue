<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import { DefaultColor, IMaterialItem, IModuleConfigGroup, PageNode, PageNodeType } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import SelectItem from '../configs/items/SelectItem.vue'
import Icon from '../widgets/Icon.vue'
import InputItem from '../configs/items/InputItem.vue'
import Btn from '../widgets/Btn.vue'
import SwitchItem from '../configs/items/SwitchItem.vue'
import Modal from './Modal.vue'
import { createMaterialSnapshot } from '@/utils/snapshot'
import { useAttrs, ref, watch, reactive, nextTick } from 'vue'
import { useSourceNode } from '@/utils/config'
import Input from '../widgets/Input.vue'
import TreeNode from '../biz/TreeNode.vue'
import JSONEditor from 'jsoneditor'
import ImageItem from '../configs/items/ImageItem.vue'
import { Alert, AlertError } from '@/utils/alert'
import { useUserStore } from '@/stores/user'
import { cloneDeep } from 'lodash'
import { uploadByBase64 } from '@/utils/oss'

interface SaveMaterialModalProps {
  modelValue: boolean
  material?: IMaterialItem
  autoCreateCover?: boolean
  actionText?: string
  onSave?: (material: IMaterialItem) => void
}

const { modelValue, material, autoCreateCover, actionText = 'Save', onSave } = defineProps<SaveMaterialModalProps>()

const pageStore = usePageStore()
const { fetchSaveMaterial } = pageStore

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

let editItem: IMaterialItem | null = $ref(null)
let coverLoading = $ref(false)

const isTemplate = $computed<boolean>(() => material?.type === 'template')
const node = $computed<PageNode | null>(() => (isTemplate ? null : (editItem?.node as PageNode)))
const isModule = $computed<boolean>({
  get() {
    return (!isTemplate && node?.isModule) || false
  },
  set(val: boolean) {
    if (val) initJSONEditor()
    editItem.node.isModule = val
  },
})

const initJSONEditor = () => {
  if (!editItem || !node) return
  const elem = document.querySelector('.module-input') as HTMLDivElement
  if (!elem) return
  if (!editor) {
    editor = new JSONEditor(elem, {
      mode: 'text',
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
    })
  }
  editor.set(
    node.moduleConfig ||
      ([
        {
          title: 'Title',
          icon: 'basic',
          data: [
            {
              type: 'text',
              label: 'Label',
              props: {},
              sourceValue: 'children[0].config.props.basic.text',
              targetValue: 'children[0].config.props.basic.text',
            },
          ],
        },
      ] as IModuleConfigGroup[])
  )
}

watch(
  () => [material, modelValue],
  async () => {
    console.log(modelValue)
    if (material && modelValue) {
      editItem = cloneDeep(material)
      nextTick(() => initJSONEditor())
      if (autoCreateCover) {
        coverLoading = true
        const elem = document.querySelector(`[data-name="${editItem.name}"]`) as HTMLElement
        const cover = elem ? await createMaterialSnapshot(elem) : ''
        if (cover.length >= 10000) {
          const url = await uploadByBase64(cover)
          editItem.cover = url
        } else {
          editItem.cover = cover
        }
        coverLoading = false
      }
    } else {
      editItem = null
    }
  },
  { immediate: true }
)

let editor = $ref<JSONEditor | null>(null)
let modal = $ref<InstanceType<typeof Modal> | null>(null)

const handleSave = async () => {
  if (!editItem.name) {
    AlertError('Name is required')
    return
  }
  const data = await fetchSaveMaterial({
    ...editItem,
    node: isTemplate
      ? null
      : ({
          ...node,
          isModule: node?.isModule || false,
          moduleConfig: node?.isModule && editor ? editor.get() : [],
        } as PageNode),
  })
  onSave?.(data)
  Alert('保存成功')
  modal?.hide()
}

const titleMap = {
  template: 'Template',
  component: 'Component',
  section: 'Section',
}
</script>

<template>
  <Modal
    ref="modal"
    class="save-modal"
    :title="`${actionText} ${titleMap[material.type]}`"
    :width="'70vw'"
    close-on-click-mask
    :model-value="modelValue"
    v-bind="$attrs"
  >
    <div class="info-wrapper" v-if="editItem">
      <div class="info">
        <InputItem label="Name" v-model="editItem.name"></InputItem>
        <InputItem v-if="isAdmin" label="Name(En)" v-model="editItem.enName"></InputItem>
        <InputItem label="Category" v-if="!isTemplate" v-model="editItem.category"></InputItem>
        <InputItem
          v-if="isAdmin && !isTemplate"
          label="Category(En)"
          v-model="editItem.categoryEn"
        ></InputItem>
        <SwitchItem v-if="isAdmin && !isTemplate" label="Module" v-model="isModule"></SwitchItem>
      </div>
      <ImageItem hide-label v-model="editItem.cover" :loading="coverLoading" wrapper-class="image-item" :rows="5"></ImageItem>
    </div>
    <div class="module-setting-wrapper" v-show="isAdmin && isModule">
      <div class="module-input"></div>
      <div class="node-tree" v-if="node">
        <TreeNode :node="node" :preview="true"></TreeNode>
      </div>
    </div>
    <div class="btn-wrapper">
      <Btn class="save-btn" type="inner" text="Save" @click="handleSave"></Btn>
    </div>
  </Modal>
</template>

<style lang="scss">
.save-modal {
  max-width: 900px;
  .info-wrapper {
    display: flex;
    min-height: 180px;
    padding-bottom: 10px;
    .info {
      flex: 1;
    }
    .image-item {
      position: relative;
      flex: 1;
      margin-left: 24px;

      .input {
        height: 100%;
      }
    }
  }
  .item {
    display: flex;
    align-items: center;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
    .label {
      flex: 1;
      margin-right: 10px;
      font-size: 14px;
    }
    .input-wrapper {
      width: 180px;
      padding: 0;

      input {
        padding: 0 8px;
      }
    }
  }

  .module-setting-wrapper {
    display: flex;
    height: 300px;
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

    .save-btn {
      min-height: 36px;
      width: 120px;
    }
  }
}
</style>
