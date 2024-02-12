<template>
  <div v-show="loading" class="out-container">
    <el-skeleton>
      <template #template>
        <div style="display: flex; flex-wrap: wrap; justify-content: space-between">
          <div v-for="item in 30" :key="item" style="width: 18%">
            <el-skeleton-item variant="image" style="width: 100%; height: 100px" />
            <el-skeleton-item variant="text" />
            <el-skeleton-item variant="text" />
          </div>
        </div>
      </template>
    </el-skeleton>
  </div>

  <div v-show="!loading" class="lists-container out-container">
    <div class="head-part">
      <span class="cat-title">{{ paramCat }}</span>
      <el-popover placement="bottom-start" :width="'36vw'" trigger="click">
        <template #reference>
          <el-button class="m-2 choice-btn"
            >选择分类<el-icon style="margin-left: 2px"><ArrowDown /></el-icon
          ></el-button>
        </template>
        <template #default>
          <div class="little-title"><button class="choice-btn" @click="getAllList()">全部风格</button></div>
          <div>
            <div v-for="(item, index) in categories" :key="item" class="each-cat">
              <div class="categories-title">{{ item }}</div>
              <div class="item-container">
                <span v-for="it in categoryList[index]" :key="it.name" class="each-cat-item" @click="changeCat(it.name)"
                >{{ it.name }}<el-divider direction="vertical" /></span>
              </div>
            </div>
          </div>
        </template>
      </el-popover>
    </div>
    <CoverList :m-list="playLists" :col="5" :row="6" type="0" @imgLoad="showRealImg" />
    <div v-if="playLists.length == 0">未搜索到歌单</div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, watch, computed } from 'vue'

import { getHighqualityList, getAllCats } from '@/network/getPlayList'
import { getParamsByKey } from '@/utils/utils'
import CoverList from '@/components/CoverList.vue'

const route = useRoute()
const router = useRouter()
const playLists = ref([])
const paramCat = ref('全部')

// console.log('===', route.fullPath)
const path = computed(() => route.fullPath)

playLists.value = []

function updateDataList(){
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
}
watch(path, v => {
  const p = getParamsByKey(v, 'cat')
  paramCat.value = p ? decodeURIComponent(p) : '全部'
  updateDataList()
}, {
  immediate: true
})

const categoryList = ref([])
const categories = ref({})
getAllCats().then(res => {
  categories.value = res.data.categories
  const sub = res.data.sub
  const keys = Object.keys(categories.value)
  categoryList.value = new Array(keys.length)
  for(let i = 0; i < categoryList.value.length; i++){
    categoryList.value[i] = new Array()
  }
  sub.forEach(item => {
    const i = keys.findIndex(it => Number(it) === item.category)
    if(i >= 0){
      categoryList.value[i].push(item)
    }
  })
})
function changeCat(cat){
  router.push(`/playlist?cat=${cat}`)
}
function getAllList(){
  router.push(`/playlist?cat=全部`)
}

const loading = ref(true)
function showRealImg() {
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
  
}
.choice-btn {
    margin-left: 10px;
    padding: 6px;
    border: 1px solid #d3d1d1;
    border-radius: 4px;
    background-image: linear-gradient(to top, #f0f0f0, #fff);
    cursor: pointer;
    width: fit-content;
  }
.little-title{
  padding: .2rem 1rem; 
  border-bottom: 1px solid #ccc;
}
.each-cat {
  display: flex;
  .categories-title {
    width: 4vw;
    padding-left: .4rem;
    padding-top: .8rem;
    border-right: 1px solid #ccc;
    flex-shrink: 0;
  }
  .item-container {
    display: flex;
    flex-wrap: wrap;
    padding-top: .8rem;
  }
  .each-cat-item {
    padding-right: .4rem; 
    padding-left: .4rem;
    display: inline-block;
    font-size: .8rem;
    padding-bottom: 5px;
    cursor: pointer;
  }
}
</style>
