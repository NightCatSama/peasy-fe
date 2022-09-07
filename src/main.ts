import { createApp } from 'vue'
import FloatingVue, { VTooltip, VClosePopper } from 'floating-vue'
import { createLogto, LogtoConfig } from '@logto/vue'

import App from './App.vue'
import { Text, Block, Image, Icon, Media, InputField } from './components/libs'
import GlobalDirective from './toolkit/global.directive'
import Toast from 'vue-toastification'

import 'floating-vue/dist/style.css'
import 'vue-toastification/dist/index.css'
import { router } from './router'
import { pinia } from './stores'
import { $t } from './constants/i18n'

const config: LogtoConfig = {
  endpoint: import.meta.env.VITE_LOGTO_HOST,
  appId: import.meta.env.VITE_LOGTO_APPID,
  resources: [import.meta.env.VITE_LOGTO_RESOURCE],
}

const app = createApp(App)

app.use(router)
app.use(createLogto, config)

app.use(pinia)
;(window as any).__pinia__ = pinia

app.use(GlobalDirective)
app.use(Toast, {
  position: 'bottom-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false,
})

FloatingVue.options.themes.tooltip.html = true
FloatingVue.options.themes.tooltip.popperTriggers = ['hover', 'focus']

app.directive('tooltip', VTooltip)
app.directive('close-popper', VClosePopper)

app.component('Text', Text)
app.component('Block', Block)
app.component('Image', Image)
app.component('Icon', Icon)
app.component('Media', Media)
app.component('InputField', InputField)

app.config.globalProperties.$t = $t

app.mount('#app')
