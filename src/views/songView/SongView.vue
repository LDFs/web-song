<template>
  <OutlineArchi :border="'0 1'" v-if="Object.keys(songDetail).length > 0">
    <template v-slot:left>
      <div>
        <div class="top-info">
          <div class="song-cover">
            <div class="under-cover"></div>
            <img :src="songDetail.al.picUrl" alt="" />
          </div>
          <div class="text-info">
            <div class="song-title">{{ songDetail.name }}</div>
            <div class="artists">
              <span class="lable">歌手：</span>
              <span class="names">
                <span v-for="(item, index) in songDetail.ar" :key="item.id">
                  {{ item.name }}<span v-if="index < songDetail.ar.length - 1">、</span>
                </span>
              </span>
            </div>
            <div class="album">
              <span class="lable">所属专辑：</span>
              <span class="names">{{ songDetail.al.name }}</span>
            </div>
            <div class="contrl-btns">
              <button class="play-btn">
                <el-icon><VideoPlay /></el-icon>
                <div>播放</div>
              </button>
            </div>
            <div class="lyrics">歌词</div>
          </div>
        </div>
        <div class="comments-container">
          <div class="title">评论</div>
          <div v-if="hotComments.length>0">
            <div class="title">精彩评论</div>
            <div v-for="item in hotComments" class="comment-item" :key="item.commentId">
              <img :src="item.user.avatarUrl" alt="">
              <div class="texts">
                <p><span class="user-name">{{ item.user.nickname }}：</span>{{ item.content }}</p>
                <div class="time-str">{{ item.timeStr }}</div>
              </div>
            </div>
          </div>
          <div v-if="comments.length>0">
            <div class="title">全部评论</div>
            <div v-for="item in comments" class="comment-item" :key="item.commentId">
              <img :src="item.user.avatarUrl" alt="">
              <div class="texts">
                <p><span>{{ item.user.nickname }}：</span>{{ item.content }}</p>
                <div>{{ item.timeStr }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <div>右</div>
    </template>
  </OutlineArchi>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { getSongDetail, getSongLyric, getComments } from '@/network/getSongsInfo'
import { getParamsByKey } from '@/utils/utils'
import OutlineArchi from '@/common/OutlineArchi.vue'

const route = useRoute()
const path = computed(() => route.fullPath)
const id = ref(getParamsByKey(route.fullPath, 'id'))
watch(path, (v) => {
  id.value = getParamsByKey(v, 'id')
})
const songDetail = ref({})
getSongDetail(id.value).then((res) => {
  songDetail.value = res.data.songs[0]
})

const lyrics = ref([])
getSongLyric(id.value).then((res) => {
  const lyric = res.data.lrc.lyric
  lyrics.value = lyric.split('\n')
})

const hotComments = ref([])
const comments = ref([])
getComments(id.value).then(res => {
  hotComments.value = res.data.hotComments
  comments.value = res.data.comments
})
</script>

<style lang="scss" scoped>
.top-info {
  display: flex;
  padding-top: 1rem;
  padding-left: 1rem;
  .song-cover {
    width: 32%;
    position: relative;
    img {
      width: 60%;
      border-radius: 50%;
      transform: translate(16%, 16%); // 这个的百分比 相对的是父组件的大小
    }
    .under-cover {
      position: absolute;
      width: 80%;
      padding-top: 80%; // 让div的高与宽相等，不设置height，设置padding-top与width大小一致
      background-color: #303030;
      border-radius: 50%;
      top: 0;
      left: 0;
      z-index: -1;
    }
  }
  .text-info {
    width: 60%;
    margin-left: 1rem;
    .song-title {
      font-size: 1.8rem;
      font-weight: 600;
    }
    .lable {
      font-size: 0.8rem;
      color: #464646;
    }
    .names {
      font-size: 0.8rem;
      color: rgb(0, 85, 188);
    }
    .contrl-btns {
      .play-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: rgb(0, 85, 188);
        color: #fff;
        border: 1px solid #eee;
        border-radius: 3px;
        padding: 4px 8px;
      }
      .el-icon {
        font-size: 1rem;
      }
      & > div {
        margin-top: 0.5rem;
      }
    }
    .lyrics {
      margin-top: 1rem;
      overflow: scroll;
      height: 20vh;
    }
  }
}
.comments-container {
  margin-top: 1rem;
  padding-left: 1rem;
  margin-bottom: 2rem;
  .title {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
    border-bottom: 1px solid #ccc;
    margin-right: 2rem;
  }
  .comment-item {
    display: flex;
    padding: 1rem 0;
    border-bottom: 1px solid #ccc;
    margin-right: 2rem;
    img {
      width: 4vw;
      height: 4vw;
    }
    .texts {
      margin-left: .6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
    }
    .time-str {
      color: #727272;
    }
  }
}
</style>
