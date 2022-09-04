<script setup lang="ts">
import { IMaterialItem } from '@/config';
import { templatePreviewUrl, materialApi } from '@/utils/mande';
import { IResponse } from '@@/types/response';
import { onBeforeMount } from 'vue'
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';
import Icon from '@/components/widgets/Icon.vue';
import { Modal } from '@/components/modal';
import { $t } from '@/constants/i18n';
import { AlertSuccess } from '@/utils/alert';
import SaveMaterialModal from '../components/modal/SaveMaterialModal.vue';
import { getSetLoading } from '@/utils/context';

const router = useRouter()
const userStore = useUserStore()
const { uid, isLogin, isAdmin } = storeToRefs(userStore)

let template = $ref<IMaterialItem[]>([])
let selectedId = $ref('')
let selfTemplate = $ref<IMaterialItem[]>([])
let showSaveMaterialModal = $ref(false)
let curMaterial = $ref<IMaterialItem | null>(null)

onBeforeMount(async () => {
  const setGlobalLoading = getSetLoading()
  const hide = setGlobalLoading?.($t('loading'))
  const res = await materialApi.get<IResponse<{ [type: string]: IMaterialItem[] }>>('', {
    query: { template: true, section: false, component: false },
  })
  hide?.()
  const list: IMaterialItem[] = []
  ;(res.data.template || []).forEach((item) => {
    if (item.uid === uid.value) {
      selfTemplate.push(item)
    } else {
      list.push(item)
    }
  })
  template = list
})

const handleGotoProject = (id?: string) => {
  if (!id) {
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

/** 打开物料编辑弹窗 */
const handleMaterialSetting = async (material: IMaterialItem) => {
  curMaterial = material
  showSaveMaterialModal = true
}

const updateMaterial = (material: IMaterialItem) => {
  if (!curMaterial) return
  if (curMaterial.id) {
    selfTemplate = selfTemplate.map((m) => {
      if (m.id === curMaterial!.id) {
        return material
      }
      return m
    })
  }
}

/** 删除物料 */
const handleDeleteMaterial = async (material: IMaterialItem) => {
  if (await Modal.confirm($t('deleteConfirm', material.name))) {
    await materialApi.delete(material.id!)
    selfTemplate = (selfTemplate as IMaterialItem[]).filter(
      (p) => p.id !== material.id
    )
    AlertSuccess($t('deleteSuccess'))
  }
}
</script>

<template>
  <div class="template-page">
    <div :class="['title', { highlight: selectedId }]">
      <span>{{ $t('templateTip') }}</span>
      <!-- <Icon v-if="selectedId" name="start" :size="36" type="btn" @click="handleGotoProject"></Icon> -->
    </div>
    <div class="template-group">
      <MaterialCard
        class="new-project"
        type="project"
        is-new
        :selected="selectedId === 'empty'"
        :new-text="$t('emptyProject')"
        @on-project-click="() => handleGotoProject()"
      >
      </MaterialCard>
    </div>
    <div
      class="template-group"
      v-for="key in ['official', 'user']"
      :key="key"
      v-show="!(key === 'user' && !isLogin)"
    >
      <div class="template-title">{{ key === 'official' ? $t('officialTemplate') : $t('userTemplate') }}</div>
      <div class="template-list">
        <MaterialCard
          class="template-item"
          v-for="item in (key === 'official' ? template : selfTemplate)"
          :key="item.id"
          type="template"
          :item="item"
          :selected="selectedId === item.id"
          :hide-operate="key === 'official'"
          @on-material-click="selectedId = item.id!"
          @on-setting-material="handleMaterialSetting"
          @on-delete-material="handleDeleteMaterial"
        >
          <div class="preview-btn-group" v-if="selectedId === item.id">
            <a
              v-if="key === 'official' || isAdmin"
              class="preview-btn"
              target="_blank"
              :href="templatePreviewUrl(item.id, true)"
            >{{ $t('preview') }}</a>
            <div
              class="preview-btn"
              target="_blank"
              @click="handleGotoProject(item.id)"
            >{{ $t('useIt') }}</div>
          </div>
        </MaterialCard>
      </div>
    </div>
    <SaveMaterialModal
      v-if="curMaterial"
      :action-text="curMaterial.id ? $t('edit') : $t('saveOf')"
      :material="curMaterial"
      hide-create-cover
      v-model="showSaveMaterialModal"
      :on-save="updateMaterial"
    ></SaveMaterialModal>
  </div>
</template>

<style lang="scss" scoped>
.template-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  background-color: #EEE;
  overflow: hidden;

  .title {
    font-size: 32px;
    margin: 80px 0 64px 0;
    color: $color-dark;
    display: flex;
    align-items: center;

    :deep(.icon) {
      margin-left: 4px;
    }
    &.highlight :deep(.icon) {
      color: $blue;
    }
  }
  .template-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 24px;
    max-width: 980px;
    width: 100%;

    .new-project {
      margin: 0 24px;
      width: 360px;
    }

    .template-title {
      font-size: 24px;
      color: $panel-light;
      padding: 12px 24px;
      border-bottom: 1px solid rgba(0,0,0,.15);
      margin-bottom: 12px;
    }
  }

  .template-list {
    display: flex;
    width: 100%;
    padding: 0 24px;
    flex: 1;
    overflow-x: auto;
  }

  :deep(.preview-btn-group) {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    .preview-btn {
      height: 28px;
      line-height: 28px;
      text-align: center;
      color: $white;
      font-size: 14px;
      cursor: pointer;
      text-decoration: none;
      font-family: $font-family;
      transition: all .3s;
      margin: 0 4px 4px;
      background: rgba($theme, 80%);
      border-radius: $inner-radius;

      &:hover {
        background: rgba($theme, 70%);
      }

      &:last-child {
        background: rgba($green, 80%);

        &:hover {
          background: rgba($green, 70%);
        }
      }
    }
  }
}
</style>
