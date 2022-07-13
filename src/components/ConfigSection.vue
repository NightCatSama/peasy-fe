<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import ConfigItem from './ConfigItem.vue'
import { onMounted, ref, triggerRef } from 'vue'

const pageStore = usePageStore()

const { activeConfigData } = storeToRefs(pageStore)
</script>

<template>
  <div>
    <div v-if="activeConfigData">
      <div class="title">{{ activeConfigData.name }}</div>
      <div class="content">
        <div v-for="(group, key) in activeConfigData.groups">
          <div class="label">{{ group.title }}</div>
          <div class="desc" v-if="group.desc">{{ group.desc }}</div>
          <ConfigItem v-for="(item, index) in group.params" :configure="item"></ConfigItem>
        </div>
      </div>
    </div>
    <div v-else>请点击左侧元素</div>
  </div>
</template>

<style scoped></style>
