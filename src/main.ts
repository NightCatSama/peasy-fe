import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import { Text, Block, Image } from './components/libs'

const app = createApp(App)

app.use(createPinia())

app.component('Text', Text)
app.component('Block', Block)
app.component('Image', Image)

app.mount('#app')
