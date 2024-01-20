import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/homeView/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/my',
      name: 'my',
      component: () => import('@/views/myMusic/MyMusic.vue')
    },
    {
      path: '/friend',
      name: 'friend',
      component: () => import('@/views/follow/FollowFriend.vue')
    },
    {
      path: '/toplist',
      name: 'rankList',
      component: () => import('@/views/rankList/RankList.vue')
    },
    {
      path: '/playlist',
      name: 'playlist',
      component: () => import('@/views/playlist/PlaylistView.vue')
    },
    {
      path: '/artist',
      name: 'artist',
      component: () => import('@/views/artist/ArtistView.vue')
    },
    {
      path: '/album',
      name: 'album',
      component: () => import('@/views/newAlbum/NewAlbum.vue')
    }
  ]
})

export default router
