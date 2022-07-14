<script setup lang="ts">
import { useDisplayStore } from '@/stores/display';
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'

const pageStore = usePageStore()
const { removeSection } = pageStore
const { pageData } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { setActiveSection } = displayStore
const { isActiveAllSection, activeSection, } = storeToRefs(displayStore)

const handleSectionItemClick = (item: CNode) => {
  setActiveSection(item)
}

</script>

<template>
  <TransitionGroup name="fade" class="section-list" tag="div">
    <div :class="['section-item', { active: isActiveAllSection }]">A</div>
    <div
      :class="['section-item', { active: item.name === activeSection }]"
      v-for="(item, index) in pageData"
      :key="item.name"
      @click="handleSectionItemClick(item)"
    >{{ index + 1 }}</div>
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
    transition: all .3s, transform .5s;

    &:not(:last-child) {
      margin-bottom: 10px;
    }

    &.active {
      transform: rotateY(360deg);
      color: $bg-default;
      background-color: $color;
    }
  }
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0!important;
  transform: scale(0);
}

.fade-leave-active {
  position: absolute;
}
</style>
