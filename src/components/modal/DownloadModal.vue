<script lang="ts">
export default {
  inheritAttrs: true,
}
</script>

<script setup lang="ts">
import Btn from '../widgets/Btn.vue'
import Modal from './Modal.vue'
import { $t } from '@/constants/i18n'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { Modal as ModalInstance } from '.'

interface IDownloadModalProps {
  showDownloadAll: boolean
  project: IProject
}

const userStore = useUserStore()
const { isLogin } = storeToRefs(userStore)

const { project, showDownloadAll } = defineProps<IDownloadModalProps>()

const emit = defineEmits(['download', 'download-all'])

let modal = $ref<InstanceType<typeof Modal> | null>(null)

const openGithubPageGuideModal = () => {
  ModalInstance.guide({
    title: $t('downloadGithubPage'),
    tips: [
      {
        msg: $t('downloadGithubPageStep1'),
        image: 'https://peasy.soapphoto.com/a14ea300-da79-40b0-82f2-65c7429c9209',
      },
      {
        msg: $t('downloadGithubPageStep2'),
        image: 'https://peasy.soapphoto.com/a2022e8e-f1dc-4e5f-a7f4-6ad178ed012f',
      },
      {
        msg: $t('downloadGithubPageStep3'),
        image: 'https://peasy.soapphoto.com/4fce2510-f8d0-4194-86e7-bf32d1505456',
      },
      {
        msg: $t('downloadGithubPageStep4'),
        image: 'https://peasy.soapphoto.com/0ea96476-2f33-41fe-b580-8e158e2247ce',
      }
    ],
  })
}

const openVercelGuideModal = () => {
  ModalInstance.guide({
    title: $t('downloadVercel'),
    tips: [
      {
        msg: $t('downloadVercelStep1'),
        image: 'https://peasy.soapphoto.com/a14ea300-da79-40b0-82f2-65c7429c9209',
      },
      {
        msg: $t('downloadVercelStep2'),
        image: 'https://peasy.soapphoto.com/a2022e8e-f1dc-4e5f-a7f4-6ad178ed012f',
      },
      {
        msg: $t('downloadVercelStep3'),
        image: 'https://peasy.soapphoto.com/4fce2510-f8d0-4194-86e7-bf32d1505456',
      },
      {
        msg: $t('downloadVercelStep4'),
        image: 'https://peasy.soapphoto.com/6584ab9e-8431-41de-b563-f62408e3fb76',
      },
      {
        msg: $t('downloadVercelStep5'),
        image: 'https://peasy.soapphoto.com/6b305ed8-b929-4fc5-86e2-663e95c17585',
      },
      {
        msg: $t('downloadVercelStep6'),
        image: 'https://peasy.soapphoto.com/c11f6c42-3af5-4d22-a09b-b2ad7e822c6d',
      }
    ],
  })
}
</script>

<template>
  <Modal
    ref="modal"
    class="download-modal"
    :title="$t('downloadGuide')"
    :width="'540px'"
    close-on-click-mask
    v-bind="$attrs"
  >
    <Btn type="btn" class="download-btn" @click="$emit('download')">{{ $t('downloadImmediately') }}</Btn>
    <Btn
      v-if="showDownloadAll"
      type="btn"
      class="download-btn"
      color="purple"
      @click="$emit('download-all')"
    >{{ $t('downloadAll') }}</Btn>
    <div class="download-tip">
      <div class="tip-desc">{{ $t('downloadNetworkTip') }}</div>
      <h2>1. {{ $t('downloadPeasy') }}</h2>
      <p v-html="
        project?.isPublic && project?.domain
            ? $t('downloadPeasyLink', project.domain)
            : !isLogin
              ? $t('downloadPeasyMsgNoLogin')
              : $t('downloadPeasyMsg')
      "></p>
      <h2>2. {{ $t('downloadGithubPage') }}</h2>
      <p v-html="$t('downloadGithubPageMsg')"></p>
      <Btn
        class="guide-btn"
        size="sm"
        type="inner"
        color="default"
        @click="openGithubPageGuideModal"
      >{{ $t('checkGuide') }}</Btn>
      <h2>3. {{ $t('downloadVercel') }}</h2>
      <p v-html="$t('downloadVercelMsg')"></p>
      <Btn
        class="guide-btn"
        size="sm"
        type="inner"
        color="default"
        @click="openVercelGuideModal"
      >{{ $t('checkGuide') }}</Btn>
    </div>
  </Modal>
</template>

<style lang="scss">
.download-modal {
  .download-btn {
    margin-bottom: 16px;
    margin-right: 12px;
  }
  .download-tip {
    .tip-desc {
      font-size: 12px;
      color: $grey;
      font-style: italic;
    }
    h2 {
      font-size: 14px;
      color: $purple;
      margin-top: 8px;
    }
    p {
      font-size: 12px;
      color: $color;
      word-wrap: break-word;
      white-space: pre-wrap;
    }
    a {
      font-size: 14px;
      color: $yellow;
      text-decoration: none;

      &:hover {
        color: lighten($yellow, 8%);
      }
    }
  }
  .guide-btn.btn {
    margin-top: 4px;
    font-size: 12px;
    color: $grey;
    &:hover {
      color: $white;
    }
  }
}
</style>
