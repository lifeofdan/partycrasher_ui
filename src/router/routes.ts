import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: async () => await import('layouts/LoginLayout.vue'),
    children: [
      { path: '', redirect: '/app/tracks' },
      { name: 'login', path: 'login', meta: { title: 'Login' }, component: async () => await import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/app',
    component: async () => await import('layouts/MainLayout.vue'),
    children: [
      { name: 'app.profile', path: 'profile', meta: { title: 'Profile' }, component: async () => await import('pages/profile/ProfilePage.vue') },
      {
        name: 'app.tracks',
        path: 'tracks',
        meta: { title: 'Tracks' },
        component: async () => await import('pages/TracksPage.vue'),
        children: [
          {
            component: async () => await import('pages/tracks/TrackPage.vue'),
            name: 'app.track',
            path: ':id',
            meta: { title: 'Track', child: true }
          }
        ]
      },
      {
        name: 'app.albums',
        path: 'albums',
        meta: { title: 'Albums' },
        component: async () => await import('pages/TracksPage.vue'),
        children: [
          {
            component: async () => await import('pages/tracks/TrackPage.vue'),
            name: 'app.album',
            path: ':id',
            meta: { title: 'Album', child: true }
          }
        ]
      },
      {
        name: 'app.search',
        path: 'search',
        meta: { title: 'Search' },
        component: async () => await import('pages/SearchPage.vue')
      },
      {
        component: async () => await import('pages/PlaylistsIndexPage.vue'),
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
