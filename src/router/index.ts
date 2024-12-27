import { isLogin } from '@/utils/auth'
import BlankLayout from '@/views/layouts/BlankLayout.vue'
import DefaultLayout from '@/views/layouts/DefaultLayout.vue'
import SpaceLayoutView from '@/views/space/SpaceLayoutView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          redirect: { name: 'pages-home' },
        },
        {
          path: 'home',
          name: 'pages-home',
          component: () => import('@/views/pages/HomeView.vue'),
        },
        {
          path: 'space/',
          component: SpaceLayoutView,
          children: [
            {
              path: 'apps',
              name: 'space-apps-list',
              component: () => import('@/views/space/apps/ListView.vue'),
            },
            {
              path: 'tools',
              name: 'space-tools-list',
              component: () => import('@/views/space/tools/ListView.vue'),
            },
            {
              path: 'workflows',
              name: 'space-workflows-list',
              component: () => import('@/views/space/workflows/ListView.vue'),
            },
            {
              path: 'datasets',
              name: 'space-datasets-list',
              component: () => import('@/views/space/datasets/ListView.vue'),
            },
          ],
        },
        {
          path: 'store/apps',
          name: 'store-apps-list',
          component: () => import('@/views/store/apps/ListView.vue'),
        },
        {
          path: 'store/tools',
          name: 'store-tools-list',
          component: () => import('@/views/store/tools/ListView.vue'),
        },
        {
          path: 'open',
          name: 'open-index',
          component: () => import('@/views/open/IndexView.vue'),
        },
        {
          path: 'space/datasets/:datasetId/documents',
          name: 'space-datasets-documents-list',
          component: () => import('@/views/space/datasets/documents/ListView.vue'),
        },
        {
          path: 'space/datasets/:datasetId/documents/create',
          name: 'space-datasets-documents-create', // 修改这里的路由名称
          component: () => import('@/views/space/datasets/documents/CreateView.vue'),
        },
      ],
    },
    {
      path: '/',
      component: BlankLayout,
      children: [
        {
          path: 'auth/login',
          name: 'auth-login',
          component: () => import('@/views/auth/LoginView.vue'),
        },
        {
          path: 'space/apps/:id',
          name: 'space-apps-detail',
          component: () => import('@/views/space/apps/DetailView.vue'),
        },
      ],
    },
  ],
})

router.beforeEach(async (to) => {
  if (to.name !== 'auth-login' && !isLogin()) {
    return { name: 'auth-login' }
  }
})

export default router
