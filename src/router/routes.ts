import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { name: 'login', path: 'login', component: () => import('pages/LoginPage.vue') },
      { name: 'queue', path: 'queue', component: () => import('pages/QueuePage.vue') },
      { name: 'playlists', path: 'playlists', component: () => import('pages/PlaylistPage.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
