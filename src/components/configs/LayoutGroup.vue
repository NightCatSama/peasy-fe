<script setup lang="ts">
import Group from '../widgets/Group.vue';
import Input from '../widgets/Input.vue';
interface ILayoutGroupProps {
  node: CNode
  layout: ILayout
}
const { layout, node } =
  defineProps<ILayoutGroupProps>()

const isSection = $computed(() => node.type === 'section')

</script>

<template>
  <Group title="Layout" class="layout-group" :default-collapsed="true">
  </Group>
</template>

<style lang="scss" scoped>
.size-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
