<script setup>
import {ref} from 'vue'
import { RouterView } from 'vue-router'
import {loginTmp, loginStatus} from '@/network/user'
import Header from '@/views/outlineView/TopHeader.vue'
import FooterPlay from './views/outlineView/FooterPlay.vue';

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

const mouseBootom = ref(false)
const listenMouse = function(e){  
  if(Math.abs(e.clientY - window.innerHeight) < 5){
    mouseBootom.value = true
  }else {
    mouseBootom.value = false
  }
}

// loginStatus().then(res => {
//   console.log(res)
//   if(res.data.data.count){
    
//   }
// })
// loginTmp().then(res => {
//       console.log(res)
//       if(res.data.code === 200){
//         const arr = res.data.cookie.split(';')
//         arr.forEach(item => {
//           document.cookie = item
//         })
//       }
//     })


</script>

<template>
  <div id="all-container" @mousemove="listenMouse">
    <Header :subMenu="firstSubMenu" />  
  <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive"/>
    </keep-alive>    
    <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive"/>
  </router-view>
  <footer>
    前端项目 by LDF; 
    框架技术：Vue3、vue-router、vuex、axios; 
    接口来源<a href="https://binaryify.github.io/NeteaseCloudMusicApi/#/">@Binaryify</a>
  </footer>
  <FooterPlay :mouseBootom="mouseBootom"/>
  </div>
  
</template>

<style scoped>
#all-container {
  width: 100vw;
  height: 100vh;
}
footer {
  margin: 1vw;
  margin-top: 0;
  padding: 1vw;
  border-top: 1px solid #b9b9b9;
  width: 100vw;
  text-align: center;
}
</style>
