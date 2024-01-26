<template>
  <div class="container">
    <div class="left">
      <div class="top-cover">
        <div>
          <span class="artist-name">{{ artistDetail.name }}</span>
          <span class="artist-alias" v-for="item in artistDetail.alias" :key="item">{{
            item
          }}</span>
        </div>
        <div
          class="cover-img"
          :style="{ backgroundColor: '#ccc', backgroundImage: `url(${artistDetail.cover})` }"
        ></div>
      </div>
      <div class="list-title">热门作品</div>
      <div class="songs-list">
        <el-table :data="songs" style="width: 100%">
          <el-table-column type="index" :index="(index) => index + 1" />
          <el-table-column prop="name" label="歌曲标题" width="180" />
          <el-table-column prop="dlong" label="时长" width="180" />
          <el-table-column prop="artists" label="歌手" />
          <el-table-column prop="album.name" label="专辑" />
        </el-table>
      </div>
    </div>
    <div class="right">
      <div class="related-title">相似歌手</div>
      <div class="related-artists">
        <div
          v-for="item in relatedArtists"
          :key="item.id"
          class="related-item"
          @click="changeArtist(item.id)"
        >
          <img :src="item.picUrl" alt="" />
          <div class="name">{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getParamsByKey, formatMS } from '@/utils/utils'
import { getArtistTopSongs, getArtistDetailById, getRelatedArtists } from '@/network/getArtists'

const route = useRoute()
let id = ref(getParamsByKey(route.fullPath, 'id'))
const path = computed(() => route.fullPath)
watch(path, (v) => {
  id.value = getParamsByKey(v, 'id')
  updateData()
})
updateData()
const songs = ref([])
const artistDetail = ref({})
const relatedArtists = ref([])
function updateData() {
  getArtistTopSongs(id.value).then((res) => {
    songs.value = []
    const m = res.data.songs
    m.map((item) => {
      songs.value.push({
        id: item.id,
        dt: item.dt,
        dlong: formatMS(item.dt),
        name: item.name,
        artists: formatArtists(item.ar),
        album: item.al
      })
    })
  })
  getArtistDetailById(id.value).then((res) => {
    artistDetail.value = res.data.data.artist
  })
  getRelatedArtists(id.value).then((res) => {
    relatedArtists.value = res.data.artists
  })
}

function formatArtists(a) {
  let res = ''
  a.forEach((item, index) => {
    if (index > 0) {
      res += '/'
    }
    res += item.name
  })
  return res
}

const router = useRouter()
function changeArtist(id) {
  router.push('/artistSongs?id=' + id)
}
</script>

<style lang="scss" scoped>
.container {
  width: 54vw;
  min-width: 620px;
  display: flex;
  padding-left: 2rem;
  border-left: 1px solid #e0e0e0;
  border-right: 1px solid #e0e0e0;
  .left {
    width: 74%;
    padding-top: 1rem;
    padding-right: 2rem;
    border-right: 1px solid #e0e0e0;
  }
  .right {
    width: 24%;
    padding-left: 2rem;
    padding-top: 1rem;
  }
}
.top-cover {
  .artist-alias {
    font-size: 0.8rem;
    color: #555;
    margin-left: 1rem;
  }
  .cover-img {
    width: 90%;
    height: 32vh;
    background-position: center 50%;
    background-size: 100%;
  }
}
.artist-name,
.list-title,
.related-title {
  font-size: 1.4rem;
  margin-bottom: 0.6rem;
  display: inline-block;
}
.list-title {
  margin-top: 0.8rem;
}
.songs-list {
}
.related-artists {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .related-item {
    width: 30%;
    font-size: 0.8rem;
    margin-bottom: 0.4rem;
    img {
      width: 100%;
    }
    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .related-item:hover {
    cursor: pointer;
  }
}
</style>
