<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia';
import { useLogto } from '@logto/vue';
import Btn from '@/components/widgets/Btn.vue';
import Avatar from '@/components/widgets/Avatar.vue';
import ImageItem from '@/components/configs/items/ImageItem.vue';
import { projectApi } from '@/utils/mande';
import { onMounted, reactive } from 'vue';
import { IPage } from '@/config';
import { Project } from '@@/entities/project.entity';
import { IResponse } from '@@/types/response'
import { useRouter } from 'vue-router';

const router = useRouter()

const userStore = useUserStore()
const { userName, avatar } = storeToRefs(userStore)
const { updateAvatar } = userStore

const { signOut, signIn, isAuthenticated } = useLogto();
const handleSignIn = () => signIn(import.meta.env.VITE_LOGTO_REDIRECT_URL)
const handleSignOut = () => signOut(import.meta.env.VITE_LOGTO_SIGN_OUT_URL)

const handleUpdateAvatar = (img: string) => {
  updateAvatar(img)
}

let projectMap: Project[] = $ref([])

onMounted(async () => {
  const { data } = await projectApi.get<IResponse<Project[]>>('')
  projectMap = data
})

const handleGotoProject = (project: Project) => {
  router.push({
    name: 'edit',
    params: {
      id: project.id
    }
  })
}
</script>

<template>
  <div class="me-page">
    <div class="user-info">
      <Avatar :image="avatar" :size="120" can-upload :on-upload="handleUpdateAvatar"></Avatar>
      <div v-if="!isAuthenticated">
        <Btn class="sign-btn" type="btn" color="primary" @click="handleSignIn">登录</Btn>
      </div>
      <template v-else>
        <div class="user-name">{{ userName }}</div>
        <Btn class="sign-btn" type="btn" color="default" @click="handleSignOut">退出登录</Btn>
      </template>
    </div>
    <div class="data-wrapper">
      <div class="data-title">Project</div>
      <div class="data-item" v-for="item in projectMap">
        <div
          class="data-image"
          :style="{ backgroundImage: item.cover ? `url(${item.cover})` : void 0 }"
          @click="handleGotoProject(item)"
        ></div>
        <div class="data-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.me-page {
  background: $panel-light-gradient;
  min-height: 100vh;
  font-family: $font-family;
  .user-info {
    height: 320px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: $panel-gradient;
  }
  .user-name {
    margin-top: 20px;
    font-size: 30px;
    color: $yellow;
  }

  .sign-btn {
    margin-top: 10px;
  }

  .data-wrapper {
    padding: 20px 28px;
    .data-title {
      margin-top: 20px;
      font-size: 30px;
      color: $white;
      font-weight: bold;
    }

    .data-item {
      width: 160px;
      display: inline-flex;
      flex-direction: column;
      margin: 12px 24px 12px 0;

      .data-image {
        width: 100%;
        height: 180px;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        border-radius: $inner-radius;
        background-color: $color;
        cursor: pointer;
      }

      .data-name {
        color: $color;
        font-size: 18px;
        padding: 10px 4px;
      }
    }
  }
}
</style>