<script setup lang="ts">
import { useRouter } from 'vue-router'
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import Icon from '@/components/widgets/Icon.vue'
import { IMaterialItem } from '@/config'
import { $t } from '@/constants/i18n'

interface ITemplatesProps {
  section: IMaterialItem[]
  component: IMaterialItem[]
}

const { section, component } = defineProps<ITemplatesProps>()

const router = useRouter()

let curType = $ref<string>('section')

const list = $computed(() => getList(curType))
const getList = (type: string) => (type === 'section' ? section : component)

let titleMap: { [key: string]: string } = {
  component: $t('component'),
  section: $t('section'),
}
</script>

<template>
  <div class="materials">
    <div class="title">
      <span>{{ $t('materials') }}</span>
    </div>
    <div :class="['data-wrapper']">
      <div class="type-tabs">
        <div
          v-for="(type, i) in ['section', 'component']"
          :class="['type-tabs-item', { active: curType === type }]"
          :key="type"
          @click="curType = type"
        >
          {{ titleMap[type] }}
          <span class="count">{{ getList(type).length }}</span>
        </div>
      </div>
      <div :class="['project-page-list']">
        <div class="spin-wrapper" v-if="!list">
          <Icon name="spin" :size="32" loading></Icon>
        </div>
        <template v-else>
          <MaterialCard
            v-for="(item, index) in list"
            :key="item.name + index"
            :type="curType"
            :item="item"
            @on-setting-material="$emit('on-setting-material', item)"
            @on-delete-material="$emit('on-delete-material', item)"
          >
          </MaterialCard>
        </template>
      </div>
      <div class="empty-tip" v-if="list.length === 0">
        {{ $t('materialNoData') }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.materials {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 12px;
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
    flex-wrap: wrap;

    .material-card {
      margin: 0 16px 16px 0;
      flex-shrink: 0;
      width: 240px;
      height: 180px;
      font-size: 16px;
    }
  }
  .type-tabs {
    display: flex;
    margin-bottom: 24px;
    padding-bottom: 12px;
    border-bottom: 1px solid rgba($white, 20%);

    &-item {
      padding: 0px 12px 0px 0;
      margin-right: 30px;
      color: $color;
      cursor: pointer;
      user-select: none;

      &.active {
        color: $white;
        font-weight: bold;
        .count {
          color: $theme;
        }
      }

      .count {
        color: #9e9ea7;
      }
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
