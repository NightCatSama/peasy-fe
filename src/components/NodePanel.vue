<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'
import Element from './widgets/Element.vue'

const pageStore = usePageStore()
const { pageData, modelData } = storeToRefs(pageStore)
const { addSection } = pageStore

const handleAddSection = (template: CNode) => {
  let noPageData = pageData.value.length === 0

  if (template.type === 'section') {
    addSection({ ...template, name: template.name + `${~~(Math.random() * 100)}` })
  }
  noPageData && nextTick(() => emitter.emit('location', true))
}
</script>

<template>
  <div class="node-panel">
    <section v-for="(list, key) in modelData">
      <div class="title">{{ key }}</div>
      <div class="element-list">
        <Element
          v-for="(template, key) in list"
          class="element-item"
          :name="template.name"
          @click="handleAddSection(template)"
        ></Element>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.node-panel {
  position: relative;
  width: 250px;
  height: 100%;
  overflow-y: auto;
  flex-shrink: 0;
  background: $panel;
  padding: 15px 24px;

  .title {
    margin-bottom: 15px;
    font-size: 24px;
    font-weight: bold;
  }

  .element-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .element-item {
    margin-bottom: 15px;
    width: 100%;
    height: 120px;
  }
}
</style>
