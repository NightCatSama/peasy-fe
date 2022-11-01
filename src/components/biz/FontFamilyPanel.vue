<script setup lang="ts">
import InputItem from '../configs/items/InputItem.vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import GroupItem from '../configs/items/GroupItem.vue'
import SliderItem from '../configs/items/SliderItem.vue'
import Btn from '../widgets/Btn.vue'
import BtnItem from '../configs/items/BtnItem.vue'
import { usePageStoreHelper } from '@/hooks/store'

const { font } = usePageStoreHelper()

let showMediaSetting = $ref(false)

const handleAddFontFace = () => {
  font.value.customFontFace.push('')
  // font.value.customFontFace.push({
  //   fontFamily: '',
  //   url: '',
  //   fontStyle: 'normal',
  //   fontWeight: 'normal',
  // })
}

const deleteFontFace = (index: number) => {
  font.value.customFontFace.splice(index, 1)
}
</script>

<template>
  <div :class="['font-family-panel']">
    <SliderItem
      wrapper-class="font-size-item"
      :label="$t('rootFontSize')"
      v-model="font.fontSize"
      :min="10"
      :max="100"
    >
      <!-- <Icon
        name="question"
        class="question-icon"
        :size="13"
        v-tooltip="{
          content: $t('mediaFontSizeTip')
        }"
      ></Icon> -->
    </SliderItem>
    <BtnItem
      class="media-item"
      :label="$t('mediaFontSize')"
      :tip="$t('mediaFontSizeTip')"
      :model-value="showMediaSetting ? $t('hidden') : $t('edit')"
      :btn-color="'primary'"
      :on-click="() => (showMediaSetting = !showMediaSetting)"
    >
      <template #default v-if="Object.keys(font.mediaFontSize).length === 0">
        <span class="media-item-text">{{ $t('mediaFontSizeEmpty') }}</span>
      </template>
    </BtnItem>
    <div class="media-setting" v-show="showMediaSetting">
      <GroupItem
        v-for="(val, width) in font.mediaFontSize"
        :key="width"
        @delete="() => delete font.mediaFontSize[width]"
      >
        <SliderItem
          :label="'' + width"
          :model-value="+val"
          :max="100"
          @update:model-value="(val) => (font.mediaFontSize[width] = Number(val))"
        ></SliderItem>
      </GroupItem>
    </div>
    <InputItem
      wrapper-class="font-family-item"
      :label="$t('fontFamily')"
      type="textarea"
      v-model="font.fontFamily"
    ></InputItem>
    <GroupItem
      v-for="(item, index) in font.customFontFace"
      :key="index"
      :class="['font-face-group']"
      @delete="deleteFontFace(index)"
    >
      <template v-if="typeof item === 'object'">
        <InputItem :label="$t('fontFaceName')" v-model="item.fontFamily"></InputItem>
        <InputItem :label="$t('fontFaceSrc')" v-model="item.url"></InputItem>
        <InputItem :label="$t('fontFaceStyle')" v-model="item.fontStyle"></InputItem>
        <InputItem :label="$t('fontFaceWeight')" v-model="item.fontWeight"></InputItem>
      </template>
      <InputItem
        v-else
        :label="$t('fontFaceLink')"
        type="textarea"
        :rows="3"
        :placeholder="'https://'"
        :auto-focus="true"
        :model-value="item"
        @update:model-value="(val: string) => font.customFontFace[index] = val"
      ></InputItem>
    </GroupItem>
    <Btn is-block type="inner" class="full-btn add-color-btn" @click="handleAddFontFace">{{
      $t('addFontFace')
    }}</Btn>
  </div>
</template>

<style lang="scss">
.font-family-panel {
  width: $font-family-panel-width;
  max-height: 80vh;
  overflow-y: auto;
  border-radius: $normal-radius;
  z-index: $global-setting-panel-zIndex;
  box-shadow: $shadow;
  background: $panel-sidebar-gradient;
  padding: 12px 12px;
  display: flex;
  flex-direction: column;

  .item .label {
    font-size: 14px;
    min-width: auto;
  }

  .item.column > .label {
    font-size: 14px;
    display: flex;
    margin-bottom: 6px;
  }

  .font-face-group {
    .item.column {
      flex-direction: column;
      align-items: flex-start;
      .label {
        flex: 0;
        margin: 2px 0 4px 0;
        font-size: 14px;
        padding-left: 4px;
      }
      .input {
        flex: 1;
        word-break: break-all;
        padding: 4px;
        font-size: 13px;
      }
    }
  }

  .font-family-item,
  .media-item,
  .font-size-item {
    margin-bottom: 12px;
  }

  .font-size-item {
    display: flex;
    align-items: center;
  }

  .group-item-delete {
    width: 44px;
  }

  .add-color-btn {
    min-height: 32px;
    flex-shrink: 0;
  }

  .media-item {
    display: flex;

    &-text {
      font-size: 12px;
      color: $grey;
      cursor: default;
    }
  }

  .media-setting {
    margin-bottom: 12px;

    .item .label {
      flex: none;
      width: 40px;
      text-align: center;
    }

    .group-item-delete {
      width: 32px;
      display: flex;
      align-items: center;

      .delete-btn {
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
    }
  }
}
</style>
