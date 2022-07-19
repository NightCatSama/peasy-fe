<script setup lang="ts">
import { provide, onMounted, nextTick } from 'vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

import ConfigSection from '@/components/ConfigSection.vue'
import { downloadHtml } from '@/utils/download'
import Sidebar from '@/components/Sidebar.vue'
import ConfigHeader from '@/components/ConfigHeader.vue'
import MaterialsPanel from '@/components/MaterialsPanel.vue'
import EditSection from '@/components/EditSection.vue'
import { emitter } from '@/utils/event'

provide('isEditMode', true)

const pageStore = usePageStore()

const { pageData, modelData } = storeToRefs(pageStore)
const { addSection, getAssetsData, getPageData, download } = pageStore

const handleDownload = async () => {
  const res = await download()
  downloadHtml(res.data)
}

let showLeftPanel = $ref(false)

onMounted(() => {
  getAssetsData()
  getPageData()

  emitter.on('switchMaterialsPanel', (show: boolean) => {
    showLeftPanel = show
  })
})
</script>

<template>
  <div class="page">
    <Sidebar
      :active-materials-panel="showLeftPanel"
      @change-materials-panel="(val) => (showLeftPanel = val)"
    ></Sidebar>
    <div class="container">
      <ConfigHeader @download="handleDownload"></ConfigHeader>
      <!-- 页面主体内容 -->
      <div class="content">
        <!-- 左侧模板/组件选择区域 -->
        <div :class="['left-panel', { show: showLeftPanel }]">
          <MaterialsPanel></MaterialsPanel>
        </div>
        <!-- 页面编辑区 -->
        <EditSection></EditSection>
        <!-- 右侧组件参数配置区 -->
        <div class="right">
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: $bg-default;

  .left-panel {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(-100%);
    transition: all 0.5s;
    z-index: 9999;

    &.show {
      transform: translateX(0);
    }
  }

  .content {
    position: relative;
    flex: 1;
    display: flex;
    overflow: hidden;

    .right {
      width: $config-width;
      flex-shrink: 0;
    }
  }
}
</style>
