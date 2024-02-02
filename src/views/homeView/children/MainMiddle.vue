<template>
  <div class="center-main">
    <div class="main-container">
      <LittleNav :title="'热门推荐'">
        <template v-slot:breadcrumb>
          <el-breadcrumb separator="|">
            <el-breadcrumb-item v-for="item in recommandSubList" @click="gotoList(item)" :key="item">
              <!-- :to="{ path:  }" -->
              {{ item }} 
            </el-breadcrumb-item>
          </el-breadcrumb>
        </template>
        <template v-slot:right>
          <div class="more" @click="gotoList('all')">更多<el-icon><Right /></el-icon></div>
        </template>
      </LittleNav>
      <div style="margin-top: 10px;">
        <CoverList :mList="recommandCoverList" :row="2" :col="4" type="0" />
      </div>
      <LittleNav :title="'个性推荐'"></LittleNav>
      <div style="margin-top: 10px;">
        <CoverList :mList="recommandPersonalizedList" :row="1" :col="4" type="0" />
      </div>
      <LittleNav :title="'新碟上架'">
        <template v-slot:right>
          <div class="more" @click="gotoAlbums">更多<el-icon><Right /></el-icon></div>
        </template>
      </LittleNav>
      <div style="margin-top: 10px;">
        <CoverList :mList="newAlbum" :row="1" :col="5" type="1" />
      </div>
    </div>
    <div class="right-column">
      <ArtistsList :artistsList="artistsList" />
    </div>
  </div>
  
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'
import {getRecomMusicList, getRecomMusicListByCat, getNewAlbum} from '@/network/getPlayList'
import {getTopArtists, getArtistDetailById} from '@/network/getArtists'

import LittleNav from '@/common/LittleNav.vue';
import CoverList from '@/components/CoverList.vue';
import ArtistsList from './ArtistsList.vue';

const recommandSubList = ['华语', '流行', '摇滚', '民谣', '电子']
const recommandCoverList = ref([])
const recommandPersonalizedList = ref([])
const newAlbum = ref([])
const artistsList = ref([])

// 热门推荐
getRecomMusicListByCat('全部', 'hot').then(res => {
  const list = res.data.playlists
  for(let i = 0; i < 8; i++){
    recommandCoverList.value.push({
      id: list[i].id,
      name: list[i].name,
      picUrl: list[i].coverImgUrl,
      playCount: list[i].playCount
    })
  }
})

// 个性推荐
getRecomMusicList().then(res => {
  recommandPersonalizedList.value = res.data.result;
})
getNewAlbum().then(res => {
  newAlbum.value = res.data.weekData.slice(0, 5)
})
getTopArtists().then(res => {
  artistsList.value = []
  const list = res.data.artists.slice(0, 10)
  list.forEach(item => {
    getArtistDetailById(item.id).then(res => {
      const desc = res.data.data.identify.imageDesc
      artistsList.value.push({
        name: item.name,
        picUrl: item.picUrl,
        desc: desc
      })
    })
  })
})

const router = useRouter()
// 跳转歌单页面
function gotoList(item){
  router.push(`/playlist?cat=${item}`)
  // router.push({name: 'playlist', params: {cat: item}})
}
// 跳转到新碟页面
function gotoAlbums(){
  router.push(`/album`)
}

</script>

<style lang="scss" scoped>
.center-main {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 20px;
}
.main-container {
  width: 70%;
  padding: 1vw;
  border: 1px solid #c1bfbf;
}
.more:hover {
    cursor: pointer;
  }
.right-column {
  width: 30%;
  border: 1px solid #c1bfbf;
  border-left-color: transparent;
}
</style>
<style>
  .el-breadcrumb__item .el-breadcrumb__inner:hover,.el-breadcrumb__item:last-child .el-breadcrumb__inner:hover {
    cursor: pointer;
    color: rgb(71, 129, 244);
  }
</style>