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
    >
      {{ index + 1 }}
    </div>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.section-list {
  position: absolute;
  left: 100%;
  top: 0;
  height: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  z-index: 9;

  .section-item {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    opacity: 0.8;
    border: 1px solid $color;
    cursor: pointer;
    transition: all 0.3s, transform 0.5s;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &.active {
      transform: rotateY(360deg);
      color: $bg-default;
      background-color: $theme;
      border-color: $theme;
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
