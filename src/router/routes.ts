import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('layouts/LoginLayout.vue'),
    children: [
      { path: '', redirect: '/login' },
      { name: 'login', path: 'login', meta: { title: 'Login' }, component: async () => await import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/app',
    component: async () => await import('layouts/MainLayout.vue'),
    children: [
      { name: 'app.queue', path: 'queue', meta: { title: 'Queue' }, component: async () => await import('pages/QueuePage.vue') },
      { name: 'app.profile', path: 'profile', meta: { title: 'Profile' }, component: async () => await import('pages/profile/ProfilePage.vue') },
      {
        component: async () => await import('pages/PlaylistsPage.vue'),
        name: 'app.playlists',
        path: 'playlists',
        meta: { title: 'Playlists' },
        children: [
          {
            component: async () => await import('pages/playlists/PlaylistPage.vue'),
            name: 'app.playlist',
            path: ':id',
            meta: { title: 'Playlist', child: true }
          }
        ]
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: async () => await import('pages/ErrorNotFound.vue')
  }
]

export default routes
