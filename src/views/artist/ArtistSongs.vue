<template>
  <div class="container out-container">
    <div class="left">
      <div class="top-cover">
        <div>
          <span class="artist-name-title">{{ artistDetail.name }}</span>
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
        <el-table :data="songs" style="width: 100%" @cell-click="clickItem">
          <el-table-column type="index" :index="(index) => index + 1" />
          <el-table-column prop="name" class-name="link-text" label="歌曲标题" width="180" />
          <el-table-column prop="dlong" label="时长" width="180" />
          <el-table-column label="歌手">
            <template #default="scope">
              <span
                v-for="(item, index) in scope.row.artists"
                :key="item.id"
                @click="gotoArtist(item.id)"
                class="artist-name"
              >
                {{ item.name }}<span v-if="index < scope.row.artists.length - 1">/</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column class-name="link-text" prop="album.name" label="专辑" />
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
          <img :src="`${item.picUrl}?param=60y60`" alt="" />
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
  if(v.startsWith('/artistSong')){
    id.value = getParamsByKey(v, 'id')
    updateData()
  }
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
        artists: item.ar, // formatArtists(item.ar),
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

function gotoArtist(id) {
  router.push('/artistSongs?id=' + id)
}
function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id
    router.push('/song?id=' + id)
  } else if (column.no === 4) {
    const id = row.album.id
    router.push(`/albumDetail?id=${id}`)
  }
}

const router = useRouter()
function changeArtist(id) {
  router.push('/artistSongs?id=' + id)
}
</script>
<style>
.link-text {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.container {
  // width: 54vw;
  // min-width: 620px;
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
.artist-name-title,
.list-title,
.related-title {
  font-size: 1.4rem;
  margin-bottom: 0.6rem;
  display: inline-block;
}
.artist-name:hover {
  text-decoration: underline;
  cursor: pointer;
}
.list-title {
  margin-top: 0.8rem;
}
.songs-list {
}
.related-artists {
  width: 12vw;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  .related-item {
    width: 3vw;
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
