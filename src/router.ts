import {
  createRouter,
  createWebHistory,
  NavigationGuardNext,
  RouteLocationNormalized,
} from 'vue-router'

import Configure from '@/pages/configure/Configure.vue'
import Redirect from '@/pages/Redirect.vue'
import Dashboard from '@/pages/dashboard/Dashboard.vue'
import Template from '@/pages/Template.vue'
import NotFound from '@/pages/NotFound.vue'
import Admin from '@/pages/Admin.vue'
import Preview from '@/pages/Preview.vue'

const needReloadPage = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (from.name && !(from.name === 'create' && to.name === 'edit')) {
    location.href = import.meta.env.VITE_URL_BASE + to.fullPath.slice(1)
  } else {
    next()
  }
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_URL_BASE),
  routes: [
    { path: '', redirect: '/edit', name: 'home' },
    { path: '/edit', component: Configure, name: 'create', beforeEnter: needReloadPage },
    { path: '/edit/:id', component: Configure, name: 'edit', beforeEnter: needReloadPage },
    {
      path: '/template/edit/:id',
      component: Configure,
      name: 'template-edit',
      beforeEnter: needReloadPage,
    },
    { path: '/dashboard', component: Dashboard, name: 'dashboard' },
    { path: '/admin/fix/:code', component: Admin, name: 'admin-fix' },
    { path: '/preview/:id', component: Preview, name: 'preview' },
    { path: '/preview/p/:id', component: Preview, name: 'preview-project' },
    { path: '/template', component: Template, name: 'template' },
    { path: '/redirect', component: Redirect, name: 'redirect' },
    { path: '/:pathMatch(.*)', component: NotFound, name: 'not-found' },
  ],
})
