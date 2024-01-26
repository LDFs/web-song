<script setup>
import { RouterView } from 'vue-router'
import Header from '@/views/outlineView/TopHeader.vue'

const firstSubMenu = [
    {
      name: '推荐',
      linkName: '/'
    },{
      name: '排行榜',
      linkName: 'toplist'
    },{
      name: '歌单',
      linkName: 'playlist'
    },{
      name: '歌手',
      linkName: 'artist'
    },{
      name: '新碟上架',
      linkName: 'album'
    }
  ]

</script>

<template>
  <Header :subMenu="firstSubMenu" />  
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"/>
    </keep-alive>    
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"/>
  </router-view>
  <footer>
    前端项目练习 by LDF
  </footer>
</template>

<style scoped>
footer {
  margin: 1vw;
  margin-top: 0;
  padding: 1vw;
  border-top: 1px solid #b9b9b9;
  width: 100vw;
  text-align: center;
}
</style>
