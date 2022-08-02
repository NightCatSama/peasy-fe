<script setup lang="ts">
import { Alert } from '@/utils/alert'
import { getUnValidChar } from '@/utils/validation'
import { VueTagsInput } from '@sipec/vue3-tags-input'

interface ITagListProps {
  tags: string[]
  autoCompleteTags?: string[]
}

const { tags = [], autoCompleteTags = [] } = defineProps<ITagListProps>()
const emit = defineEmits(['change'])

let tag = $ref('')

const handleTagsChange = (newTags: any[]) => {
  emit(
    'change',
    newTags.map((item) => item.text)
  )
}

const handleAddTag = async (obj: any) => {
  const invalidChar = getUnValidChar(obj.tag.text)
  if (invalidChar?.length) {
    tag = tag.replace(new RegExp(`[${invalidChar.join('|')}]`, 'g'), '')
    return
  }
  obj.addTag()
}

const filteredItems = $computed(() => {
  return autoCompleteTags
    .filter((i) => i.toLowerCase().indexOf(tag.toLowerCase()) !== -1)
    .map((i) => ({ text: i }))
})
</script>

<template>
  <div class="tag-content">
    <vue-tags-input
      class="tag-input"
      v-model="tag"
      :tags="tags.map((i) => ({ text: i }))"
      :autocomplete-items="filteredItems"
      @before-adding-tag="handleAddTag"
      @tags-changed="handleTagsChange"
    />
  </div>
</template>

<style lang="scss">
.tag-content {
  min-height: 32px;
  align-items: center;
  padding: 4px;
  display: flex;
  background: $panel-content;
  margin: 0 8px 8px;
  border-radius: $normal-radius;
  .tag-input.vue-tags-input {
    background: $tr;
    width: 100%;
    max-width: none;
    .ti-input {
      border: none;
      border-bottom: 1px solid $tr;
      padding: 0;
    }
    .ti-tag input {
      color: $color;
    }
    .ti-tag span {
      position: relative;
      top: 0.5px;
    }
    .ti-tag,
    .ti-item.ti-selected-item {
      background-color: $purple;
      color: $color;
    }
    .ti-tags li {
      padding: 2px 4px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: $inner-radius;
      font-size: 12px;
    }
    .ti-tag.dark-font {
      color: #333;
    }
    .ti-item {
      padding: 2px 3px;
    }
    .ti-tag.ti-deletion-mark {
      background-color: $red !important;
      color: $white;
    }
    .ti-new-tag-input-wrapper {
      input {
        color: $color;
        background: $tr;
        font-size: 12px;
        line-height: 12px;
        min-width: 64px;
        padding-top: 2px;
      }
    }
    .ti-autocomplete {
      border-radius: $normal-radius;
      background-color: $panel-dark;
      border: 1px solid $theme;
      overflow: hidden;
      .ti-item {
        margin: 3px;
        border-radius: $inner-radius;
      }
    }
    .ti-icon-close:hover {
      color: lighten($red, 30%);
    }
  }
}
</style>
