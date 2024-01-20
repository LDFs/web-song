<template>
  <div class="albums-container">
    <div class="title">热门新碟</div>
    <CoverList :mList="hotAlbums" :col="5" :row="2" type="1" />
    <div class="title">全部新碟</div>
    <CoverList :mList="allAlbums" :col="5" :row="5" type="1" />
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {getNewAlbum, getAllAlbum} from '@/network/getPlayList'
import CoverList from '@/components/CoverList.vue';

const hotAlbums = ref([])
getNewAlbum().then(res => {
  hotAlbums.value = res.data.weekData
})

const allAlbums= ref([])
getAllAlbum().then(res => {
  allAlbums.value = res.data.albums
})

</script>

<style lang="scss" scoped>
.albums-container {
  width: 54vw;
  min-width: 620px;
  padding: 1.2rem 2rem 0 2rem;
  border-left: 1px solid #c1bfbf;
  border-right: 1px solid #c1bfbf;
}
.title {
  font-size: 1.6rem;
  padding-bottom: 2px;
  margin-top: 0.4rem;
  margin-bottom: 0.8rem;
  border-bottom: 2px solid #b50a0a;
}
</style>