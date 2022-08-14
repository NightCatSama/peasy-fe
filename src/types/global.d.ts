import { $t } from '@/constants/i18n'

declare module 'vue' {
  interface ComponentCustomProperties {
    $t: typeof $t
  }
}
