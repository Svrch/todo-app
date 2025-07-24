import { createRouter, createWebHistory } from 'vue-router'
import { BaseLayout } from '../../layouts'

const router = createRouter({
  scrollBehavior: () => ({ left: 0, top: 0 }),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '',
      component: BaseLayout,
      redirect: 'home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('../../../pages/home/ui/HomePage.vue'),
        },
        {
          path: '/:catchAll(.*)*',
          component: () => import('../../../pages/home/ui/HomePage.vue'),
        },
      ],
    },
  ],
})

export default router
