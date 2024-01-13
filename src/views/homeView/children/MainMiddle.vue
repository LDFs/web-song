<template>
  <div class="center-main">
    <div class="main-container">
      <LittleNav :title="'热门推荐'">
        <template v-slot:breadcrumb>
          <el-breadcrumb separator="|">
            <!-- <el-breadcrumb-item :to="{ path: '/' }">homepage</el-breadcrumb-item>
            <el-breadcrumb-item><a href="/">promotion management</a></el-breadcrumb-item> -->
            <el-breadcrumb-item v-for="item in recommandSubList" :key="item">
              {{ item }}
            </el-breadcrumb-item>
          </el-breadcrumb>
        </template>
      </LittleNav>
      <div style="margin-top: 10px;">
        <CoverList :mList="recommandCoverList" :row="2" :col="4" />
      </div>
      <LittleNav :title="'个性推荐'"></LittleNav>
      <div style="margin-top: 10px;">
        <CoverList :mList="recommandPersonalizedList" :row="1" :col="4" />
      </div>
      <LittleNav :title="'新碟上架'"></LittleNav>
      <NewAlbumPart :list="newAlbum" />
    </div>
    <div class="right-column">
      <ArtistsList :artistsList="artistsList" />
    </div>
  </div>
  
</template>

<script setup>
import {ref} from 'vue'
import {getRecomMusicList, getHighqualityList, getNewAlbum} from '@/network/getPlayList'
import {getTopArtists, getArtistDetailById} from '@/network/getArtists'

import LittleNav from '@/common/LittleNav.vue';
import CoverList from '@/components/CoverList.vue';
import NewAlbumPart from './NewAlbumPart.vue';
import ArtistsList from './ArtistsList.vue';

const recommandSubList = ['华语', '流行', '摇滚', '民谣', '电子']
const recommandCoverList = ref([])
const recommandPersonalizedList = ref([])
const newAlbum = ref([])
const artistsList = ref([])

getRecomMusicList().then(res => {
  recommandCoverList.value = res.data.result;
})
getHighqualityList().then(res => {
  const list = res.data.playlists
  for(let i = 0; i < 4; i++){
    recommandPersonalizedList.value.push({
      name: list[i].name,
      picUrl: list[i].coverImgUrl,
      playCount: list[i].playCount
    })
  }
})
getNewAlbum().then(res => {
  newAlbum.value = res.data.weekData.slice(0, 4)
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

</script>

<style lang="scss" scoped>
.center-main {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-around;
  margin-top: 20px;
  // min-width: 500px;
}
.main-container {
  width: 70%;
  padding: 1vw;
  border: 1px solid #c1bfbf;
}
.right-column {
  width: 30%;
  border: 1px solid #c1bfbf;
  border-left-color: transparent;
}
</style>