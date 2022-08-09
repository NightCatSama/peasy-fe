
import { createRouter, createWebHistory } from 'vue-router'

import Configure from '@/pages/Configure.vue'
import Redirect from '@/pages/Redirect.vue'
import Me from '@/pages/Me.vue'

const routes = [
  { path: '/', component: Configure },
  { path: '/me', component: Me },
  { path: '/redirect', component: Redirect },
]

export const router = createRouter({
  history: createWebHistory('/no-code/'),
  routes,
})
