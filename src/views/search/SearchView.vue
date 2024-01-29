<template>
  <div class="search-container">
    <div class="search-input">
      <input type="text" placeholder="歌曲、歌手、专辑、歌单" v-model="keywords" />
      <el-icon @click="goSearch"><Search /></el-icon>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo type-menu"
      mode="horizontal"
      @select="handleSelect"
      :ellipsis="false"
    >
      <el-menu-item index="1">歌曲</el-menu-item>
      <el-menu-item index="2">专辑</el-menu-item>
      <el-menu-item index="3">歌手</el-menu-item>
      <el-menu-item index="4">歌单</el-menu-item>
    </el-menu>
    <div class="res-container" v-if="Object.keys(resLists).length > 0">
      <SongRes v-if="type === '1'" :list="resLists" />
      <CoverList v-if="type === '10'" :mList="resLists" :type="'1'" :col="5"/>
      <div v-if="type === '100'" class="artists-res-container">
        <div v-for="item in resLists" :key="item.id">
          <img :src="item.picUrl" alt="">
          <div>{{ item.name }}</div>
        </div>
      </div>
      <ListRes v-if="type === '1000'" :list="resLists" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getSearchResult } from '@/network/getSongsInfo'
import { getParamsByKey } from '@/utils/utils'
import SongRes from './children/SongRes.vue'
import ListRes from './children/ListRes.vue'
import CoverList from '@/components/CoverList.vue'

const route = useRoute()
const router = useRouter()
const path = computed(() => route.fullPath)
const keywords = ref(decodeURIComponent(getParamsByKey(route.fullPath, 'keywords')))  // 防止乱码
const type = ref(getParamsByKey(route.fullPath, 'type'))
watch(path, (v) => {
  console.log(v)
  keywords.value = decodeURIComponent(getParamsByKey(v, 'keywords'))
  type.value = getParamsByKey(v, 'type')
  updateData()
})

const resLists = ref([])
const resMap = {
  '1': 'songs',
  '10': 'albums',
  '100': 'artists',
  '1000': 'playlists'
}
function updateData() {
  getSearchResult(keywords.value, type.value).then((res) => {
    const result = res.data.result
    resLists.value = result[resMap[type.value]]
  })
}
updateData()
function handleSelect(key){
  activeIndex.value = key
  const type = Object.keys(resMap)[key-1]
  router.push(`/searchResult?keywords=${keywords.value}&type=${type}`)
}

const activeIndex = ref((Object.keys(resMap).findIndex(i => i==type.value)+1).toString())
function goSearch(){
  // 根据输入的文字和选中的目录，搜索
  const type = Object.keys(resMap)[activeIndex.value-1]
  router.push(`/searchResult?keywords=${keywords.value}&type=${type}`)
}
</script>
<style>
.el-menu--horizontal>.el-menu-item {
  height: auto;
  line-height: normal;
}
</style>
<style lang="scss" scoped>
.search-container {
  width: 54vw;
  min-width: 620px;
  border-right: 1px solid #ccc;
  border-left: 1px solid #ccc;
  .search-input {
    display: flex;
    justify-content: center;
    align-items: center;
    
    margin-top: 4vh;
    &>input, &>.el-icon {
      height: 2.4rem;
    }
    .el-icon {
      font-size: 1.4rem;
      width: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: linear-gradient(to top, #e4e4e4, #fff);
      border: 1px solid #dbdbdb;
      border-left: transparent;
    }
    input {
      width: 30vw;
      font-size: 1rem;
      padding-left: 1.4rem;
      text-align: center;
      border: 1px solid #dbdbdb;
      outline: none;
    }
  }
}
.type-menu {
  width: 80%;
  margin: 3vh auto 0;
  height: 3rem;
  background-color: #f8f8f8;
  border: 1px solid #d5d5d5;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}
.res-container {
  width: 80%;
  margin: 1rem auto;
}
.artists-res-container {
  width: 100%;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(5, 1fr);
  img {
    width: 100%;
  }
}
</style>
