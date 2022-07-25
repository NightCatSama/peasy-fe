<script setup lang="ts">
import InputItem from './InputItem.vue';
interface IPreviewItemProps {
  label: string
  modelValue: string
  options: string[]
}

const { label, modelValue, options } = defineProps<IPreviewItemProps>()
const emit = defineEmits(['update:model-value'])

const activeIndex = $computed(() => options.indexOf(modelValue))

const handleChange = (item: string) => {
  emit('update:model-value', item)
}

const showCodeInput = $ref(false)

</script>

<template>
  <div class="item preview-item">
    <div class="label" @dblclick="showCodeInput = true">{{ label }}</div>
    <div class="preview-wrapper">
      <div
        v-for="(item, index) in options"
        :key="index"
        :class="['preview-wrapper-item', { active: activeIndex === index }]"
        @click="() => handleChange(activeIndex === index ? '' : item)"
      >
        <slot :item="item" :index="index" :active="activeIndex === index"></slot>
      </div>
    </div>
    <InputItem
      v-if="showCodeInput"
      :label="label + ' Code'"
      :model-value="modelValue"
      @update:model-value="handleChange"
    ></InputItem>
  </div>
</template>

<style lang="scss" scoped>
.preview-item {
  align-items: flex-start;
  flex-direction: column;

  .label {
    margin: 5px 0 10px 0;
  }

  .preview-wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    &-item {
      position: relative;
      margin-right: 10px;
      margin-bottom: 10px;
      width: 78px;
      height: 78px;
      border-radius: $normal-radius;
      background: $color;
      padding: 20px;
      cursor: pointer;
      overflow: hidden;
    }
  }
}
</style>
