<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigGroup from './ConfigGroup.vue'
import Icon from './widgets/Icon.vue'
import { useDisplayStore } from '@/stores/display'
import TagList from './biz/TagList.vue'
import { useKeyPress } from 'ahooks-vue'
import { ShortcutKey } from '@/constants/shortcut'

const pageStore = usePageStore()
const { allPageData, activeNode, activeParentNode, activeNodeGroups } = storeToRefs(pageStore)
const { getAllTags, setActiveNode, deleteActiveNode, copyActiveNode, separateActiveNode } = pageStore

const displayStore = useDisplayStore()
const { minimize } = storeToRefs(displayStore)
const { setMinimize } = displayStore

useKeyPress(ShortcutKey.SwitchConfigPanel, (e) => {
  e.preventDefault()
  setMinimize(!minimize.value)
})

</script>

<template>
  <div :class="['config-section', { minimize: minimize }]">
    <Icon class="mini-btn" type="circle" name="down" :size="12" @click="setMinimize(!minimize)"></Icon>
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
        <Icon
          v-if="activeNode.isModule"
          class="op-icon separate-icon"
          name="separate"
          :size="16"
          v-tooltip="{ content: 'Ungroup', placement: 'left' }"
          @click="separateActiveNode"
        ></Icon>
        <Icon
          class="op-icon copy-icon"
          name="copy"
          :size="16"
          v-tooltip="{ content: 'Copy', placement: 'left' }"
          @click="copyActiveNode"
        ></Icon>
        <Icon
          class="op-icon delete-icon"
          name="delete"
          :size="16"
          v-tooltip="{ content: 'Delete', placement: 'left' }"
          @click="deleteActiveNode"
        ></Icon>
      </div>
    </div>
    <div class="config-main">
      <div v-if="activeNode">
        <div class="header">
          <div class="title">{{ activeNode.name }}</div>
          <Icon
            v-if="activeNode.isModule"
            class="op-icon separate-icon"
            name="separate"
            :size="16"
            v-tooltip="'Ungroup'"
            @click="separateActiveNode"
          ></Icon>
          <Icon
            class="op-icon copy-icon"
            name="copy"
            :size="16"
            v-tooltip="'Copy'"
            @click="copyActiveNode"
          ></Icon>
          <Icon
            class="op-icon delete-icon"
            name="delete"
            :size="16"
            v-tooltip="'Delete'"
            @click="deleteActiveNode"
          ></Icon>
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
        </div>
        <div class="content layers-content">
          <div :style="{ marginBottom: '20px', color: 'pink' }">TODO: 后续替换成 Tree</div>
          <div v-for="(item, index) in allPageData" :key="item.name">
            {{ item.name }}
            <div
              v-if="item.children"
              v-for="subItem in item.children"
              :style="{ marginLeft: 20 + 'px' }"
              @click.stop="setActiveNode(subItem, item)"
            >
              - {{ subItem.name }}
              <div
                v-if="subItem.children"
                v-for="son in subItem.children"
                :style="{ marginLeft: 40 + 'px' }"
                @click.stop="setActiveNode(son, subItem)"
              >
                - {{ son.name }}
              </div>
            </div>
          </div>
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
  transition: all .3s;
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
    transition: all .3s;
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
      transform: translateX(40px) rotateZ(90deg);
    }
  }

  .mini-btn {
    position: absolute;
    right: 100%;
    top: 13px;
    padding: 6px;
    z-index: $config-btn-zIndex;
    transform: translateX(-10px) rotateZ(-90deg);
    background-color: $panel-light;
    transition: all .3s;
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
      text-overflow: ellipsis;
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
  }

  .layers-content {
    font-size: 18px;
    padding: 16px;
    background: $panel-content;
    flex: 1;
    overflow: auto;
  }
}

.op-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
  margin-left: 4px;
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
  &.separate-icon {
    color: $color;

    &:hover {
      color: $pink;
    }
  }
}

</style>
