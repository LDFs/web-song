<template>
  <div class="out-container">
    <el-skeleton v-show="loading" class="out-container">
    <template #template>
      <div style="display: flex; flex-wrap: wrap;justify-content: space-between;">
        <div v-for="item in 30" :key="item" style="width: 18%;">
          <el-skeleton-item variant="image" style="width: 100%; height: 100px" />
          <el-skeleton-item variant="text" />
          <el-skeleton-item variant="text" />
        </div>
      </div>
    </template>
  </el-skeleton>
  <div v-show="!loading" class="albums-container out-container">
    <div class="title">热门新碟</div>
    <CoverList :mList="hotAlbums" :col="5" :row="2" type="1" />
    <div class="title">全部新碟</div>
    <CoverList :mList="allAlbums" :col="5" :row="5" type="1" @imgLoad="showRealImg" />
  </div>
  </div>
  
</template>

<script setup>
import {ref} from 'vue'
import {getNewAlbum, getAllAlbum} from '@/network/getPlayList'
import CoverList from '@/components/CoverList.vue';
import {getThemeColors} from '@/utils/utils'

const hotAlbums = ref([])
getNewAlbum().then(res => {
  hotAlbums.value = res.data.weekData
})

const allAlbums= ref([])
getAllAlbum().then(res => {
  allAlbums.value = res.data.albums
})

const loading = ref(true)
function showRealImg(){
  loading.value = false
}

const [mainColor] = getThemeColors()

</script>

<style lang="scss" scoped>
.albums-container {
  padding: 1.2rem 2rem 0 2rem;
  border-left: 1px solid #c1bfbf;
  border-right: 1px solid #c1bfbf;
}
.title {
  font-size: 1.6rem;
  padding-bottom: 2px;
  margin-top: 0.4rem;
  margin-bottom: 0.8rem;
  border-bottom: 2px solid v-bind(mainColor);
}
</style>