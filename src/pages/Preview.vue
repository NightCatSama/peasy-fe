<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { fixApi, getTemplatePreview } from '@/utils/mande';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router'
import Logo from '@/components/Logo.vue';
import Btn from '@/components/widgets/Btn.vue';

const route = useRoute()
const router = useRouter()

const userStore = useUserStore()
const { isAdmin } = storeToRefs(userStore)

const hideHelper = $ref(route.query.hideHelper === 'true')

const previewURL = $computed(() => {
  const { id } = route.params as any
  return getTemplatePreview(id)
})

const gotoEdit = () => {
  const { id } = route.params as any
  router.push({
    name: 'create',
    query: {
      templateId: id
    }
  })
}
</script>

<template>
  <div class="preview-page" v-if="isAdmin">
    <div class="preview-helper" v-if="!hideHelper">
      <Logo :size="32"></Logo>
      <div class="logo-name">Peasy</div>
      <Btn :text="$t('useTemplate')" @click="gotoEdit"></Btn>
      <Btn class="close-btn" type="icon" :icon="'close'" color="default" @click="hideHelper = true"></Btn>
    </div>
    <iframe :src="previewURL" scrolling="no" border="0" frameborder="0" framespacing="0" allowfullscreen="true"></iframe>
  </div>
</template>

<style lang="scss" scoped>
  .preview-page {
    background: #FFF;
    width: 100%;
    height: 100vh;
    font-family: $font-family;

    .preview-helper {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 80px;
      color: $black;
      background: rgba($black, 10%);
      display: flex;
      align-items: center;
      font-size: 20px;
      z-index: 1;
      padding: 0 120px;
      box-shadow: -2px 0 4px 0 rgba(0, 0, 0, .05);

      .logo-name {
        font-weight: bold;
        margin-left: 12px;
        flex: 1;
      }

      .close-btn {
        margin-left: 24px;
      }
    }

    iframe {
      width: 100%;
      height: 100%;
    }
  }
  </style>
