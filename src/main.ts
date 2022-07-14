import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { VTooltip, VClosePopper } from 'floating-vue'

import App from './App.vue'
import { Text, Block, Image } from './components/libs'

import 'floating-vue/dist/style.css'

const app = createApp(App)

app.use(createPinia())

app.directive('tooltip', VTooltip)
app.directive('close-popper', VClosePopper)

app.component('Text', Text)
app.component('Block', Block)
app.component('Image', Image)

app.mount('#app')
