<template>
  <div class="rank-container">
    <div class="rank-left">
      <div class="title">音乐榜单</div>
      <div class="items">
        <LRItem v-for="(item, index) in topLists" @click="changeIndex(index)" :key="item.name"
          :class="{activatedStyle: index === selected}"
         :item="item" :img-width="'3rem'" />
      </div>
    </div>
    <div class="rank-right">
      <div class="detail-header">
        <div class="cover-img"><img :src="listInfo.coverImgUrl" alt="" /></div>
        <div class="info-right">
          <div class="title">{{ listInfo.name }}</div>
          <div class="control-btns">
            <button class="play">
              <el-icon><VideoPlay /></el-icon>播放
            </button>
            <button>
              <el-icon><FolderAdd /></el-icon>{{ listInfo.subscribedCount }}
            </button>
            <button>
              <el-icon><Share /></el-icon>{{ listInfo.shareCount }}
            </button>
            <button>
              <el-icon><ChatLineSquare /></el-icon>{{ listInfo.commentCount }}
            </button>
          </div>
          <div>最近更新:{{ updateTime }}({{ selectedItem.desc }})</div>
        </div>
      </div>
      <div class="music-list">
        <div class="list-title">
          <span class="title">歌曲列表</span>
          <span class="tiny-font">{{ listInfo.trackCount }}首歌</span>
          <span>播放：{{ listInfo.playCount }}次</span>
        </div>
        <div>
          <el-table :data="musicLists" style="width: 100%">
            <el-table-column type="index" :index="(index) => index + 1" />
            <el-table-column prop="name" label="歌曲标题" width="180" />
            <el-table-column prop="dlong" label="时长" width="180" />
            <el-table-column prop="artists[0].name" label="歌手" />
            <el-table-column prop="album.name" label="专辑" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { getAllTopLists, getListDetail } from '@/network/getPlayList'
import LRItem from '@/common/LRItem.vue'
import { formatDateByNumber, formatMS } from '@/utils/utils'

const topLists = ref([])

const selected = ref(0)
const selectedItem = ref({})
const musicLists = ref([])
const listInfo = ref({})

const updateTime = computed(() => formatDateByNumber(selectedItem.value.updateTime, '年月日'))

function changeIndex( index) {
  selected.value = index
}

updateRankList()

async function updateRankList(){
  await getAllTopLists().then((res) => {
  const list = res.data.list
  list.forEach((item) => {
    let i = {
      id: item.id,
      title: item.name,
      desc: item.updateFrequency,
      imgUrl: item.coverImgUrl,
      updateTime: item.updateTime
    }
    topLists.value.push(i)
  })
  selectedItem.value = topLists.value[selected.value]
  })
  updateListInfo()
}

async function updateListInfo(){
  musicLists.value = []
  getListDetail(selectedItem.value.id).then((res) => {
    listInfo.value = res.data.playlist
    const m = res.data.playlist.tracks
    // 处理每首歌的时长
    m.map((item) => {
      let d = formatMS(item.dt)
      musicLists.value.push({
        id: item.id,
        dt: item.dt,
        dlong: d,
        name: item.name,
        artists: item.ar
      })
    })
  })
}

watch(selected, v => {
  selectedItem.value = topLists.value[v]
  updateListInfo()
})

</script>

<style lang="scss" scoped>
.rank-container {
  display: flex;
  width: 54vw;
  min-width: 620px;
  border-left: 1px solid #c1bfbf;
  border-right: 1px solid #c1bfbf;
  .rank-left {
    width: 24%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-right: 1rem;
    border-right: 1px solid #c1bfbf;
    padding-top: 2rem;
    .items {
      display: flex;
      flex-direction: column;
    }
  }
  .rank-right {
    width: 74%;
    padding-top: 2rem;
  }
}
.activatedStyle {
  background-color: #d3d3d3;
}

.detail-header {
  display: flex;
  .cover-img {
    width: 36%;
    margin-right: 2rem;
    img {
      width: 100%;
    }
  }
  .info-right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 76%;
    .control-btns {
      display: flex;
      gap: 0.6rem;
      button {
        background-color: #ededed;
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        padding: 0.4rem;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        .el-icon {
          margin-right: 4px;
          font-size: 1rem;
        }
      }
      .play {
        background-color: rgb(1, 121, 233);
      }
    }
  }
}
.title {
  font-size: 1.2rem;
}

.list-title {
  margin-top: 2rem;
  padding-bottom: 6px;
  border-bottom: 2px solid rgb(239, 87, 22);
  .tiny-font {
    font-size: 0.8rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
</style>
