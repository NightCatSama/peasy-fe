<script setup lang="ts">
import { provide, onMounted } from 'vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

import LibComponent from '@/components/LibComponent.vue'
import ConfigSection from '@/components/ConfigSection.vue'
import { downloadHtml } from '@/utils/download'
import Sidebar from '@/components/Sidebar.vue'
import ConfigHeader from '@/components/ConfigHeader.vue'
import NodePanel from '@/components/NodePanel.vue'

provide('isEditMode', true)

const pageStore = usePageStore()

const { pageData, modelData } = storeToRefs(pageStore)
const { addSection, getAssetsData, getPageData, download } = pageStore

onMounted(() => {
  getAssetsData()
  getPageData()
})

const handleDownload = async () => {
  const res = await download()
  downloadHtml(res.data)
}
</script>

<template>
  <div class="page">
    <Sidebar></Sidebar>
    <div class="container">
      <ConfigHeader @download="handleDownload"></ConfigHeader>
      <!-- 页面主体内容 -->
      <div class="content">
        <!-- 左侧模板/组件选择区域 -->
        <NodePanel></NodePanel>
        <!-- 页面编辑区 -->
        <div class="edit-section">
          <LibComponent v-for="item in pageData" :item="item" :key="item.name"></LibComponent>
        </div>
        <!-- 右侧组件参数配置区 -->
        <div class="right" v-show="false">
          <ConfigSection></ConfigSection>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  color: $color;
}
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: $bg-default;

  .content {
    flex: 1;
    height: 100%;
    display: flex;

    .edit-section {
      flex: 1;
      height: 100%;
      overflow: auto;
    }

    .right {
      width: 300px;
      flex-shrink: 0;
      background-color: #ddd;
    }
  }
}
</style>
