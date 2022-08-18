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
import Dropdown from './widgets/Dropdown.vue'
import SaveMaterialModal from './modal/SaveMaterialModal.vue'
import { IMaterialItem } from '@/config'
import { $t } from '@/constants/i18n'

const pageStore = usePageStore()
const { nameMap, pageData, activeNode, activeNodeGroups, activeNodeHide, setting } =
  storeToRefs(pageStore)
const {
  unlinkActiveNodeProp,
  switchActiveNodeConfigMode,
  getAllTags,
  setActiveNode,
  deleteActiveNode,
  copyActiveNode,
  separateActiveNode,
  setActiveNodeHide,
} = pageStore

const displayStore = useDisplayStore()
const { minimize, deviceType } = storeToRefs(displayStore)
const { setMinimize } = displayStore

let showLayer = $ref(false)
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)

const handleActiveNodeChange = async (event: Event) => {
  const elem = event.target as HTMLDivElement
  elem.scrollLeft = 0
  if (!activeNode.value) return
  const newName = elem.innerText || ''
  if (newName === activeNode.value.name) return
  if (!isValidName(newName) || !newName) {
    AlertError($t('nameValidTip'))
    elem.innerText = activeNode.value.name
    return
  }
  if (nameMap.value[newName]) {
    AlertError($t('nameExistTip'))
    elem.innerText = activeNode.value.name
    return
  }
  activeNode.value.name = newName
}

/** 是否不需要取消链接选项 */
const disabledUnlinkDropdown = $computed(
  () => !activeNode.value || !activeNode.value.children || activeNode.value.children.length === 0
)

/** 取消组件配置关联 */
const handleUnlink = (includeChildren?: boolean) => unlinkActiveNodeProp(includeChildren)

const handleFocusLinkNode = () =>
  activeNode.value &&
  activeNode.value?.propLink &&
  nameMap.value[activeNode.value.propLink] &&
  setActiveNode(nameMap.value[activeNode.value.propLink])

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
    tip: $t('layers'),
    click: () => (showLayer = true),
  },
  {
    hide: !activeNode.value?.isModule,
    name: 'separate',
    tip: $t('ungroup'),
    click: separateActiveNode,
  },
  {
    hide: !!activeNodeHide.value,
    name: 'eye-slash',
    tip: $t('hidden'),
    click: () => setActiveNodeHide(true),
  },
  {
    hide: !activeNodeHide.value,
    name: 'eye',
    tip: $t('visible'),
    click: () => setActiveNodeHide(false),
  },
  {
    // hide: !activeNode.value?.isModule,
    name: 'save',
    tip: $t('save'),
    click: () => {
      setCurMaterial()
      showSaveMaterialModal = true
    },
  },
  {
    name: 'copy',
    tip: $t('copy'),
    click: copyActiveNode,
  },
  {
    name: 'delete',
    tip: $t('delete'),
    click: deleteActiveNode,
  },
])

/** 保存为物料 */
useKeyPress(ShortcutKey.saveMaterial, (e: KeyboardEvent) => {
  if (!activeNode.value) return
  setCurMaterial()
  showSaveMaterialModal = true
})

/** 缩小配置栏 */
useKeyPress(ShortcutKey.SwitchConfigPanel, (e) => {
  e.preventDefault()
  setMinimize(!minimize.value)
})

useKeyPress(ShortcutKey.copyComponent, (e) => {
  e.preventDefault()
  copyActiveNode()
})

const setCurMaterial = () => {
  if (!activeNode.value) return
  curMaterial = {
    name: activeNode.value.name,
    enName: '',
    type: activeNode.value.type,
    category: '',
    categoryEn: '',
    cover: activeNode.value.cover || '',
    node: activeNode.value,
  }
}
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
        </div>
        <div class="op-icon-wrapper">
          <div
            class="op-icon-btn"
            v-for="(item, index) in iconList"
            :key="index"
            v-show="!item.hide"
          >
            <Icon
              :class="['op-icon', `${item.name}-icon`]"
              :name="item.name"
              :size="13"
              v-tooltip="item.tip"
              @click="item.click"
            ></Icon>
          </div>
          <div class="link-btn-wrapper">
            <Dropdown
              v-if="activeNode.propLink"
              type="pure"
              :disabled="disabledUnlinkDropdown"
              popper-class="link-dropdown"
              placement="bottom-end"
              :distance="0"
              :skidding="-5"
            >
              <div
                class="op-icon-btn link-btn"
                @click="() => (disabledUnlinkDropdown ? handleUnlink(false) : null)"
              >
                <Icon :name="activeNode.propLink ? 'link-broken' : 'link'" :size="14"></Icon>
                {{ $t('unlink') }}<span class="link-text" @click.stop="handleFocusLinkNode">{{
                  activeNode.propLink
                }}</span>
              </div>
              <template #content>
                <div class="select-option" @click="() => handleUnlink(false)">{{ $t('unlinkSelf') }}</div>
                <div class="select-option" @click="() => handleUnlink(true)">{{ $t('unlinkAll') }}</div>
              </template>
            </Dropdown>
          </div>
        </div>
        <TagList
          v-if="!activeNode.isModule"
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
          <div class="title">{{ $t('layers') }}</div>
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
    <SaveMaterialModal
      v-if="curMaterial"
      auto-create-cover
      :action-text="$t('saveOf')"
      :material="curMaterial"
      v-model="showSaveMaterialModal"
    ></SaveMaterialModal>
  </div>
</template>

<style lang="scss" scoped>
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
      height: $mini-header-height;
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
      transform: translateX((24px + $mini-width) * 0.5) rotateZ(90deg);
    }
  }

  .mini-btn {
    position: absolute;
    right: 100%;
    top: ($mini-header-height - 24px) * 0.5;
    padding: 6px;
    z-index: $config-btn-zIndex;
    transform-origin: center;
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
    height: $config-header-height;
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
      height: $mini-item-height;
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

.op-icon-wrapper {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 0px 8px 4px 8px;
  .link-btn-wrapper {
    display: flex;
    justify-content: flex-end;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
  }
  .op-icon-btn {
    font-size: 12px;
    display: flex;
    align-items: center;
    background: $panel-dark;
    margin: 0 4px 4px 0;
    border-radius: $inner-radius;
    overflow: hidden;
    cursor: pointer;

    &.link-btn {
      padding-right: 8px;
      .link-text {
        margin-left: 4px;
        color: $orange;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          color: $theme;
          // text-decoration: underline;
          border-bottom: 1px solid $theme;
        }
      }
      &:hover {
        color: $orange;
      }
    }
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
  &.save-icon,
  &.layers-icon {
    color: $color;

    &:hover {
      color: $pink;
    }
  }
}
</style>

<style lang="scss">
.link-dropdown {
  display: flex;
  flex-direction: column;
  background: $panel-dark;
  border-radius: $normal-radius;
  padding: 3px;
  transition: all 0.3s;
  z-index: $select-zIndex;
  min-width: 120px;
  border: 1px solid $theme;
  max-height: 320px;
  overflow-y: auto;

  .select-option {
    padding: 4px 12px 4px 8px;
    font-size: 12px;
    color: darken($color, 20%);
    background: $tr;
    border-radius: $inner-radius;
    white-space: nowrap;
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    &:not(:last-child) {
      margin-bottom: 4px;
    }

    &:hover {
      color: $theme;
      background: rgba($theme, 8%);
    }
  }
}
</style>
