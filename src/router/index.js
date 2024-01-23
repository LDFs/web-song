import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/homeView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        keepAlive: true 
      },
      component: HomeView
    },
    {
      path: '/my',
      name: 'my',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/myMusic/MyMusic.vue')
    },
    {
      path: '/friend',
      name: 'friend',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/follow/FollowFriend.vue')
    },
    {
      path: '/toplist',
      name: 'rankList',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/rankList/RankList.vue')
    },
    {
      path: '/playlist',
      name: 'playlist',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/playlist/PlaylistView.vue')
    },
    {
      path: '/playlistDetail',
      name: 'playlistDetail',
      meta: {
        keepAlive: false 
      },
      component: () => import('@/views/playlist/ListDetail.vue')
    },
    {
      path: '/artist',
      name: 'artist',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/artist/ArtistView.vue')
    },
    {
      path: '/album',
      name: 'album',
      meta: {
        keepAlive: true 
      },
      component: () => import('@/views/newAlbum/NewAlbum.vue')
    }
  ]
})

export default router
