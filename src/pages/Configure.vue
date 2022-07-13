<script setup lang="ts">
import { provide, onMounted } from 'vue'
import LibComponent from '@/components/LibComponent.vue'
import ConfigSection from '@/components/ConfigSection.vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { downloadHtml } from '@/utils/download'

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
  <div class="container">
    <div class="header">
      <button @click="handleDownload">Download</button>
    </div>
    <!-- 页面主体内容 -->
    <div class="content">
      <!-- 左侧模板/组件选择区域 -->
      <div class="left">
        <section v-for="(list, key) in modelData">
          <h3>{{ key }}</h3>
          <div v-for="(template, key) in list" @click="() => addSection(template)">
            {{ template.name }}
          </div>
        </section>
      </div>
      <!-- 页面编辑区 -->
      <div class="edit-section">
        <LibComponent v-for="item in pageData" :item="item" :key="item.name"></LibComponent>
      </div>
      <!-- 右侧组件参数配置区 -->
      <div class="right">
        <ConfigSection></ConfigSection>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  .header {
    width: 100%;
    height: 60px;
    flex-shrink: 0;
    background-color: #fff;
    border-bottom: 1px solid #ddd;
  }

  .content {
    flex: 1;
    height: 100%;
    display: flex;

    .left {
      width: 250px;
      flex-shrink: 0;
      background-color: #ddd;
    }

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
