<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { emitter } from '@/utils/event'
import { storeToRefs } from 'pinia'
import { nextTick } from 'vue'

const pageStore = usePageStore()
const { setActiveSection, removeSection } = pageStore
const { activeSection, isActiveAllSection, allPageData } = storeToRefs(pageStore)

const handleSectionItemClick = (item: CNode | null) => {
  setActiveSection(item)
  nextTick(() => emitter.emit('location'))
}

const allKey = Symbol('all')
</script>

<template>
  <TransitionGroup name="fade" class="section-list" tag="div">
    <div
      v-if="allPageData.length"
      :key="allKey"
      :class="['section-item', { active: isActiveAllSection }]"
      @click="handleSectionItemClick(null)"
    >
      A
    </div>
    <div
      :class="['section-item', { active: item.name === activeSection }]"
      v-for="(item, index) in allPageData"
      :key="item.name"
      @click="handleSectionItemClick(item)"
      v-tooltip.right="{ content: item.name, distance: 10 }"
    >
      {{ index + 1 }}
    </div>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.section-list {
  position: relative;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;
  flex: 1;

  .section-item {
    width: 32px;
    height: 32px;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    text-shadow: $text-shadow;
    opacity: 0.8;
    background: $bg-default-gradient;
    cursor: pointer;
    transition: all 0.3s, transform 0.3s 0.1s;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &.active {
      color: $bg-default;
      background: $theme-gradient;
      text-shadow: none;
      font-weight: bold;
      box-shadow: $float-shadow;
      transform: scale(1.05);
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
  transform: scale(0);
}

.fade-leave-active {
  position: absolute;
}
</style>
