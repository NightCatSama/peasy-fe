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
import { watch, nextTick } from 'vue'
import TreeNode from '../biz/TreeNode.vue'
import ImageItem from '../configs/items/ImageItem.vue'
import { Alert, AlertError } from '@/utils/alert'
import { useUserStore } from '@/stores/user'
import { cloneDeep } from 'lodash-es'
import { uploadByBase64 } from '@/utils/oss'
import { createJSONEditor } from '@/utils/jsoneditor'
import { $t } from '@/constants/i18n'
import type JSONEditor from 'jsoneditor'

interface SaveMaterialModalProps {
  modelValue: boolean
  material?: IMaterialItem
  autoCreateCover?: boolean
  actionText?: string
  onSave?: (material: IMaterialItem) => void
}

const { modelValue, material, autoCreateCover, actionText = $t('save'), onSave } = defineProps<SaveMaterialModalProps>()

const pageStore = usePageStore()
const { fetchSaveMaterial } = pageStore

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

let editItem: IMaterialItem | null = $ref(null)
let coverLoading = $ref(!!autoCreateCover)

let moduleConfigEditor = $ref<JSONEditor | null>(null)
let moduleDependenceElemEditor = $ref<JSONEditor | null>(null)
let modal = $ref<InstanceType<typeof Modal> | null>(null)

const isTemplate = $computed<boolean>(() => material?.type === 'template')
const node = $computed<PageNode | null>(() => (isTemplate ? null : (editItem?.node as PageNode)))
const isModule = $computed<boolean>({
  get() {
    return (!isTemplate && node?.isModule) || false
  },
  set(val: boolean) {
    if (val) {
      nextTick(() => initJSONEditor())
    }
    editItem.node.isModule = val
  },
})

const initJSONEditor = async () => {
  if (!editItem || !node || !isAdmin) return
  moduleConfigEditor = await createJSONEditor('.module-config')
  moduleDependenceElemEditor = await createJSONEditor('.module-dependence')
  if (!moduleConfigEditor || !moduleDependenceElemEditor) return
  moduleConfigEditor.set(
    node.moduleConfig?.length > 0 ? node.moduleConfig :
      ([
        {
          title: '标题',
          titleEn: 'Title',
          icon: 'basic',
          data: [
            {
              type: 'text',
              label: '文本',
              labelEn: 'Text',
              props: {},
              sourceValue: 'children[0].config.props.basic.text',
              targetValue: 'children[0].config.props.basic.text',
            },
          ],
        },
      ] as IModuleConfigGroup[])
  )
  moduleDependenceElemEditor.set(
    node.moduleDependence || {
      customFontFace: '',
      colorVars: [{ name: '$love', color: 'pink' }]
    } as PageNode['moduleDependence']
  )
}

watch(
  () => [material, modelValue],
  async () => {
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
      moduleConfigEditor?.destroy()
      moduleDependenceElemEditor?.destroy()
    }
  },
  { immediate: true }
)

const handleSave = async () => {
  if (!editItem.name) {
    AlertError($t('nameRequired'))
    return
  }
  const data = await fetchSaveMaterial({
    ...editItem,
    node: isTemplate
      ? null
      : ({
          ...node,
          isModule: node?.isModule || false,
          moduleConfig: node?.isModule && moduleConfigEditor ? moduleConfigEditor.get() : [],
          moduleDependence: node?.isModule && moduleDependenceElemEditor ? moduleDependenceElemEditor.get() : null,
        } as PageNode),
  })
  onSave?.(data)
  Alert($t('saveSuccess'))
  modal?.hide()
}

const titleMap = {
  template: $t('template'),
  component: $t('component'),
  section: $t('section'),
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
        <InputItem :label="$t('name')" v-model="editItem.name"></InputItem>
        <InputItem v-if="isAdmin" :label="$t('nameEn')" v-model="editItem.enName"></InputItem>
        <InputItem :label="$t('category')" v-if="!isTemplate" v-model="editItem.category"></InputItem>
        <InputItem
          v-if="isAdmin && !isTemplate"
          :label="$t('categoryEn')"
          v-model="editItem.categoryEn"
        ></InputItem>
        <SwitchItem v-if="isAdmin && !isTemplate" :label="$t('moduleSwitch')" v-model="isModule"></SwitchItem>
      </div>
      <ImageItem hide-label v-model="editItem.cover" :loading="coverLoading" wrapper-class="image-item" :rows="5"></ImageItem>
    </div>
    <div class="module-setting-wrapper" v-if="isAdmin && isModule">
      <div class="module-config-wrapper">
        <div class="module-input module-config"></div>
        <div class="node-tree" v-if="node">
          <TreeNode :node="node" :preview="true"></TreeNode>
        </div>
      </div>
      <div class="module-dependence-wrapper">
        <div class="module-input module-dependence"></div>
      </div>
    </div>
    <div class="btn-wrapper">
      <Btn class="save-btn" type="inner" :text="$t('save')" @click="handleSave"></Btn>
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
    flex-direction: column;
    height: 300px;
    padding: 8px;
    overflow: hidden;
    border-radius: $normal-radius;
    border: 1px dashed rgba($color, 60%);
    margin-bottom: 10px;

    .module-config-wrapper {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .module-dependence-wrapper {
      height: 80px;
      flex-shrink: 0;
      overflow: hidden;
    }

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
