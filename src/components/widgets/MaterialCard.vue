<script setup lang="ts">
import { watch } from 'vue';
import Icon from './Icon.vue'
import { IMaterialItem, imgErrorFallback, PageNodeType } from '@/config'
import { Project } from '@@/entities/project.entity';
import { useRouter } from 'vue-router';
import { Modal } from '../modal';
import { $t } from '@/constants/i18n';

interface IMaterialCardProps {
  type: string | number
  item?: IMaterialItem | Project
  isNew?: boolean
  newText?: string
  selected?: boolean
  hideOperate?: boolean
  showFilename?: boolean
}

const { type, item, isNew, newText = $t('newProject'), showFilename, selected, hideOperate } = defineProps<IMaterialCardProps>()

const router = useRouter()

const getFilename = (filename?: string) => filename ? `${filename}` : 'index'
</script>

<template>
  <div :class="['material-card', { [type]: type, selected }]">
    <template v-if="item">
      <div
        class="material-card-image"
        :style="{ backgroundImage: item.cover ? `url(${item.cover})` : void 0 }"
        @click="
          type === 'project'
            ? $emit('on-project-click', item as Project)
            : $emit('on-material-click', item as IMaterialItem)
        "
      >
        <div v-if="!item.cover" class="material-card-image-placeholder">
          <Icon name="empty" :size="32" />
          <span>{{ $t('notCover') }}</span>
        </div>
        <slot></slot>
      </div>
      <div class="material-card-info">
        <div class="material-card-info-name">{{ showFilename ? getFilename((item as Project).filename) : item.name }}</div>
        <template v-if="type === 'project' && !hideOperate">
          <Icon
            type="circle"
            class="material-card-info-btn"
            name="save"
            :size="9"
            v-tooltip="{ content: $t('saveToTemplate'), placement: 'top', distance: 10 }"
            @click="$emit('on-save-template', item as Project)"
          ></Icon>
          <Icon
            type="circle"
            class="material-card-info-btn"
            name="advanced"
            :size="11"
            v-tooltip="{ content: $t('setting'), placement: 'top', distance: 10 }"
            @click="$emit('on-setting-project', (item as Project))"
          ></Icon>
          <Icon
            type="circle"
            class="material-card-info-btn danger"
            name="delete"
            :size="10"
            v-tooltip="{ content: $t('delete'), placement: 'top', distance: 10 }"
            @click="$emit('on-delete-project', item as Project)"
          ></Icon>
        </template>
        <template v-else-if="!hideOperate">
          <Icon
            v-if="type === 'template'"
            type="circle"
            class="material-card-info-btn"
            name="edit"
            :size="9"
            v-tooltip="{ content: $t('edit'), placement: 'top', distance: 10 }"
            @click="$emit('on-edit-material', item as IMaterialItem)"
          ></Icon>
          <Icon
            type="circle"
            class="material-card-info-btn"
            name="advanced"
            :size="11"
            v-tooltip="{ content: $t('setting'), placement: 'top', distance: 10 }"
            @click="$emit('on-setting-material', item as IMaterialItem)"
          ></Icon>
          <Icon
            type="circle"
            class="material-card-info-btn danger"
            name="delete"
            :size="10"
            v-tooltip="{ content: $t('delete'), placement: 'top', distance: 10 }"
            @click="$emit('on-delete-material', item as IMaterialItem)"
          ></Icon>
        </template>
      </div>
    </template>
    <template v-if="!item && isNew">
      <div class="material-card-image create" @click="$emit('on-project-click')">
        <div class="material-card-image-placeholder">
          <Icon name="add" :size="24" />
          <span v-if="newText">{{ newText }}</span>
        </div>
        <slot></slot>
      </div>
      <div class="material-card-info"></div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.material-card {
  position: relative;
  display: inline-flex;
  flex-direction: column;
  margin: 12px 24px 12px 0;
  color: $panel-light;
  font-size: 14px;

  &.project,
  &.template {
    width: 130px;
    height: 185px;
  }
  &.section,
  &.component {
    width: 150px;
    height: 130px;
  }

  &-image {
    position: relative;
    width: 100%;
    flex: 1;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: $normal-radius;
    color: $grey;
    background-color: $white;
    cursor: pointer;
    transition: all 0.3s;
    overflow: hidden;

    &.create {
      border: 2px dashed $grey;
      background-color: $tr;

      &:hover {
        color: $theme;
        border-color: $tr;
        background-color: $white;
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
      }
    }

    &:not(.create):hover {
      box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
    }

    &-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 13px;

      .icon:not(:last-child) {
        margin-bottom: 4px;
      }
    }
  }

  &-info {
    display: flex;
    align-items: center;
    padding: 6px 0px 6px 4px;
    height: 28px;
    &-name {
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-btn {
      position: relative;
      top: -1px;
      left: 2px;
      width: 16px;
      height: 16px;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 2px;
      color: $white;
      background: $panel-light;
      border-radius: $inner-radius;
      cursor: pointer;
      opacity: 0;
      display: none;
      transition: all 0.3s;
      &:hover {
        background: darken($panel-light, 8%);
      }
      &.danger {
        &:hover {
          background: $red;
        }
        // color: $red;
        // background: $red;
      }
    }
  }
  &:hover {
    color: $panel;
    .material-card-info-btn {
      opacity: 1;
      display: flex;
    }
  }
  &.selected {
    .material-card-image {
      border-color: transparent;
      outline: 3px solid $green;

      &.create {
        color: $theme;
        border-color: $tr;
        background-color: $white;
        box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style>
