<script setup lang="ts">
import { IMaterialItem } from '@/config';
import { materialApi } from '@/utils/mande';
import { IResponse } from '@@/types/response';
import { onBeforeMount } from 'vue'
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import Icon from '@/components/widgets/Icon.vue';

const router = useRouter()
const userStore = useUserStore()
// const { uid } = storeToRefs(userStore)

let template = $ref<IMaterialItem[]>([])
let selectedId = $ref('')
// let selfTemplate = $ref<IMaterialItem[]>([])

onBeforeMount(async () => {
  const res = await materialApi.get<IResponse<{ [type: string]: IMaterialItem[] }>>('', {
    query: { template: true, section: false, component: false },
  })
  // const list: IMaterialItem[] = []
  // ;(res.data.template || []).forEach((item) => {
  //   if (item.uid === uid.value) {
  //     selfTemplate.push(item)
  //   } else {
  //     list.push(item)
  //   }
  // })
  template = res.data.template || []
})

const handleGotoProject = () => {
  if (selectedId === 'empty') {
    router.push({
      name: 'create',
    })
  } else {
    router.push({
      name: 'create',
      query: {
        templateId: selectedId
      }
    })
  }
}
</script>

<template>
  <div class="template-page">
    <div :class="['title', { highlight: selectedId }]">
      <span>{{ selectedId ? $t('templateStart') : $t('templateTip') }}</span>
      <Icon v-if="selectedId" name="start" :size="30" type="btn" @click="handleGotoProject"></Icon>
    </div>
    <div class="template-list">
      <MaterialCard
        type="project"
        is-new
        :selected="selectedId === 'empty'"
        :new-text="$t('emptyProject')"
        @on-project-click="selectedId = 'empty'"
      >
      </MaterialCard>
      <MaterialCard
        class="template-item"
        v-for="item in template"
        :key="item.id"
        type="template"
        :item="template[0]"
        :selected="selectedId === item.id"
        hide-operate
        @on-material-click="selectedId = item.id!"
      >
      </MaterialCard>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.template-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  background-color: #EEE;
  overflow: hidden;

  .title {
    font-size: 32px;
    margin: 20px 0;
    color: $color-dark;
    display: flex;
    align-items: center;

    :deep(.icon) {
      margin-left: 4px;
    }
    &.highlight :deep(.icon) {
      color: $green;
    }
  }

  .template-list {
    display: flex;
    flex-wrap: wrap;
    width: 980px;
    padding: 0 120px 0 144px;
    flex: 1;
    overflow: auto;
  }
}
</style>
