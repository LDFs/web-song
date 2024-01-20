<template>
  <div class="lists-container">
    <div class="head-part">
      <span class="cat-title">{{ paramCat }}</span>
      <button class="choice-btn">
        选择分类<el-icon><ArrowDown /></el-icon>
      </button>
    </div>
    <CoverList :m-list="playLists" :col="5" :row="6" type="0" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onActivated } from 'vue'

import CoverList from '@/components/CoverList.vue'
import { getHighqualityList } from '@/network/getPlayList'

const route = useRoute()
const playLists = ref([])
const paramCat = ref('全部')
onActivated(() => {
  console.log('===', route.fullPath)
  const pathkv = route.fullPath.split('?')[1].split('=')
  const index = pathkv.findIndex(item => item == 'cat')
  if(pathkv.length === 0 || index === -1 || index === pathkv.length-1)
    paramCat.value = '全部'
  else paramCat.value = pathkv[index+1]
  playLists.value = []
  getHighqualityList(paramCat.value).then((res) => {
    res.data.playlists.map((item) => {
      playLists.value.push({
        name: item.name,
        picUrl: item.coverImgUrl,
        playCount: item.playCount
      })
    })
  })
})
</script>

<style lang="scss" scoped>
.lists-container {
  width: 54vw;
  min-width: 620px;
  padding: 1.2rem 2rem 0 2rem;
  border-left: 1px solid #c1bfbf;
  border-right: 1px solid #c1bfbf;
  .head-part {
    width: 100%;
    padding-bottom: 2px;
    margin-top: 0.4rem;
    margin-bottom: 0.8rem;
    border-bottom: 2px solid #c41313;
  }
  .cat-title {
    font-size: 1.4rem;
  }
  .choice-btn {
    margin-left: 10px;
    padding: 6px;
  }
}
</style>
