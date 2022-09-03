<script setup lang="ts">
import { DefaultColor, PageNode } from '@/config'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import Element from '../widgets/Element.vue';
import MaterialCard from '../widgets/MaterialCard.vue';

const pageStore = usePageStore()
const { activeNode, project } = storeToRefs(pageStore)
</script>

<template>
  <div class="page-list" v-click-outside="() => $emit('hide')">
    <!-- <Element class="page-item" :cover="project.cover" :name="project.name"></Element> -->
    <MaterialCard
      class="page-item"
      type="project"
      :item="(project as any)"
      hide-operate
      show-filename
    ></MaterialCard>
  </div>
</template>

<style lang="scss">
.page-list {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  overflow-x: auto;
  background-color: rgba($panel-header, 90%);
  z-index: $header-page-list-zIndex;
  border-top: 1px solid $border;
  transition: all .2s;
  height: 0;
  padding: 0 24px 0;
  overflow: hidden;

  &.show {
    padding: 16px 24px 12px;
    height: 160px;
  }

  .page-item.material-card {
    height: 132px;
    width: 90px;
    cursor: pointer;
    margin: 0 12px 0 0;
    border-radius: $normal-radius;

    .material-card-info {
      height: 24px;
      margin-top: 4px;

      .material-card-info-name {
        color: $yellow;
      }
    }

    .material-card-image {
      outline: 4px solid $theme;
      box-shadow: $shadow;
    }
  }
}
</style>
