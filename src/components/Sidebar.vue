<script setup lang="ts">
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import Avatar from './widgets/Avatar.vue'
import Icon from './widgets/Icon.vue'

interface ISidebarProps {
  activeNodePanel: boolean
}

const { activeNodePanel } = defineProps<ISidebarProps>()

const pageStore = usePageStore()
const { activeConfigData } = storeToRefs(pageStore)
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <Avatar :size="32" />
    </div>
    <div class="operator-panel">
      <div class="top">
        <div class="operator-item">
          <Icon
            :size="26"
            name="add"
            :active="activeNodePanel"
            @click.native="$emit('change-node-panel', !activeNodePanel)"
          />
        </div>
      </div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  width: 60px;
  flex-shrink: 0;
  background-color: $panel-sidebar;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo {
    height: $header-height;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .operator-panel {
    display: flex;
    flex-direction: column;
    padding: 20px;
  }

  .top {
    flex: 1;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .bottom {
    flex-shrink: 0;
  }

  .operator-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
}
</style>
