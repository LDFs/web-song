<script setup>
import { RouterView } from 'vue-router'
import Header from '@/views/outlineView/TopHeader.vue'
const headerMenu = [
    {
      name: '发现音乐',
      linkName: '/'
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
  <Header :menu="headerMenu" :subMenu="firstSubMenu" />

  <RouterView />
  <footer>
    前端项目练习 by LDF
  </footer>
</template>

<style scoped>
footer {
  margin: 1vw;
  padding: 1vw;
  border-top: 1px solid #b9b9b9;
  width: 100vw;
  text-align: center;
}
</style>
