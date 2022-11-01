<script setup lang="ts">
import SectionList from '@/components/biz/SectionList.vue'
import { useRouter } from 'vue-router'
import FontFamilyPanel from './biz/FontFamilyPanel.vue'
import GlobalSettingPanel from './biz/GlobalSettingPanel.vue'
import QuestionPanel from './biz/QuestionPanel.vue'
import Logo from './Logo.vue'
import Dropdown from './widgets/Dropdown.vue'
import Icon from './widgets/Icon.vue'

interface ISidebarProps {
  keyboard: boolean
  activeMaterialsPanel: boolean
}

const router = useRouter()

const { activeMaterialsPanel } = defineProps<ISidebarProps>()

const gotoHome = () => {
  router.push({
    name: 'home',
  })
}
</script>

<template>
  <div class="sidebar">
    <div class="logo-wrapper">
      <Logo :size="32" @click="gotoHome" />
    </div>
    <div class="operator-panel">
      <div class="top">
        <div class="operator-item add-item">
          <Icon
            :size="26"
            name="add"
            :active="activeMaterialsPanel"
            @click.native="$emit('change-materials-panel', !activeMaterialsPanel)"
          />
        </div>
        <SectionList />
      </div>
      <div class="bottom">
        <Dropdown
          :placement="'right-end'"
          popper-class="sidebar-dropdown"
          :skidding="40"
          :distance="16"
          type="pure"
        >
          <template #default="{ shown }">
            <div
              class="operator-item first"
              v-tooltip="{
                content: $t('question'),
                placement: 'right',
                distance: 10,
                disabled: shown,
              }"
            >
              <Icon :size="22" name="question-circle" :active="shown" />
            </div>
          </template>
          <template #content>
            <QuestionPanel />
          </template>
        </Dropdown>
        <div
          class="operator-item"
          v-tooltip="{ content: $t('shortcut'), placement: 'right', distance: 10 }"
          @click="$emit('update:keyboard', !keyboard)"
        >
          <Icon :size="26" name="keyboard" :active="keyboard" />
        </div>
        <Dropdown
          :placement="'right-end'"
          popper-class="sidebar-dropdown"
          :skidding="40"
          :distance="16"
          type="pure"
        >
          <template #default="{ shown }">
            <div
              class="operator-item"
              v-tooltip="{
                content: $t('fontSetting'),
                placement: 'right',
                distance: 10,
                disabled: shown,
              }"
            >
              <Icon :size="26" name="font" :active="shown" />
            </div>
          </template>
          <template #content>
            <FontFamilyPanel />
          </template>
        </Dropdown>
        <Dropdown
          :placement="'right-end'"
          popper-class="sidebar-dropdown"
          :skidding="10"
          :distance="16"
          type="pure"
        >
          <template #default="{ shown }">
            <div
              class="operator-item last"
              v-tooltip="{
                content: $t('pageGlobalSetting'),
                placement: 'right',
                distance: 10,
                disabled: shown,
              }"
            >
              <Icon :size="26" name="advanced" :active="shown" />
            </div>
          </template>
          <template #content>
            <GlobalSettingPanel />
          </template>
        </Dropdown>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar {
  position: relative;
  width: 64px;
  height: 100%;
  flex-shrink: 0;
  background: $panel-sidebar;
  display: flex;
  flex-direction: column;
  align-items: center;

  .logo-wrapper {
    height: $header-height;
    flex-shrink: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .operator-panel {
    display: flex;
    flex-direction: column;
    padding: 16px 0;
    flex: 1;
    overflow: hidden;
  }

  .top {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  }

  .bottom {
    flex-shrink: 0;
  }

  .operator-item {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 8px;

    &.first {
      margin-bottom: 10px;
    }

    &.last {
      margin-bottom: 0;
    }

    &.add-item :deep(.icon) {
      background: $panel;
    }

    &:hover {
      color: $theme;
    }
  }
}
</style>

<style lang="scss">
.sidebar-dropdown {
  // 手动 hack 与边缘间距
  $hack-gap: 8px;
  top: -$hack-gap;
  .v-popper__arrow-container {
    transform: translateY($hack-gap);
  }
}
</style>
