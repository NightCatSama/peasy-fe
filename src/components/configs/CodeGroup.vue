<script setup lang="ts">
import InputItem from '@/components/configs/items/InputItem.vue'
import { PageNode } from '@/config'
import { $t } from '@/constants/i18n'
import Group from '../widgets/Group.vue'
import Tip from '../widgets/Tip.vue'

interface ICodeGroupProps {
  node: PageNode
  code: ICode
}
const { code } = defineProps<ICodeGroupProps>()
</script>

<template>
  <Group
    group-name="code"
    class="code-group"
    :can-advanced="false"
    :default-collapsed="false"
    v-bind="$attrs"
    v-if="code"
  >
    <template #default="{ showAdvanced }">
      <div class="item">
        <Tip :type="'warning'" :message="$t('codeTip')"></Tip>
      </div>
      <InputItem
        :label="$t('script')"
        v-model="code.script"
        type="textarea"
        :placeholder="$t('scriptPlaceholder')"
        :tip="$t('scriptTip')"
      ></InputItem>
      <InputItem
        :label="$t('customStyle')"
        v-model="code.style"
        type="textarea"
        :placeholder="$t('stylePlaceholder')"
        :tip="$t('styleTip')"
      ></InputItem>
    </template>
  </Group>
</template>

<style lang="scss" scoped>
.code-group {
  .label {
    flex: 1;
    margin-right: 8px;
  }
}
</style>
