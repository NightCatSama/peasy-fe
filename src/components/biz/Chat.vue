<script setup lang="ts">
import { $t } from '@/constants/i18n'
import { AlertError, AlertSuccess } from '@/utils/alert'
import { emitter } from '@/utils/event'
import { sendEmailApi } from '@/utils/mande'
import { onMounted, onUnmounted } from 'vue'
import Logo from '../Logo.vue'
import Btn from '../widgets/Btn.vue'
import Icon from '../widgets/Icon.vue'

let chatVisible = $ref(false)
let email = $ref('')
let msg = $ref('')
let emailElem = $ref<HTMLInputElement | null>(null)

const handleSend = async () => {
  if (!email || !email.includes('@')) {
    AlertError($t('emailError'))
    return
  }
  if (!msg) {
    AlertError($t('emailError'))
    return
  }

  await sendEmailApi.post({
    email,
    msg,
  })
  msg = ''
  chatVisible = false
  AlertSuccess($t('emailSendSuccess'))
}

onMounted(() => {
  emitter.on('openChat', () => {
    chatVisible = true
    setTimeout(() => emailElem?.focus())
  })
})

onUnmounted(() => {
  emitter.off('openChat')
})
</script>

<template>
  <div :class="['chat']">
    <div class="chat-btn" v-if="!chatVisible">
      <Icon name="chat-o" :size="32" @click="chatVisible = true" />
    </div>
    <div class="chat-panel" v-else>
      <div class="chat-panel-header">
        <Logo :size="32"></Logo>
        <div class="logo-text">Peasy</div>
        <Icon type="btn" name="down" :size="16" @click="chatVisible = false" />
      </div>
      <div class="chat-panel-content">
        <div class="email-input">
          <input ref="emailElem" type="text" :placeholder="$t('emailAddress')" v-model="email" />
        </div>
        <div class="email-content">
          <textarea type="text" rows="7" :placeholder="$t('emailMessage')" v-model="msg"></textarea>
        </div>
        <Btn type="icon" icon="send" size="lg" class="send-btn" @click="handleSend"></Btn>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.chat {
  position: fixed;
  z-index: 9;
  right: 24px;
  bottom: 24px;
  box-shadow: $shadow;

  .chat-btn {
    padding: 8px;
    border-radius: 50%;
    background: $roseate;
    color: $white;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  }

  .chat-panel {
    width: 360px;
    height: auto;
    border-radius: $normal-radius;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    &-header {
      height: 50px;
      padding: 0 12px;
      display: flex;
      align-items: center;
      background-color: $roseate;

      .logo-text {
        flex: 1;
        margin-left: 8px;
        font-size: 18px;
      }
    }

    &-content {
      display: flex;
      flex-direction: column;
      background-color: $white;
      flex: 1;

      .email-input {
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid $border;
      }

      input,
      textarea {
        width: 100%;
        height: 100%;
        font-size: 14px;
        border: none;
        outline: none;
        padding: 16px;
        resize: none;
        font-family: $font-family;

        &::placeholder {
          color: $grey;
        }
      }
    }

    .send-btn {
      position: absolute;
      right: 10px;
      bottom: 10px;
      color: $white;

      .icon-inner {
        position: relative;
        left: -1px;
      }
    }
  }
}
</style>
