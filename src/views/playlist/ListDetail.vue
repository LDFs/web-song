<template>
  <div class="whole-page">
    <div class="detail-container">
      <div class="detail-header">
        <div class="cover-img"><img :src="detailInfo.coverImgUrl" alt="" /></div>
        <div class="info-right">
          <div class="title">{{ detailInfo.name }}</div>
          <div class="create-info">
            <!-- <img :src="detailInfo.creator.backgroundUrl" alt="" /> -->
            <!-- <span class="creator-name">{{ detailInfo.creator.nickname }}</span> -->
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
        <div>
          <span>歌曲列表</span><span>{{ detailInfo.trackCount }}首歌</span>
        </div>
      </div>
    </div>
    <div class="whole-right">右侧信息</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getListDetail } from '@/network/getPlayList'
import { formatDateByNumber } from '@/utils/utils'

const props = defineProps({
  id: String
})
const detailInfo = ref({})
const musicLists = ref([])
const creatTime = ref('')

getListDetail(props.id).then((res) => {
    detailInfo.value = res.data.playlist
    musicLists.value = res.data.playlist.tracks
    creatTime.value = formatDateByNumber(detailInfo.value.createTime)
  })
</script>

<style lang="scss" scoped>
.whole-page {
  width: 54vw;
  min-width: 620px;
  border: 1px solid #c1bfbf;
}
.detail-container {
  width: 74%;
  border-right: 1px solid #c1bfbf;
  padding: 1rem;
}
.detail-header {
  display: flex;
  .cover-img {
    img {
      width: 100%;
    }
    margin-right: 10px;
  }
  .info-right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .2rem;
    .title {
      font-size: 1.2rem;
    }
    .create-info {
      img {
        width: 1.6rem;
      }
      .creat-time{
        color:#ccc;
        margin-left: 4px;
      }
    }
    .control-btns {
      display: flex;
      button {
        background-color: #ededed;
        border-radius: 4px;
        border: 1px solid #dbdbdb;
      }
      .play {
        background-color: rgb(1, 121, 233);
      }
    }
  }
}
.whole-right {
  width: 24%;
}
</style>
