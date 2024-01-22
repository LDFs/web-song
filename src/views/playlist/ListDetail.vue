<template>
  <div class="whole-page">
    <div class="detail-container">
      <div class="detail-header">
        <div class="cover-img"><img :src="detailInfo.coverImgUrl" alt="" /></div>
        <div class="info-right">
          <div class="title">{{ detailInfo.name }}</div>
          <div class="create-info">
            <img :src="creator.backgroundUrl" alt="" />
            <span class="creator-name">{{ creator.nickname }}</span>
            <span class="creat-time">{{ creatTime }} 创建</span>
          </div>
          <div class="control-btns">
            <button class="play">
              <el-icon><VideoPlay /></el-icon>播放
            </button>
            <button>
              <el-icon><FolderAdd /></el-icon>{{ detailInfo.subscribedCount }}
            </button>
            <button>
              <el-icon><Share /></el-icon>{{ detailInfo.shareCount }}
            </button>
            <button>
              <el-icon><ChatLineSquare /></el-icon>{{ detailInfo.commentCount }}
            </button>
          </div>
          <div class="tags">
            标签：
            <span v-for="item in detailInfo.tags" :key="item">{{ item }}</span>
          </div>
          <div class="describe">介绍：{{ detailInfo.description }}</div>
        </div>
      </div>
      <div class="music-list">
        <div class="list-title">
          <span class="title">歌曲列表</span>
          <span class="tiny-font">{{ detailInfo.trackCount }}首歌</span>
          <span>播放：{{ detailInfo.playCount }}次</span>
        </div>
        <div>
          <el-table :data="musicLists" style="width: 100%">
            <el-table-column type="index" :index="index => index+1" />
            <el-table-column prop="name" label="歌曲标题" width="180" />
            <el-table-column prop="dlong" label="时长" width="180" />
            <el-table-column prop="artists[0].name" label="歌手" />
            <el-table-column prop="album.name" label="专辑" />
          </el-table>
        </div>
      </div>
    </div>
    <div class="whole-right">
      <div class="right-title">喜欢这个歌单的人</div>
      <div class="avaters">
        <img v-for="item in subscribes" :src="item.avatarUrl" :key="item.userId" alt="">
      </div>
      <div class="right-title top-bot-mar">相关推荐</div>
      <div v-for="item in relatedList" :key="item.id" class="item">
        <img :src="item.coverImgUrl" alt="">
        <div class="item-right">
          <div>{{ item.name }}</div>
          <div class="nickname">by {{ item.creator.nickname }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getListDetail, getRelatedList } from '@/network/getPlayList'
import { getParamsByKey, formatDateByNumber, formatMS } from '@/utils/utils'

const route = useRoute()
const path = route.fullPath
const id = getParamsByKey(path, 'id')

const page = ref(0)
const count = ref(20)

const detailInfo = ref({})
const musicLists = ref([])
const creatTime = ref('')
const creator = ref({})
const subscribes = ref([])
getListDetail(id).then((res) => {
  console.log(res.data.playlist)
  detailInfo.value = res.data.playlist
  creatTime.value = formatDateByNumber(detailInfo.value.createTime)
  creator.value = res.data.playlist.creator
  subscribes.value = res.data.playlist.subscribers.slice(0, 8)

  const m = res.data.playlist.tracks.slice(page.value * count.value, (page.value+1)*count.value)
  // 处理每首歌的时长
  m.map((item) => {
    let d = formatMS(item.dt)
    musicLists.value.push({
      id: item.id,
      dt: item.dt,
      dlong: d,
      name: item.name,
      artists: item.ar,
      album: item.al
    })
  })
})

const relatedList = ref([])
getRelatedList(id).then(res => {
  relatedList.value = res.data.playlists
})
</script>

<style lang="scss" scoped>
.whole-page {
  width: 54vw;
  min-width: 620px;
  border: 1px solid #c1bfbf;
  display: flex;
}
.detail-container {
  width: 74%;
  border-right: 1px solid #c1bfbf;
  padding: 1rem;
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
    gap: 0.4rem;
    width: 76%;
    .create-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      img {
        width: 2.6rem;
      }
      .creat-time {
        color: #b0b0b0;
        margin-left: 4px;
      }
    }
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
.tags span {
  border: 1px solid #e5e5e5;
  background-color: #f0f0f0;
  border-radius: 20px;
  margin-right: 1rem;
  padding: 0.1rem 0.4rem;
}
.describe {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.list-title {
  margin-top: 2rem;
  padding-bottom: 6px;
  border-bottom: 2px solid rgb(239, 87, 22);
  .tiny-font {
    font-size: .8rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}

.whole-right {
  width: 26%;
  padding: 1rem;
  .right-title {
    font-weight: 700;
    padding-bottom: .4rem;
    border-bottom: 1px solid #7b7b7b;
  }
  .avaters {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    img {
      width: 22%;
      margin-top: 1rem;
    }
  }
  .item {
    display: flex;
    margin-bottom: 1rem;
    img {
      width: 4vw;
    }
    .item-right {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
    }
    .nickname {
      color: #505050;
    }
  }
}
.top-bot-mar {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
