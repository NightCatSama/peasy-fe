<script setup lang="ts">
import { Project } from '@@/entities/project.entity'
import { useRouter } from 'vue-router'
import MaterialCard from '@/components/widgets/MaterialCard.vue'
import Btn from '@/components/widgets/Btn.vue'
import { getDomainURL, projectApi, projectPreviewUrl } from '@/utils/mande'
import { reactive } from 'vue'
import { IResponse } from '@@/types/response'
import Icon from '@/components/widgets/Icon.vue'
import { Modal } from '@/components/modal'
import { $t } from '@/constants/i18n'
import { AlertSuccess } from '@/utils/alert'

interface IDashboardProps {
  projects: Project[]
  subProjects: Project[]
}

const { projects, subProjects } = defineProps<IDashboardProps>()

const router = useRouter()

let collapseIndex = $ref(-1)
let projectMap = reactive<{ [key: string]: { project: Project, subPage: Project[] } }>({})

const handleFetchProjectDetail = async (project: Project) => {
  if (projectMap[project.id]) {
    return
  }
  const { data } = await projectApi.get<IResponse<{ project: Project; subPage: Project[]}>>(project.id)
  projectMap[project.id] = data
}

const handleGotoProject = (project?: Project) => {
  if (!project) {
    router.push({
      name: 'template',
    })
  } else {
    router.push({
      name: 'edit',
      params: {
        id: project.id,
      },
    })
  }
}

const openPreviewProject = (project: Project) => {
  let a: HTMLAnchorElement | null = document.createElement('a')
  a.href = projectPreviewUrl(project.id)
  a.setAttribute('target', '_blank')
  a.click()
  a.remove()
  a = null
}

const handleSwitchIndex = (index: number, project: Project) => {
  handleFetchProjectDetail(project)
  collapseIndex = collapseIndex === index ? -1 : index
}

const handleDeleteSubPage = async (mainProjectId: string, subPage: Project) => {
  if (await Modal.confirm($t('deleteConfirmMsg', subPage.name), { title: $t('deleteConfirm', subPage.name) })) {
    await projectApi.delete(subPage.id)
    projectMap[mainProjectId].subPage = projectMap[mainProjectId].subPage.filter((p) => p.id !== subPage.id)
    AlertSuccess($t('deleteSuccess'))
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="title">
      <span>{{ $t('dashboard') }}</span>
      <Btn color="orange" @click="() => handleGotoProject()">{{ $t('newProject') }}</Btn>
    </div>
    <div :class="['data-wrapper']">
      <div class="data-list">
        <div
          v-for="(item, index) in projects"
          :key="item.name + index"
          :class="['project-wrapper', { active: collapseIndex === index }]"
        >
          <div class="project-item" @click="() => handleSwitchIndex(index, item)">
            <div :class="['project-item-sign', { active: item.isPublic }]"></div>
            <div class="project-item-info">
              <div class="project-item-name">{{ item.name }}</div>
              <a
                v-if="item.isPublic"
                class="project-item-sign-text link"
                :href="getDomainURL(item.domain)"
                target="_blank"
                @click.stop
              >{{ getDomainURL(item.domain) }}</a>
              <div v-else class="project-item-sign-text">{{ 'Not Public' }}</div>
            </div>
            <div class="project-item-operate-group">
              <Btn
                size="sm"
                color="primary"
                class="btn edit-btn"
                type="inner"
                icon="edit"
                @click.stop="() => handleGotoProject(item)"
              >{{ $t('edit') }}</Btn>
              <Btn
                size="sm"
                color="purple"
                class="btn preview-btn"
                type="inner"
                icon="eye"
                @click.stop="() => openPreviewProject(item)"
              >{{ $t('preview') }}</Btn>
              <Btn
                size="sm"
                color="red"
                class="btn delete-btn"
                type="inner"
                icon="delete"
                @click.stop="() => $emit('on-delete-project', item)"
              >{{ $t('delete') }}</Btn>
            </div>
          </div>
          <div :class="['project-page-list', { hide: collapseIndex !== index }]">
            <div class="spin-wrapper" v-if="!projectMap[item.id]">
              <Icon name="spin" :size="32" loading></Icon>
            </div>
            <template v-else>
              <MaterialCard
                :type="'project'"
                :item="item"
                @on-project-click="openPreviewProject(item)"
                @on-save-template="$emit('on-save-template', item)"
                @on-setting-project="$emit('on-setting-project', item)"
                @on-delete-project="$emit('on-delete-project', item)"
              >
              </MaterialCard>
              <MaterialCard
                v-for="(subItem, index) in projectMap[item.id]?.subPage || []"
                :key="subItem.name + index"
                :type="'project'"
                :item="subItem"
                @on-project-click="openPreviewProject(subItem)"
                @on-save-template="$emit('on-save-template', subItem)"
                @on-setting-project="$emit('on-setting-project', subItem)"
                @on-delete-project="handleDeleteSubPage(item.id, subItem)"
              >
              </MaterialCard>
            </template>
          </div>
        </div>
        <div class="empty-tip" v-if="projects.length === 0">
          {{ $t('projectNoData') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dashboard {
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
    background-color: rgba($black, .2);

    transition: all .2s;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &:hover, &.active {
      background-color: rgba($black, .5);
    .project-item-operate-group {
      opacity: 1;
    }
    }
  }

  .project-item {
    width: 100%;
    display: flex;
    align-items: center;
    cursor: pointer;

    &-sign {
      position: relative;
      margin-right: 16px;
      width: 24px;
      height: 24px;
      flex-shrink: 0;
      border-radius: $inner-radius;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: $grey;
      }

      &.active::after {
        background-color: $green;
      }
    }

    &-name {
      font-weight: bold;
      font-size: 16px;
      color: $white;
    }

    &-sign-text {
      display: flex;
      font-size: 13px;
      line-height: 14px;
      color: $grey;
      text-decoration: none;
      outline: none;
      border: none;
      transition: all .2s;

      &.link {
        cursor: pointer;

        &:hover {
          color: $blue;
        }
      }
    }

    &-operate-group {
      opacity: 0;
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .btn {
        width: auto;
        margin-left: 8px;
        padding: 0 10px 0 4px;
        height: 30px;

        &.edit-btn {
          background: $tr;
          color: $theme;
          border: 1px solid $theme;

          &:hover {
            color: $white;
            background: $theme;
          }
        }

        &.preview-btn {
          background: $tr;
          color: $purple;
          border: 1px solid $purple;

          &:hover {
            color: $white;
            background: $purple;
          }
        }

        &.delete-btn {
          background: $tr;
          color: $red;
          border: 1px solid $red;

          &:hover {
            color: $white;
            background: $red;
          }
        }
      }
    }
  }

  .project-page-list {
    display: flex;
    width: 100%;
    margin-top: 16px;
    border: 1px dashed rgba($white, 30%);
    border-radius: $inner-radius;
    padding: 12px 12px 0;
    overflow: auto;
    flex-wrap: nowrap;
    transition: all .3s;
    height: 200px;

    &.hide {
      height: 0;
      padding: 0 12px;
      margin: 0;
      opacity: 0;
    }

    .material-card {
      margin: 0 16px 0 0;
      flex-shrink: 0;
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
