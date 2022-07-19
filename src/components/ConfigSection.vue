<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigGroup from './ConfigGroup.vue'
import Icon from './widgets/Icon.vue';

const pageStore = usePageStore()
const { activeNode, activeNodeGroups } = storeToRefs(pageStore)
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
    <div class="no-data" v-else>TODO: 点击左侧组件</div>
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
    padding: 24px 16px;
    display: flex;
    .title {
      flex: 1;
      font-size: 18px;
      font-weight: bold;
      white-space: nowrap;
      overflow: hidden;
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

  .no-data {
    font-size: 18px;
    opacity: 0.5;
    align-self: center;
    margin-top: 80px;
  }
}
</style>
