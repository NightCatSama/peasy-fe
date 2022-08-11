
import { createRouter, createWebHistory } from 'vue-router'

import Configure from '@/pages/Configure.vue'
import Redirect from '@/pages/Redirect.vue'
import Me from '@/pages/Me.vue'

const routes = [
  { path: '/', redirect: '/edit' },
  { path: '/edit', component: Configure, name: 'createPage' },
  { path: '/edit/:id', component: Configure, name: 'editPage' },
  { path: '/me', component: Me, name: 'user' },
  { path: '/redirect', component: Redirect, name: 'redirect' },
]

export const router = createRouter({
  history: createWebHistory('/no-code/'),
  routes,
})
