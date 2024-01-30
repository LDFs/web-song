<template>
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

  <div v-show="!loading" class="lists-container out-container">
    <div class="head-part">
      <span class="cat-title">{{ paramCat }}</span>
      <button class="choice-btn">
        选择分类<el-icon><ArrowDown /></el-icon>
      </button>
    </div>
    <CoverList :m-list="playLists" :col="5" :row="6" type="0" @imgLoad="showRealImg" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref } from 'vue'

import { getHighqualityList } from '@/network/getPlayList'
import { getParamsByKey } from '@/utils/utils'
import CoverList from '@/components/CoverList.vue'

const route = useRoute()
const playLists = ref([])
const paramCat = ref('全部')

// console.log('===', route.fullPath)
const path = route.fullPath
const p = getParamsByKey(path, 'cat')
paramCat.value = p ? p : '全部'

playLists.value = []
getHighqualityList(paramCat.value).then((res) => {
  res.data.playlists.map((item) => {
    playLists.value.push({
      id: item.id,
      name: item.name,
      picUrl: item.coverImgUrl,
      playCount: item.playCount
    })
  })
})

const loading = ref(true)
function showRealImg(){
  loading.value = false
}
</script>

<style lang="scss" scoped>
.lists-container {
  // width: 54vw;
  // min-width: 620px;
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
