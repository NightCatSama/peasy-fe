<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import Element from './widgets/Element.vue';

const pageStore = usePageStore()
const { modelData } = storeToRefs(pageStore)
const { addSection } = pageStore

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
          @click="() => addSection(template)"
        ></Element>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.node-panel {
  width: 250px;
  flex-shrink: 0;
  background-color: $panel;
  padding: 15px 24px;

  .title {
    margin-bottom: 15px;
    font-size: 24px;
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
