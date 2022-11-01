<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/widgets/Icon.vue'
import { $t, lang } from '@/constants/i18n'
import Avatar from '@/components/widgets/Avatar.vue'
import Btn from '@/components/widgets/Btn.vue'
import { Alert } from '@/utils/alert'
import { Modal } from '@/components/modal'
import { useUserStoreHelper } from '@/hooks/store'

const { avatar, userName, isLogin, vipName, expireDate, updateAvatar, activeMember } = useUserStoreHelper()

const router = useRouter()
const route = useRoute()

const handleUpdateAvatar = (img: string) => {
  updateAvatar(img)
}

const handleUpgradePlan = () => {
  Alert($t('upgradePlanTip'))
}

const handleInviteCode = async() => {
  const code = await Modal.prompt($t('inviteCode'))

  if (code && typeof code === 'string') {
    await activeMember(code)
    Alert($t('activeSuccess'))
  }
}

const switchLang = async(lang: 'zh' | 'en') => {
  router.replace({
    name: route.name!,
    params: { ...route.params },
    query: {
      lang
    }
  })
  setTimeout(() => location.reload(), 0)
}
</script>

<template>
  <div class="settings">
    <div class="title">
      <span>{{ $t('settings') }}</span>
    </div>
    <div :class="['data-wrapper']">
      <div class="item">
        <div class="label">{{ $t('avatar') }}</div>
        <Avatar :image="avatar" :size="80" :can-upload="isLogin" :on-upload="handleUpdateAvatar"></Avatar>
      </div>
      <div class="item">
        <div class="label">{{ $t('account') }}</div>
        <div class="value">{{ userName }}</div>
      </div>
      <div class="item">
        <div class="label">{{ $t('language') }}</div>
        <Btn type="text" class="value" @click=" () => switchLang(lang === 'en' ? 'zh' : 'en')">
          {{ lang === 'zh' ? $t('switchToEN') : $t('switchToZH') }}
        </Btn>
      </div>
      <div class="item">
        <div class="label">{{ $t('yourPlan') }}</div>
        <div class="value">
          <span>{{ vipName }}</span>
          <span v-if="expireDate" class="expire-date">{{ $t('expiresOn') }} {{ expireDate }}</span>
        </div>
      </div>
      <div class="item">
        <div class="label">
          <span>{{ $t('pricingPlan') }}</span>
          <div class="btn-wrapper">
            <Btn type="text" size="sm" color="second" class="invite-code-btn" @click="handleInviteCode">{{ $t('iHaveInviteCode') }}</Btn>
            <Btn color="purple" @click="handleUpgradePlan">{{ $t('upgradePlan') }}</Btn>
          </div>
        </div>
        <div class="table">
          <div class="table-column header">
            <div class="table-td">
              <div class="table-td-name">{{ $t('overview') }}</div>
              <div class="table-td-pricing">{{ '-' }}</div>
            </div>
            <div class="table-td">{{ $t('projectCount') }}</div>
            <div class="table-td">{{ $t('pageCount') }}</div>
            <div class="table-td">{{ $t('templates') }}</div>
            <div class="table-td">{{ $t('multiplePages') }}</div>
            <div class="table-td">{{ $t('consultingServices') }}</div>
            <div class="table-td">{{ $t('customSubDomain') }}</div>
            <!-- <div class="table-td">{{ $t('customHost') }}</div> -->
          </div>
          <div class="table-column">
            <div class="table-td">
              <div class="table-td-name">{{ 'Basic' }}</div>
              <div class="table-td-pricing">{{ $t('free') }}</div>
            </div>
            <div class="table-td">{{ '1' }}</div>
            <div class="table-td">{{ '5' }}</div>
            <div class="table-td">{{ $t('basicTemplate') }}</div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="close" color="grey" :size="16"></Icon>
            </div>
            <!-- <div class="table-td">
              <Icon name="close" color="grey" :size="16"></Icon>
            </div> -->
          </div>
          <div class="table-column">
            <div class="table-td">
              <div class="table-td-name">{{ 'Advanced' }}</div>
              <div class="table-td-pricing highlight">{{ '10$' }}<span class="date">{{ $t('perMonth') }}</span></div>
            </div>
            <div class="table-td">{{ '5' }}</div>
            <div class="table-td">{{ '99' }}</div>
            <div class="table-td">{{ $t('allTemplates') }}</div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <!-- <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div> -->
          </div>
          <div class="table-column">
            <div class="table-td">
              <div class="table-td-name">{{ 'Professional' }}</div>
              <div class="table-td-pricing highlight">{{ '29$' }}<span class="date">{{ $t('perMonth') }}</span></div>
            </div>
            <div class="table-td">{{ '99' }}</div>
            <div class="table-td">{{ '999' }}</div>
            <div class="table-td">{{ $t('allTemplates') }}</div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div>
            <!-- <div class="table-td">
              <Icon name="check" color="green" :size="16"></Icon>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.settings {
  .title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 12px;
  }

  .item {
    display: flex;
    margin-bottom: 20px;
    flex-direction: column;
    padding: 16px 24px;
    border-radius: $normal-radius;
    background-color: rgba($black, .2);

    .label {
      font-size: 20px;
      color: $white;
      margin-bottom: 4px;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .value {
      color: $grey;
      align-self: flex-start;
      padding: 0;
      display: flex;
      flex-direction: column;

      &.btn {
        color: $blue;
      }

      .expire-date {
        margin-top: 4px;
        color: $pink;
        font-size: 12px;
      }
    }

    .invite-code-btn {
      margin-right: 12px;
      color: $grey;
      text-decoration: underline;
    }

    .table {
      display: flex;
      width: 100%;
      margin: 12px 0;
      border-radius: $normal-radius;
      overflow: hidden;

      &-column {
        width: 100%;
        display: flex;
        flex-direction: column;
        font-size: 16px;

        &.header {
          // background: $black;
          font-weight: bold;
          font-size: 14px;

          .table-td {
            // padding: 12px 0;
            // color: $yellow;
          }
        }
      }

      &-td {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        padding: 12px 0;
        color: $color;

        &:first-child {
          // background: $pink;
          // color: $black;
          padding: 16px 0;
        }

        &:nth-child(2n) {
          background: rgba($black, .2);
        }

        &-name {
          font-size: 16px;
          font-weight: bold;
        }

        &-pricing {
          font-size: 24px;
          color: $color;
          margin-top: 4px;

          &.highlight {
            color: $yellow;
            font-weight: bold;
          }

          .date {
            font-size: 14px;
            color: $grey;
          }
        }
      }
    }
  }
}
</style>
