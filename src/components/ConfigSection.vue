<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigItem from './ConfigItem.vue'
import { onMounted, ref, triggerRef } from 'vue'

const pageStore = usePageStore()

const { activeConfigData } = storeToRefs(pageStore)
</script>

<template>
  <div class="config-section">
    <div v-if="activeConfigData">
      <div class="title">{{ activeConfigData.name }}</div>
      <div class="content">
        <div v-for="(group, key) in activeConfigData.groups">
          <div class="label">{{ group.title }}</div>
          <!-- <div class="desc" v-if="group.desc">{{ group.desc }}</div> -->
          <ConfigItem v-for="(item, index) in group.params" :configure="item"></ConfigItem>
        </div>
      </div>
    </div>
    <div class="no-data" v-else>TODO: 点击左侧组件</div>
  </div>
</template>

<style lang="scss" scoped>
.config-section {
  color: $color;
  background-color: $panel;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  .no-data {
    font-size: 18px;
    opacity: .5;
    align-self: center;
    margin-top: 80px;
  }
}
</style>
