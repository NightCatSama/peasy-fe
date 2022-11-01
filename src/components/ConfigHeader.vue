<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLogto } from '@logto/vue'

import Btn from './widgets/Btn.vue'
import Avatar from './widgets/Avatar.vue'
import { useDisplayStore } from '@/stores/display'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'
import Select from './widgets/Select.vue'
import { useKeyPress } from 'ahooks-vue'
import { emitter } from '@/utils/event'
import { ShortcutKey } from '@/constants/shortcut'
import ColorVarList from './biz/ColorVarList.vue'
import { useHistoryStore } from '@/stores/history'
import { usePageStore } from '@/stores/page'
import { useUserStore } from '@/stores/user'
import { useRouter, useRoute } from 'vue-router'
import { Modal } from './modal'
import { $t, lang } from '@/constants/i18n'
import PageList from './biz/PageList.vue'
import { getDomainURL } from '@/utils/mande'
import EditorSettingModal from './modal/EditorSettingModal.vue'
import Simulator from './biz/Simulator.vue'
import { useDisplayStoreHelper, usePageStoreHelper, useUserStoreHelper } from '@/hooks/store'

interface IConfigHeaderProps {
  isTemplate: boolean
}

const { isTemplate } = defineProps<IConfigHeaderProps>()

const { userName, avatar } = useUserStoreHelper()

const { project, mainProject, colorVars, allPageData, template, updateAllPageNode } =
  usePageStoreHelper()

const { displayMode, curPresetDeviceList: deviceList, setDisplayMode } = useDisplayStoreHelper()

const historyStore = useHistoryStore()
const { canUndoHistory, canRedoHistory, isSave } = storeToRefs(historyStore)
const { undoHistory, redoHistory } = historyStore

const { signIn, signOut, isAuthenticated } = useLogto()
const handleSignIn = () => {
  sessionStorage.setItem('redirect', location.href)
  signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
}
const handleSignOut = async () => {
  if (await Modal.confirm($t('signOutTip'), { title: $t('signOutTipTitle') })) {
    signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)
  }
}

let showEditorSetting = $ref(false)

const router = useRouter()
const route = useRoute()
const gotoMePage = async () => {
  if (
    isSave.value ||
    (await Modal.confirm(
      $t('routerDataTip'),
      route.name === 'create'
        ? {}
        : {
            extraLink: $t('save'),
            onExtraLinkClick: () => emitter.emit('saveProject'),
          }
    ))
  ) {
    router.push({ name: 'dashboard' })
  }
}
const switchLang = async (lang: 'zh' | 'en') => {
  if (await Modal.confirm($t('switchLangTip'))) {
    router.replace({
      name: route.name!,
      params: { ...route.params },
      query: {
        lang,
      },
    })
    setTimeout(() => location.reload(), 0)
  }
}

const emit = defineEmits(['save', 'download', 'preview', 'project-setting', 'template-setting'])

const name = $computed(() => project.value.filename || 'index')
let showColorVarDropdown = $ref(false)
let showPageList = $ref(false)

const domain = $computed(() =>
  mainProject.value?.isPublic && mainProject.value?.domain
    ? getDomainURL(mainProject.value.domain, project.value.filename)
    : ''
)

const modeMap = {
  edit: {
    title: $t('editMode'),
    icon: 'edit',
  },
  drag: {
    title: $t('dragMode'),
    icon: 'drag',
  },
  preview: {
    title: $t('previewMode'),
    icon: 'preview',
  },
}

const handleModeClick = (value: any) => {
  setDisplayMode(value)
}

useKeyPress(ShortcutKey.SwitchDisplayMode, (e) => {
  e.preventDefault()
  const displayModeList = ['edit', 'drag', 'preview'] as const
  setDisplayMode(displayModeList[(displayModeList.indexOf(displayMode.value) + 1) % 3])
})
useKeyPress(ShortcutKey.SwitchMaterialPanel, (e) => {
  e.preventDefault()
  emitter.emit('switchMaterialsPanel')
})
useKeyPress(ShortcutKey.saveProject, (e) => {
  if (e.shiftKey) return
  e.preventDefault()
  emit('save')
})
useKeyPress(ShortcutKey.switchPageList, (e) => {
  e.preventDefault()
  showPageList = !showPageList
})

emitter.on('saveColorVars', (color: string) => {
  showColorVarDropdown = true
  colorVars.value.push({
    name: '',
    color,
  })
})

emitter.on('switchPageList', (open: boolean = false) => (showPageList = open))
</script>

<template>
  <div class="header">
    <div class="left">
      <div v-if="!isTemplate" class="page-info" @click="showPageList = !showPageList">
        <div class="page-name">
          <div class="name">{{ name }}</div>
          <div class="ext">.html</div>
          <Icon name="down" type="pure" color="grey" :size="9"></Icon>
        </div>
        <a v-if="domain" class="page-domain" target="_blank" :href="domain" @click.stop>{{
          domain
        }}</a>
      </div>
      <div v-else class="page-info">
        <span class="page-label"
          >{{ $t('editTemplate') }}: <span class="name">{{ template?.name }}</span></span
        >
      </div>
      <Btn
        class="project-setting-btn"
        type="text"
        color="default"
        v-tooltip="$t('projectSetting')"
        @click="isTemplate ? $emit('template-setting') : $emit('project-setting')"
      >
        <Icon name="project-setting" :size="16"></Icon>
      </Btn>
    </div>
    <div class="center">
      <Dropdown
        :shown="showColorVarDropdown"
        placement="bottom"
        type="pure-dropdown"
        :distance="10"
        @apply-hide="showColorVarDropdown = false"
      >
        <template #default="{ shown }">
          <div :class="['color-plate', { active: shown }]">
            <Icon name="color" :size="18" />
          </div>
        </template>
        <template #content>
          <ColorVarList></ColorVarList>
        </template>
      </Dropdown>
      <Simulator></Simulator>
      <Select
        :class="['mode-wrapper', displayMode]"
        :options="modeMap"
        :display="'inline'"
        placement="bottom-start"
        :model-value="displayMode"
        @update:model-value="handleModeClick"
      >
        <template #value>
          <Icon
            class="icon"
            :name="modeMap[displayMode].icon"
            :size="displayMode === 'preview' ? 13 : 11"
          ></Icon>
          <span>{{ modeMap[displayMode].title }}</span>
        </template>
      </Select>
    </div>
    <div class="right">
      <Icon
        :class="['undo-icon', { disabled: !canUndoHistory }]"
        name="redo"
        :size="16"
        type="btn"
        v-tooltip="$t('undo')"
        @click="() => canUndoHistory && updateAllPageNode(undoHistory())"
      ></Icon>
      <Icon
        :class="['redo-icon', { disabled: !canRedoHistory }]"
        name="redo"
        :size="16"
        type="btn"
        v-tooltip="$t('redo')"
        @click="() => canRedoHistory && updateAllPageNode(redoHistory())"
      ></Icon>
      <Btn
        class="save-btn"
        @click="$emit('save')"
        :disabled="allPageData.length === 0"
        icon="save"
        type="btn"
        color="purple"
        size="xs"
        :text="$t('save')"
      ></Btn>
      <Btn
        v-if="!isTemplate"
        class="download-btn"
        @click="$emit('download')"
        :disabled="allPageData.length === 0"
        :text="$t('download')"
      ></Btn>
      <Btn
        v-if="isTemplate"
        class="download-btn"
        @click="$emit('preview')"
        color="orange"
        :disabled="allPageData.length === 0"
        :text="$t('preview')"
      ></Btn>
      <Dropdown type="pure-dropdown" popper-class="user-dropdown">
        <Avatar :image="avatar" :size="36" can-operator />
        <template #content="{ hide }">
          <div class="user-content">
            <template v-if="isAuthenticated">
              <div class="user-name">{{ userName }}</div>
              <div
                class="item"
                @click="
                  () => {
                    gotoMePage()
                    hide()
                  }
                "
              >
                {{ $t('profile') }}
              </div>
              <div
                class="item"
                @click="
                  () => {
                    showEditorSetting = true
                    hide()
                  }
                "
              >
                {{ $t('editorSetting') }}
              </div>
              <div
                class="item"
                @click="
                  () => {
                    switchLang(lang === 'en' ? 'zh' : 'en')
                    hide()
                  }
                "
              >
                {{ lang === 'zh' ? $t('switchToEN') : $t('switchToZH') }}
              </div>
              <div
                class="item danger"
                @click="
                  () => {
                    handleSignOut()
                    hide()
                  }
                "
              >
                {{ $t('signOut') }}
              </div>
            </template>
            <template v-else>
              <div
                class="item"
                @click="
                  () => {
                    switchLang(lang === 'en' ? 'zh' : 'en')
                    hide()
                  }
                "
              >
                {{ lang === 'zh' ? $t('switchToEN') : $t('switchToZH') }}
              </div>
              <div class="item primary" @click="handleSignIn">{{ $t('signIn') }}</div>
            </template>
          </div>
        </template>
      </Dropdown>
    </div>
    <PageList :class="{ show: showPageList }" @hide="showPageList = false"></PageList>
    <EditorSettingModal
      v-model="showEditorSetting"
      @close="showEditorSetting = false"
    ></EditorSettingModal>
  </div>
</template>

<style lang="scss" scoped>
.header {
  width: 100%;
  height: $header-height;
  flex-shrink: 0;
  background: $panel-header;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;

  .left {
    flex: 1;
    display: flex;
    .page-info {
      padding: 6px 16px 6px 12px;
      background-color: rgba($panel-dark, 35%);
      border-radius: $normal-radius;
      display: flex;
      flex-direction: column;
      justify-content: center;
      cursor: pointer;

      .page-name {
        display: flex;
        align-items: baseline;

        .icon {
          margin-left: 8px;
        }
      }

      .page-label {
        display: flex;
        align-items: baseline;
        font-size: 14px;

        .name {
          margin-left: 10px;
        }
      }

      .page-domain {
        font-size: 12px;
        line-height: 12px;
        white-space: nowrap;
        color: darken($color, 35%);
        padding-bottom: 2px;
        text-decoration: none;

        &:hover {
          color: darken($color, 15%);
        }
      }
    }

    .name {
      color: $yellow;
      font-size: 18px;
      font-weight: bold;
    }
    .ext {
      font-size: 13px;
      margin-left: 3px;
      color: darken($color, 10%);
      flex: 1;
    }

    .project-setting-btn {
      padding: 0;
      align-self: center;
      margin-left: 10px;
      color: $color;
    }
  }

  .right {
    display: flex;
    align-items: center;
    flex-shrink: 0;

    .redo-icon,
    .undo-icon {
      margin-right: 12px;

      &:not(.disabled):hover {
        color: $theme;
      }

      &.disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }
    }

    .undo-icon {
      margin-right: 10px;
      transform: rotateY(180deg);
    }
  }

  .center {
    display: flex;
    align-items: center;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .mode-wrapper {
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translate(12px, -50%);
      font-size: 12px;
      padding: 6px 10px 6px 8px;
      border-radius: $normal-radius;
      white-space: nowrap;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      user-select: none;
      transition: all 0.3s;
      background: $panel;

      &:hover {
        background: lighten($panel, 3%);
      }

      &.drag {
        background: $brown;
        &:hover {
          background: lighten($brown, 3%);
        }
      }
      &.preview {
        background: $purple;
        &:hover {
          background: lighten($purple, 3%);
        }
      }

      :deep(.icon) {
        padding: 0;
        margin-right: 3px;
      }
    }
    .color-plate {
      color: $color;
      margin: 0 8px;
      cursor: pointer;
      &:hover,
      &.active {
        color: $roseate;
      }
    }
  }

  .download-btn {
    margin-right: 12px;
    min-width: 100px;
  }

  .save-btn {
    margin-right: 16px;
  }
}
</style>

<style lang="scss">
.user-dropdown {
  .user-content {
    width: 160px;
    font-size: 14px;
    padding: 4px 0;
    .user-name {
      padding: 8px 12px 12px;
      font-size: 16px;
      margin-bottom: 4px;
      border-bottom: 1px solid $border;
      color: $theme;
    }
    .item {
      padding: 8px 12px;
      margin: 0 4px;
      border-radius: $inner-radius;
      cursor: pointer;
      user-select: none;
      transition: all 0.2s;

      &:hover {
        background: $panel-light;
      }

      &.danger {
        color: $red;
        &:hover {
          background: $red;
          color: $color;
        }
      }

      &.primary {
        color: $theme;
        &:hover {
          background: $theme;
          color: $color;
        }
      }
    }
  }
}
</style>
