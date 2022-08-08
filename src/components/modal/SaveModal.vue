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

const pageStore = usePageStore()
const { activeNode } = storeToRefs(pageStore)
const { fetchSaveNode } = pageStore

const node = $computed(() => activeNode.value ? useSourceNode(activeNode.value) : null)

let name = $ref('')
let enName = $ref('')
let isModule = ref(false)
let category = $ref('')
let categoryEn = $ref('')
let cover = $ref('')
let editor = $ref<JSONEditor | null>(null)

let modal = $ref<InstanceType<typeof Modal> | null>(null)

const initJSONEditor = () => {
  if (!node) return
  const elem = document.querySelector('.module-input') as HTMLDivElement
  if (!elem) return
  if (!editor) {
    editor = new JSONEditor(elem, {
      mode: 'text',
      mainMenuBar: false,
      navigationBar: false,
      statusBar: false,
    });
  }
  editor.set(node.moduleConfig || [{
    title: 'Title',
    icon: 'basic',
    data: [
      {
        type: 'text',
        label: 'Label',
        props: {},
        sourceValue: 'children[0].config.props.basic.text',
        targetValue: 'children[0].config.props.basic.text',
      }
    ]
  }] as IModuleConfigGroup[])
}

defineExpose({
  init: async () => {
    if (!node) return
    name = node.name
    enName = ''
    isModule.value = node.isModule || false
    category = ''
    categoryEn = ''
    cover = ''
    const elem = document.querySelector(`[data-name="${name}"]`) as HTMLElement
    cover = elem ? await createMaterialSnapshot(elem) : ''
    isModule && initJSONEditor()
  }
})

watch(isModule, (val: boolean) => {
  if (val) initJSONEditor()
})

const handleSave = async () => {
  if (!node) return
  try {
    await fetchSaveNode({
      name,
      enName,
      node: {
        ...node,
        isModule: isModule.value,
        moduleConfig: isModule.value && editor ? editor.get() : [],
      },
      category,
      categoryEn,
      cover,
    })
    Alert('Save Success')
    modal?.hide()
  } catch (e: any) {
    AlertError(e?.message || 'Save Error')
  }
}
</script>

<template>
  <Modal ref="modal" class="save-modal" :title="`Save ${node?.type || ''}`" :width="'70vw'" v-bind="$attrs">
    <div class="info-wrapper">
      <div class="info">
        <InputItem
          label="Name"
          v-model="name"
        ></InputItem>
        <InputItem
          label="Name(En)"
          v-model="enName"
        ></InputItem>
        <InputItem
          label="Category"
          v-model="category"
        ></InputItem>
        <InputItem
          label="Category(En)"
          v-model="categoryEn"
        ></InputItem>
        <SwitchItem
          label="Module"
          v-model="isModule"
        ></SwitchItem>
      </div>
      <ImageItem
        hide-label
        v-model="cover"
        wrapper-class="cover-wrapper"
        :rows="5"
      >
        <div class="cover" :style="{ backgroundImage: `url(${cover})` }"></div>
      </ImageItem>
    </div>
    <div class="module-setting-wrapper" v-show="isModule && node">
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
  .info-wrapper {
    display: flex;
    padding-bottom: 10px;
    .info {
      flex: 1;
    }
    .cover-wrapper {
      position: relative;
      flex: 1;
      margin-left: 24px;

      &:hover .cover {
        display: none;
      }

      .cover {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center center;
        cursor: pointer;
        background-color: $panel-dark;
        border-radius: $normal-radius;
        z-index: 1;
      }

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

    .save-btn {
      width: 100%;
    }
  }
}
</style>
