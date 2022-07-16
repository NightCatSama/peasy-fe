<script setup lang="ts">
import Icon from './Icon.vue';
interface IGroupProps {
  title: string
  desc?: string
  defaultCollapsed?: boolean
}
const { title, defaultCollapsed = false } = defineProps<IGroupProps>()

let collapsed = $ref(defaultCollapsed)

</script>

<template>
  <div class="group">
    <div class="info">
      <span class="title">{{ title }}</span>
      <span class="info-op">
        <Icon :class="{ 'rotate': collapsed }" @click="collapsed = !collapsed" name="down" :size="12" type="pure" />
      </span>
    </div>
    <div class="content" v-collapse="collapsed">
      <slot></slot>
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
        transition: all .3s;

        &.rotate {
          transform: rotateZ(180deg);
        }
      }
    }
  }

  .content {
    background: darken($panel, 3%);
    padding: 10px 16px 10px;
    transition: all .3s;

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
