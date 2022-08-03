<script setup lang="ts">
import Group from '../widgets/Group.vue'
import { PageNode } from '@/config'
import TabsItem from './items/TabsItem.vue'
import PositionTable from '../widgets/PositionTable.vue'
import Input from '../widgets/Input.vue'
import { closeDragMode, openDragMode } from '@/utils/moveable'
import SliderItem from './items/SliderItem.vue'
import { usePageStore } from '@/stores/page'
import { storeToRefs } from 'pinia'
import Tip from '../widgets/Tip.vue'
import Icon from '../widgets/Icon.vue'
import { useDisplayStore } from '@/stores/display'
import { useConfigProps } from '@/utils/config'

interface IPositionGroupProps {
  node: PageNode
  position: IPosition
}
const { position, node } = defineProps<IPositionGroupProps>()
const pageStore = usePageStore()
const { activeParentNode } = storeToRefs(pageStore)

const displayStore = useDisplayStore()
const { setLockDragSetPosition } = displayStore
const { lockDragSetPosition } = storeToRefs(displayStore)

const positionMap: { [key in IPosition['position']]?: string } = {
  static: 'Static',
  absolute: 'Absolute',
  fixed: 'Fixed',
}

const positionValue = $computed(() => {
  let values = []
  if (position.left !== 'auto') values.push('left')
  if (position.right !== 'auto') values.push('right')
  if (position.top !== 'auto') values.push('top')
  if (position.bottom !== 'auto') values.push('bottom')
  return values.length === 0 ? 'center' : values.join(' ')
})

const values = $computed(() => {
  return {
    left: position.left === 'auto' ? '' : position.left,
    right: position.right === 'auto' ? '' : position.right,
    top: position.top === 'auto' ? '' : position.top,
    bottom: position.bottom === 'auto' ? '' : position.bottom,
    center:
      position.left === 'auto' &&
      position.right === 'auto' &&
      position.top === 'auto' &&
      position.bottom === 'auto',
  }
})

const handlePositionChange = (value: IPosition['position']) => {
  position.position = value
  if (value !== 'static') {
    const props = useConfigProps(node)
    if (props.spacing?.margin) {
      props.spacing.margin = [0, 0, 0, 0]
    }
    openDragMode()
  } else {
    closeDragMode()
  }
}

const handleLockChange = () => {
  const isLock = !lockDragSetPosition.value
  setLockDragSetPosition(isLock)
  if (!isLock) {
    openDragMode()
  } else {
    closeDragMode()
  }
}
</script>

<template>
  <Group group-name="position" class="position-group" :default-collapsed="false">
    <TabsItem
      :label="'Direction'"
      :data="positionMap"
      :model-value="position.position"
      @update:model-value="handlePositionChange"
    >
    </TabsItem>
    <Tip
      v-if="position.position === 'fixed'"
      type="warning"
      message="使用 Fixed 时请确保你的元素置于最顶层容器中"
    ></Tip>
    <div class="item position-item" v-if="position.position !== 'static'">
      <PositionTable
        :size="80"
        :model-value="positionValue"
        :options="[
          'left top',
          'top',
          'right top',
          'left',
          'center',
          'right',
          'left bottom',
          'bottom',
          'right bottom',
        ]"
        @update:model-value="
          (key) => {
            position.left = key.includes('left') ? '0px' : 'auto'
            position.right = key.includes('right') ? '0px' : 'auto'
            position.top = key.includes('top') ? '0px' : 'auto'
            position.bottom = key.includes('bottom') ? '0px' : 'auto'
          }
        "
      ></PositionTable>
      <div class="input-wrap">
        <div v-if="values.center" class="position-center">Always Center</div>
        <div class="position-input" v-if="values.left">
          <span class="position-input-label">Left</span>
          <Input
            type="number"
            :suffix="['px', '%']"
            :model-value="values.left"
            @update:model-value="(val) => (position.left = val)"
          ></Input>
        </div>
        <div class="position-input" v-if="values.right">
          <span class="position-input-label">Right</span>
          <Input
            type="number"
            :suffix="['px', '%']"
            :model-value="values.right"
            @update:model-value="(val) => (position.right = val)"
          ></Input>
        </div>
        <div class="position-input" v-if="values.top">
          <span class="position-input-label">Top</span>
          <Input
            type="number"
            :suffix="['px', '%']"
            :model-value="values.top"
            @update:model-value="(val) => (position.top = val)"
          ></Input>
        </div>
        <div class="position-input" v-if="values.bottom">
          <span class="position-input-label">Bottom</span>
          <Input
            type="number"
            :suffix="['px', '%']"
            :model-value="values.bottom"
            @update:model-value="(val) => (position.bottom = val)"
          ></Input>
        </div>
      </div>
      <Icon
        :class="['lock-icon', { active: lockDragSetPosition }]"
        name="lock"
        :size="14"
        @click="handleLockChange"
      ></Icon>
    </div>
    <SliderItem label="Z Index" v-model="position.zIndex" :min="0" :max="999"></SliderItem>
  </Group>
</template>

<style lang="scss" scoped>
.position-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }

  .position-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0 10px 16px;

    .input-wrap {
      flex: 1;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 8px 0;

      .position-input {
        display: flex;
        align-items: center;

        &-label {
          width: 50px;
          margin-right: 10px;
          font-size: 14px;
          text-align: right;
        }

        &:not(:last-child) {
          margin-bottom: 16px;
        }

        :deep(.input-wrapper) {
          height: 28px;
          width: 74px;
          background-color: $bg-default;

          input {
            text-align: center;
            padding: 0 4px;
            font-size: 12px;
          }
        }
      }

      .position-center {
        color: lighten($panel-dark, 32%);
      }
    }

    .lock-icon {
      color: lighten($panel-dark, 12%);

      &.active {
        color: $yellow;
      }
    }
  }
}
</style>
