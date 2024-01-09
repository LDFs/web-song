<script setup>
import { RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
import Header from '@/views/outlineView/TopHeader.vue'
const headerMenu = [
    {
      name: '发现音乐',
      linkName: ''
    },{
      name: '我的音乐',
      linkName: 'my'
    },{
      name: '关注',
      linkName: 'friend'
    }
  ]
const firstSubMenu = [
    {
      name: '推荐',
      linkName: ''
    },{
      name: '排行榜',
      linkName: 'discover/toplist'
    },{
      name: '歌单',
      linkName: 'discover/playlist'
    },{
      name: '歌手',
      linkName: 'discover/artist'
    },{
      name: '新碟上架',
      linkName: 'discover/album'
    }
  ]

</script>

<template>
  <Header :menu="headerMenu" :subMenu="firstSubMenu" />

  <RouterView />
  <footer>
    
  </footer>
</template>

<style scoped>

</style>
