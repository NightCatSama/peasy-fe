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
import EditSection from '@/components/EditSection.vue'
import SectionList from '@/components/SectionList.vue'

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

const showLeftPanel = $ref(true)
</script>

<template>
  <div class="page">
    <Sidebar
      :active-node-panel="showLeftPanel"
      @change-node-panel="(val) => (showLeftPanel = val)"
    ></Sidebar>
    <div class="container">
      <ConfigHeader @download="handleDownload"></ConfigHeader>
      <!-- 页面主体内容 -->
      <div class="content">
        <!-- 左侧模板/组件选择区域 -->
        <div :class="['left-panel', { show: showLeftPanel }]">
          <NodePanel></NodePanel>
          <SectionList></SectionList>
        </div>
        <!-- 页面编辑区 -->
        <EditSection>
          <LibComponent v-for="item in pageData" :item="item" :key="item.name"></LibComponent>
        </EditSection>
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background-color: $bg-default;

  .left-panel {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    transform: translateX(-100%);
    transition: all 0.5s;
    z-index: 999;

    &.show {
      transform: translateX(0);
    }
  }

  .content {
    position: relative;
    flex: 1;
    height: 100%;
    display: flex;

    .right {
      width: 300px;
      flex-shrink: 0;
      background-color: #ddd;
    }
  }
}
</style>
