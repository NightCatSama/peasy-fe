import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VTooltip, VClosePopper } from 'floating-vue'

import App from './App.vue'
import { Text, Block, Image, Icon } from './components/libs'
import GlobalDirective from './toolkit/global.directive'
import Toast from "vue-toastification"

import 'floating-vue/dist/style.css'
import "vue-toastification/dist/index.css";

const app = createApp(App)

app.use(createPinia())
app.use(GlobalDirective)
app.use(Toast, {
  position: "bottom-right",
  timeout: 2000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: false,
  showCloseButtonOnHover: false,
  hideProgressBar: true,
  closeButton: false,
  icon: true,
  rtl: false
})

app.directive('tooltip', VTooltip)
app.directive('close-popper', VClosePopper)

app.component('Text', Text)
app.component('Block', Block)
app.component('Image', Image)
app.component('Icon', Icon)

app.mount('#app')
