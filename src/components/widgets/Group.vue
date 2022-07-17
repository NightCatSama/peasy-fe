<script setup lang="ts">
import { useDisplayStore } from '@/stores/display'
import { onMounted, onUpdated, watchEffect } from 'vue'
import Icon from './Icon.vue'
interface IGroupProps {
  title: string
  defaultCollapsed?: boolean
  canAdvanced?: boolean
}
const { title, defaultCollapsed = true, canAdvanced } = defineProps<IGroupProps>()

const displayStore = useDisplayStore()
const { saveGroupStatus, getGroupStatus } = displayStore

const status = getGroupStatus(title)

let collapsed = $ref(status ? status.collapsed : defaultCollapsed)
let showAdvanced = $ref(status ? status.advanced : false)

onUpdated(() => {
  saveGroupStatus(title, { collapsed, advanced: showAdvanced })
})
</script>

<template>
  <div class="group">
    <div class="info">
      <span class="title">{{ title }}</span>
      <span class="info-op">
        <Icon
          v-if="canAdvanced"
          @click="showAdvanced = !showAdvanced"
          name="advanced"
          :size="16"
          type="pure"
        />
        <Icon
          :class="{ rotate: collapsed }"
          @click="collapsed = !collapsed"
          name="down"
          :size="12"
          type="pure"
        />
      </span>
    </div>
    <div class="content" v-collapse="collapsed">
      <slot :showAdvanced="showAdvanced"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.group {
  display: flex;
  flex-direction: column;
  font-size: 14px;

  .info {
    padding: 0 16px;
    height: 44px;
    display: flex;
    align-items: center;

    .title {
      font-size: 18px;
      font-weight: bold;
    }

    .info-op {
      flex: 1;
      display: flex;
      justify-content: flex-end;

      :deep(.icon) {
        cursor: pointer;
        user-select: none;
        transition: all 0.3s;
        margin: 0 3px;

        &.rotate {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .content {
    background: darken($panel, 3%);
    padding: 10px 16px 10px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;

    :deep(.item) {
      display: flex;
      align-items: center;
      min-height: 32px;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
