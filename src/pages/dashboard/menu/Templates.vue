<script setup lang="ts">
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import { templatePreviewUrl } from '@/utils/mande'
import Icon from '@/components/widgets/Icon.vue'
import { IMaterialItem } from '@/config'

interface ITemplatesProps {
  templates: IMaterialItem[]
}

const { templates } = defineProps<ITemplatesProps>()

const openPreviewTemplate = (item: IMaterialItem) => {
  let a: HTMLAnchorElement | null = document.createElement('a')
  a.href = templatePreviewUrl(item.id!)
  a.setAttribute('target', '_blank')
  a.click()
  a.remove()
  a = null
}
</script>

<template>
  <div class="templates">
    <div class="title">
      <span>{{ $t('templates') }}</span>
    </div>
    <div :class="['data-wrapper']">
      <div :class="['project-page-list']">
        <div class="spin-wrapper" v-if="!templates">
          <Icon name="spin" :size="32" loading></Icon>
        </div>
        <template v-else>
          <MaterialCard
            v-for="(item, index) in templates"
            :key="item.name + index"
            :type="'template'"
            :item="item"
            @on-material-click="openPreviewTemplate(item)"
            @on-edit-material="$emit('on-edit-material', item)"
            @on-setting-material="$emit('on-setting-material', item)"
            @on-delete-material="$emit('on-delete-material', item)"
          >
          </MaterialCard>
        </template>
      </div>
      <div class="empty-tip" v-if="templates.length === 0">
        {{ $t('templateNoData') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.templates {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 36px;
  }

  .project-wrapper {
    color: $color;
    display: flex;
    flex-direction: column;
    padding: 8px 16px;
    border-radius: $normal-radius;
    background-color: rgba($black, 0.2);

    transition: all 0.2s;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &:hover,
    &.active {
      background-color: rgba($black, 0.5);
      .project-item-operate-group {
        opacity: 1;
      }
    }
  }

  .project-page-list {
    display: flex;
    margin-top: 16px;
    border-radius: $inner-radius;

    .material-card {
      margin: 0 24px 0 0;
      flex-shrink: 0;
      width: 150px;
      height: 220px;
      font-size: 16px;
    }
  }

  .spin-wrapper {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .empty-tip {
    font-size: 14px;
    color: rgba($white, 50%);
  }
}
</style>
