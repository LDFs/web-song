<template>
  <div class="artist-container">
    <div class="menu">
      <div
        class="menu-item"
        :class="{ activedMenuItem: selectedText == `推荐歌手` }"
        @click="clickItem('推荐歌手')"
      >
        推荐歌手
      </div>
      <div v-for="item in cats" :key="item.name" class="menu-container">
        <div class="title">{{ item.name }}</div>
        <div
          class="menu-item"
          :class="{ activedMenuItem: selectedText == `${item.name}男歌手` }"
          @click="clickItem(`${item.name}男歌手`)"
        >
          {{ item.name }}男歌手
        </div>
        <div
          class="menu-item"
          :class="{ activedMenuItem: selectedText == `${item.name}女歌手` }"
          @click="clickItem(`${item.name}女歌手`)"
        >
          {{ item.name }}女歌手
        </div>
        <div
          class="menu-item"
          :class="{ activedMenuItem: selectedText == `${item.name}组合/乐队` }"
          @click="clickItem(`${item.name}组合/乐队`)"
        >
          {{ item.name }}组合/乐队
        </div>
      </div>
    </div>
    <div class="artists-list">
      <div class="title-2rem">{{ selectedText }}</div>
      <div class="artists-cover-part">
        <div v-for="item in artists.slice(0, 10)" :key="item.id" class="art-item" @click="gotoSongs(item.id)">
          <img :src="item.picUrl" alt="" />
          <div>{{ item.name }}</div>
        </div>
      </div>
      <div class="artists-names-part">
        <div v-for="item in artists.slice(10, )" :key="item.name" class="art-item" @click="gotoSongs(item.id)">
          {{ item.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import {useRouter} from 'vue-router'
import { getTopArtists, getArtistsByCats } from '@/network/getArtists'
const cats = [
  {
    name: '华语',
    area: 7
  },
  {
    name: '欧美',
    area: 96
  },
  {
    name: '日本',
    area: 8
  },
  {
    name: '韩国',
    area: 16
  },
  {
    name: '其他',
    area: 0
  }
]
const types = {
  男歌手: 1,
  女歌手: 2,
  '组合/乐队': 3
}

const artists = ref([])
getTopArtists().then((res) => {
  artists.value = res.data.artists
})

const selectedText = ref('推荐歌手')
function clickItem(item) {
  selectedText.value = item
}
watch(selectedText, (v) => {
  const areaT = v.slice(0, 2)
  const typeT = v.slice(2)
  let area = -1
  cats.forEach((item) => {
    if (item.name === areaT) {
      area = item.area
    }
  })
  const type = types[typeT]
  getArtistsByCats(type, area).then((res) => {
    artists.value = res.data.artists
  })
})

const router = useRouter()
// 跳转至歌手的歌曲页面
function gotoSongs(id){
  router.push('/artistSongs?id='+id)
}
</script>

<style lang="scss" scoped>
.artist-container {
  width: 54vw;
  min-width: 620px;
  display: flex;
  border-left: 1px solid #dedede;
  .menu {
    width: 24%;
    padding: 0.4rem;
    padding-top: 2rem;
    border-right: 1px solid #dedede;
    .menu-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .title {
      font-size: 1.4rem;
      border-top: 1px solid #cfcfcf;
      padding-top: 1rem;
    }
    .menu-item {
      font-size: 0.8rem;
    }
    .activedMenuItem {
      color: #b71402;
    }
    .menu-item:hover {
      cursor: pointer;
    }
    .title,
    .menu-item {
      padding-left: 1rem;
    }
  }
}
.artists-list {
  width: 74%;
  padding: 1rem;
  border-right: 1px solid #dedede;
  .title-2rem {
    font-size: 1.6rem;
    padding-bottom: 0.2rem;
    border-bottom: 2px solid #b71402;
  }
  .artists-cover-part, .artists-names-part {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
  .artists-cover-part {
    margin-top: 1rem;
  }
  .art-item {
    width: 18%;
    font-size: 0.8rem;
    margin-top: 1rem;
    img {
      width: 100%;
    }
  }
  .art-item:hover {
    cursor: pointer;
  }
  .artists-names-part {
    margin-top: 2rem;
    padding-top: 1rem;
    border-top: 1px dashed #aaa;
  }
}
</style>
