<template>
  <OutlineArchi :border="'0 1'">
    <template v-slot:left>
      <div class="top-info">
        <div class="album-cover">
          <span class="msk"></span>
          <span class="border"></span>
          <img :src="albumInfo.picUrl" alt="" />
        </div>
        <div class="albuminfo">
          <div>{{ albumInfo.name }}</div>
          <div>
            <span>歌手：</span>
            <span
              v-for="(item, index) in albumInfo.artists"
              :key="item.id"
              @click="gotoArtist(item.id)"
              class="artist-name"
              >{{ item.name }}
              <span v-if="index < albumInfo.artists.length - 1">/</span>
            </span>
          </div>
          <div><span>发行时间：</span>{{ publishTime }}</div>
          <div><span>发行公司：</span>{{ albumInfo.company }}</div>
          <button class="play-btn">
            <el-icon><VideoPlay /></el-icon>播放
          </button>
        </div>
      </div>
      <div class="album-desc">
        <span class="desc-title">专辑介绍：</span>{{ albumInfo.description }}
      </div>
      <div class="songs-list">
        <div class="list-title">歌曲列表</div>
        <el-table :data="songs" style="width: 100%" @cell-click="clickItem">
          <el-table-column type="index" :index="(index) => index + 1" />
          <el-table-column prop="name" class-name="link-text" label="歌曲标题" width="180" />
          <el-table-column label="时长" width="180">
            <template #default="scope">
              {{ formatMS(scope.row.dt) }}
            </template>
          </el-table-column>
          <el-table-column label="歌手" class-name="link-text">
            <template #default="scope">
              <span
                v-for="(item, index) in scope.row.ar"
                :key="item.id"
                @click="gotoArtist(item.id)"
                class="artist-name"
              >
                {{ item.name }}<span v-if="index < scope.row.ar.length - 1">/</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-slot:right> </template>
  </OutlineArchi>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getParamsByKey, formatDateByNumber, formatMS } from '@/utils/utils'
import { getAlbumDetail } from '@/network/getPlayList'
import OutlineArchi from '@/common/OutlineArchi.vue'

const route = useRoute()
const router = useRouter()
const path = computed(() => route.fullPath)
const id = ref(getParamsByKey(route.fullPath, 'id'))
watch(path, (v) => {
  id.value = getParamsByKey(v, 'id')
})
const albumInfo = ref({})
const songs = ref([])
const publishTime = ref('')
getAlbumDetail(id.value).then((res) => {
  albumInfo.value = res.data.album
  songs.value = res.data.songs
  publishTime.value = formatDateByNumber(albumInfo.value.publishTime)
})

function gotoArtist(id) {
  router.push('/artistSongs?id=' + id)
}
function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id
    router.push('/song?id=' + id)
  }
}
</script>
<style>
.link-text {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.album-cover {
  width: 30%;
  position: relative;
  margin-top: 2rem;
  .msk {
    display: inline-block;
    width: 72%;
    height: 84%;
    border-radius: 50%;
    background-color: #414040;
    position: absolute;
    // bottom: 10px;
    // right: 10px;
    z-index: -1;
    transform: translate(30%, 8%);
    box-shadow: -2px 4px 4px 2px #ccc;
  }
  .border {
    display: inline-block;
    width: 70%;
    height: 82%;
    border: 1px solid #919191;
    border-radius: 2px;
    position: absolute;
    bottom: 10%;
    left: 16%;
    z-index: -1;
    box-shadow: 1px 1px 7px 1px #6a6a6a69;
  }
  img {
    width: 80%;
  }
}
.top-info {
  display: flex;
  .albuminfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2rem;
  }
}
.play-btn {
  border-radius: 4px;
  background-color: #60b2fb;
  border: none;
  width: 6rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 1rem;
  color: #fff;
}
.artist-name:hover {
  cursor: pointer;
  text-decoration: underline;
}
.album-desc {
  padding-right: 2rem;
  margin-top: 2rem;
  .desc-title {
    font-size: 1rem;
    font-weight: 600;
  }
}
.songs-list {
  min-height: 60vh;
  padding-right: 2rem;
  margin-top: 2rem;
  .list-title {
    font-size: 1rem;
    font-weight: 600;
  }
}
</style>
