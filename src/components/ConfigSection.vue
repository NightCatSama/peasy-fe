<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigGroup from './ConfigGroup.vue'
import Icon from './widgets/Icon.vue'
import { useDisplayStore } from '@/stores/display'
import TagList from './biz/TagList.vue'
import { useKeyPress } from 'ahooks-vue'
import { ShortcutKey } from '@/constants/shortcut'
import TreeNode from './biz/TreeNode.vue'
import { isValidName } from '@/utils/validation'
import { Alert, AlertError } from '@/utils/alert'
import { emitter } from '@/utils/event'

const pageStore = usePageStore()
const { nameMap, pageData, activeNode, activeNodeGroups, activeNodeHide } = storeToRefs(pageStore)
const { getAllTags, setActiveNode, deleteActiveNode, copyActiveNode, separateActiveNode, setActiveNodeHide } =
  pageStore

const displayStore = useDisplayStore()
const { minimize } = storeToRefs(displayStore)
const { setMinimize } = displayStore

useKeyPress(ShortcutKey.SwitchConfigPanel, (e) => {
  e.preventDefault()
  setMinimize(!minimize.value)
})

let showLayer = $ref(false)

const handleActiveNodeChange = async (event: Event) => {
  const elem = event.target as HTMLDivElement
  elem.scrollLeft = 0
  if (!activeNode.value) return
  const newName = elem.innerText || ''
  if (newName === activeNode.value.name) return
  if (!isValidName(newName) || !newName) {
    AlertError('名字不合法')
    elem.innerText = activeNode.value.name
    return
  }
  if (nameMap.value[newName]) {
    AlertError('名字已存在')
    elem.innerText = activeNode.value.name
    return
  }
  activeNode.value.name = newName
}

const iconList: {
  hide?: boolean
  noMini?: boolean
  name: string
  tip: string
  click: () => void
}[] = $computed(() => [
  {
    noMini: true,
    name: 'layers',
    tip: 'Layers',
    click: () => (showLayer = true),
  },
  {
    hide: !activeNode.value?.isModule,
    name: 'separate',
    tip: 'Ungroup',
    click: separateActiveNode,
  },
  {
    hide: !!activeNodeHide.value,
    name: 'eye-slash',
    tip: 'Hidden',
    click: () => setActiveNodeHide(true),
  },
  {
    hide: !activeNodeHide.value,
    name: 'eye',
    tip: 'Visible',
    click: () => setActiveNodeHide(false),
  },
  {
    name: 'copy',
    tip: 'Copy',
    click: copyActiveNode,
  },
  {
    name: 'delete',
    tip: 'Delete',
    click: deleteActiveNode,
  },
])
</script>

<template>
  <div :class="['config-section', { minimize: minimize }]">
    <Icon
      class="mini-btn"
      type="circle"
      name="down"
      :size="12"
      @click="setMinimize(!minimize)"
    ></Icon>
    <div class="config-mini-main">
      <div class="top"></div>
      <div class="mini-content" v-if="activeNode">
        <ConfigGroup
          v-for="(groupType, index) in activeNodeGroups"
          :group-type="groupType"
          :index="index"
          :minimize="true"
          :key="groupType + activeNode.name + index + '_mini'"
        ></ConfigGroup>
      </div>
      <div class="bottom" v-if="activeNode">
        <template v-for="(item, index) in iconList" :key="index">
          <Icon
            v-if="!item.hide && !item.noMini"
            :class="['op-icon', `${item.name}-icon`]"
            :name="item.name"
            :size="16"
            v-tooltip="{ content: item.tip, placement: 'left' }"
            @click="item.click"
          ></Icon>
        </template>
      </div>
    </div>
    <div class="config-main">
      <div v-if="activeNode && !showLayer">
        <div class="header">
          <div
            class="title"
            contenteditable="true"
            @keydown.enter.stop="(e: Event) => (e.target as HTMLDivElement)?.blur()"
            @blur="handleActiveNodeChange"
          >
            {{ activeNode.name }}
          </div>
          <template v-for="(item, index) in iconList" :key="index">
            <Icon
              v-if="!item.hide"
              :class="['op-icon', `${item.name}-icon`]"
              :name="item.name"
              :size="13"
              v-tooltip="item.tip"
              @click="item.click"
            ></Icon>
          </template>
        </div>
        <TagList
          :tags="activeNode.tags"
          :auto-complete-tags="getAllTags()"
          @change="(newTags: string[]) => activeNode!.tags = newTags"
        ></TagList>
        <div class="content">
          <ConfigGroup
            v-for="(groupType, index) in activeNodeGroups"
            :group-type="groupType"
            :index="index"
            :key="groupType + activeNode.name + index"
          ></ConfigGroup>
        </div>
      </div>
      <div class="layers" v-else>
        <div class="header">
          <div class="title">Layers</div>
          <Icon
            v-if="activeNode"
            class="op-icon separate-icon"
            name="layers-slash"
            :size="16"
            v-tooltip="'Setting'"
            @click="showLayer = false"
          ></Icon>
        </div>
        <div class="content layers-content">
          <TreeNode v-for="node in pageData" :key="node.name" :node="node"> </TreeNode>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
$mini-width: 50px;
$header-height: 54px;
.config-section {
  position: relative;
  color: $color;
  background: $panel;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: $config-width;
  flex-shrink: 0;
  transition: all 0.3s;
  will-change: margin-right;

  .config-main {
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .config-mini-main {
    position: absolute;
    top: 0;
    left: 100%;
    width: $mini-width;
    height: 100%;
    background: $panel;
    transition: all 0.3s;
    opacity: 0;
    z-index: $config-mini-panel-zIndex;
    display: flex;
    flex-direction: column;

    .top {
      width: 100%;
      height: $header-height;
    }
  }

  &.minimize {
    margin-right: -($config-width - $mini-width);

    .config-main {
      opacity: 0;
    }
    .config-mini-main {
      left: 0;
      opacity: 1;
    }
    .mini-btn {
      transform: translateX(38px) rotateZ(90deg);
    }
  }

  .mini-btn {
    position: absolute;
    right: 100%;
    top: 15px;
    padding: 6px;
    z-index: $config-btn-zIndex;
    transform: translateX(-10px) rotateZ(-90deg);
    background-color: $panel-light;
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      background-color: $theme;
    }
  }

  .header {
    display: flex;
    padding: 0 16px;
    height: $header-height;
    align-items: center;

    .title {
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      color: $yellow;
      margin-right: 10px;
      white-space: nowrap;

      &:not(:focus) {
        text-overflow: ellipsis;
      }

      &:focus {
        outline: none;
      }
    }
  }

  .mini-content {
    flex: 1;
    overflow-y: auto;
  }

  .bottom {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;

    .op-icon {
      width: 100%;
      height: 44px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-top: 1px solid $border;
      border-radius: 0;
      margin-left: 0;
      cursor: pointer;
      &:last-child {
        border-bottom: 1px solid $border;
      }
    }
  }

  .content {
    padding-bottom: 44px;
  }

  .layers {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .layers-content {
    font-size: 18px;
    padding: 16px;
    background: $panel-content;
    flex: 1;
    overflow-y: auto;
  }
}

.op-icon {
  padding: 5px;
  cursor: pointer;
  margin-left: 0px;
  transition: all 0.1s;

  &.delete-icon {
    color: $color;

    &:hover {
      color: $red;
    }
  }
  &.copy-icon {
    color: $color;

    &:hover {
      color: $theme;
    }
  }
  &.eye-slash-icon {
    color: $color;

    &:hover {
      color: $orange;
    }
  }
  &.eye-icon {
    color: $orange;
  }
  &.separate-icon,
  &.layers-icon {
    color: $color;

    &:hover {
      color: $pink;
    }
  }
}
</style>
