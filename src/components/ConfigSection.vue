<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigGroup from './ConfigGroup.vue'
import Icon from './widgets/Icon.vue';

const pageStore = usePageStore()
const { allPageData, activeNode, activeNodeGroups } = storeToRefs(pageStore)
const { deleteActiveNode } = pageStore
</script>

<template>
  <div class="config-section">
    <div v-if="activeNode">
      <div class="header">
        <div class="title">{{ activeNode.name }}</div>
        <Icon class="delete-icon" name="delete" type="btn" :size="16" @click="deleteActiveNode"></Icon>
      </div>
      <div class="content">
        <ConfigGroup
          v-for="(groupType, index) in activeNodeGroups"
          :group-type="groupType"
          :key="groupType + activeNode.name"
        ></ConfigGroup>
      </div>
    </div>
    <div class="layers" v-else>
      <div class="header">
        <div class="title">Layers</div>
      </div>
      <div class="content layers-content">
        <div :style="{ marginBottom: '20px', color: 'pink' }">TODO: 后续替换成 Tree</div>
        <div
          v-for="(item, index) in allPageData"
          :key="item.name"
        >
          {{ item.name }}
          <div
            v-if="item.children"
            v-for="subItem in item.children"
            :style="{ marginLeft: 20 + 'px' }"
          >
            - {{ subItem.name }}
            <div
              v-if="subItem.children"
              v-for="son in subItem.children"
              :style="{ marginLeft: 40 + 'px' }"
            >- {{ son.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.config-section {
  color: $color;
  background: $panel;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    padding: 20px 16px;
    display: flex;

    .title {
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
      color: $yellow;
      text-overflow: ellipsis;
    }
    .delete-icon {
      width: 24px;
      height: 24px;
      border-radius: $normal-radius;
      cursor: pointer;
      color: $bg-default;
      background: $red-gradient;
      box-shadow: $float-shadow;
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
</style>
