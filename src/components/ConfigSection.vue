<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigItem from './ConfigItem.vue'
import { onMounted, ref, triggerRef } from 'vue'
import ConfigGroup from './ConfigGroup.vue';

const pageStore = usePageStore()
const { activeNode, activeNodeGroups } = storeToRefs(pageStore)

</script>

<template>
  <div class="config-section">
    <div v-if="activeNode">
      <div class="title">{{ activeNode.name }}</div>
      <div class="content">
        <ConfigGroup
          v-for="(groupType, key) in activeNodeGroups"
          :group-type="groupType"
          :key="groupType"
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

  .title {
    padding: 24px;
    font-size: 18px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .no-data {
    font-size: 18px;
    opacity: .5;
    align-self: center;
    margin-top: 80px;
  }
}
</style>
