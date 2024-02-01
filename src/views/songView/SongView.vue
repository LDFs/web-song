<template>
  <div
    v-if="Object.keys(songDetail).length > 0"
    class="cover"
    :style="{ backgroundImage: `url(${songDetail.al.picUrl})` }"
  ></div>
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
                <span
                  v-for="(item, index) in songDetail.ar"
                  :key="item.id"
                  @click="gotoArtist(item.id)"
                >
                  {{ item.name }}<span v-if="index < songDetail.ar.length - 1">、</span>
                </span>
              </span>
            </div>
            <div class="album">
              <span class="lable">所属专辑：</span>
              <span class="names">{{ songDetail.al.name }}</span>
            </div>
            <div class="contrl-btns">
              <button class="play-btn" @click="playAudio">
                <el-icon><VideoPlay /></el-icon>
                <div>播放</div>
              </button>
            </div>
          </div>
        </div>
        <div class="lyric-container">
          <div class="lyrics" v-if="Object.keys(lyrics).length > 0">
            <div
              v-for="(item, i) in lyrics"
              :key="i"
              :style="{ color: lyricIndex == i ? 'red' : 'black' }"
            >
              {{ item.c }}
            </div>
          </div>
        </div>
        <div class="comments-container">
          <div class="big-title">评论</div>
          <div v-if="hotComments.length > 0" class="hot-comments">
            <div class="title">精彩评论</div>
            <div v-for="item in hotComments" class="comment-item" :key="item.commentId">
              <img :src="item.user.avatarUrl" alt="" />
              <div class="texts">
                <p>
                  <span class="user-name">{{ item.user.nickname }}：</span>{{ item.content }}
                </p>
                <div class="time-str">
                  <div>{{ item.timeStr }}</div>
                  <div class="thumbup">
                    <ThumbUp style="width: 1rem; height: 1rem" />{{ item.likedCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="comments.length > 0" class="all-comments">
            <div class="title">全部评论</div>
            <div v-for="item in comments" class="comment-item" :key="item.commentId">
              <img :src="item.user.avatarUrl" alt="" />
              <div class="texts">
                <p>
                  <span>{{ item.user.nickname }}：</span>{{ item.content }}
                </p>
                <div class="time-str">
                  <div>{{ item.timeStr }}</div>
                  <div class="thumbup">
                    <ThumbUp style="width: 1rem; height: 1rem" />{{ item.likedCount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>无评论</div>
        </div>
      </div>
    </template>
    <template v-slot:right>
      <div>
        <div class="related-title">相似歌单</div>
        <LRItem
          v-for="item in relatedList"
          :key="item.id"
          :item="item"
          @click="gotoList(item.id)"
        />
      </div>
    </template>
  </OutlineArchi>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getSongDetail, getSongLyric, getComments, getSongUrl } from '@/network/getSongsInfo'
import { getSongRelatedLists } from '@/network/getPlayList'
import { getParamsByKey } from '@/utils/utils'
import OutlineArchi from '@/common/OutlineArchi.vue'
import LRItem from '@/common/LRItem.vue'

import ThumbUp from '@/components/icons/IconThumbUp.vue'

const store = useStore()
const route = useRoute()
const router = useRouter()
const path = computed(() => route.fullPath)
const id = ref(getParamsByKey(route.fullPath, 'id'))
watch(path, (v) => {
  id.value = getParamsByKey(v, 'id')
})
const songDetail = ref({})
getSongDetail(id.value).then((res) => {
  songDetail.value = res.data.songs[0]
})
const songUrl = ref('')

getSongUrl(id.value).then((res) => {
  songUrl.value = res.data.data[0].url
})

function playAudio() {
  store.commit('setSongInfo', {
    id: id.value,
    name: songDetail.value.name,
    url: songUrl.value,
    artists: songDetail.value.ar,
    album: songDetail.value.al,
    dt: songDetail.value.dt
  })
  store.commit('setIsPlay', true)
  store.commit('pushCurList', songDetail.value)
}

const lyric = ref('')
const lyrics = ref([])
const lyricIndex = ref(0)
getSongLyric(id.value).then((res) => {
  lyric.value = res.data.lrc.lyric
  createLrcObj(lyric.value)
})

function createLrcObj(lrc) {
  let oLRC = {
    ms: []
  }
  if (lrc.length == 0) return
  let lrcs = lrc.split('\n') // 存储每一句歌词
  for (let i in lrcs) {
    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, '') // 去除前后空格
    let t = lrcs[i].substring(
      // 一句歌词的时间，不要前后的中括号，如 00:13.866
      lrcs[i].indexOf('[') + 1,
      lrcs[i].indexOf(']')
    )
    let s = t.split(':') // 把时间按冒号分开
    if (isNaN(parseInt(s[0]))) {
      // 如果第一部分不是数字
      for (let i in oLRC) {
        // ？？刚开始时，oLRC里面只有ms啊
        if (i != 'ms' && i == s[0].toLowerCase()) oLRC[i] = s[1]
      }
    } else {
      let arr = lrcs[i].match(/\[(\d+:.+?)\]/g) // 提取数字字段，可能有多个，如取出一个为"[00:01.370]"
      let start = 0
      for (let k in arr) {
        start += arr[k].length // "[00:01.370]"的长度。计算歌词开始的位置
      }
      let content = lrcs[i].substring(start) // 歌词内容
      for (let k in arr) {
        let t = arr[k].substring(1, arr[k].length - 1) // 除去 [] 的中间部分
        let s = t.split(':')
        oLRC.ms.push({
          t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
          c: content === '' ? '............' : content
        })
      }
    }
  }
  oLRC.ms.sort((a, b) => a.t - b.t)
  lyrics.value = oLRC.ms
}

const hotComments = ref([])
const comments = ref([])
getComments(id.value).then((res) => {
  hotComments.value = res.data.hotComments
  comments.value = res.data.comments
})

const relatedList = ref([])
getSongRelatedLists(id.value).then((res) => {
  relatedList.value = []
  res.data.playlists.forEach((item) => {
    relatedList.value.push({
      id: item.id,
      imgUrl: item.coverImgUrl,
      title: item.name,
      desc: `by ${item.creator.nickname}`
    })
  })
})

function gotoArtist(id) {
  router.push('/artistSongs?id=' + id)
}
function gotoList(id) {
  router.push('/playlistDetail?id=' + id)
}
</script>

<style lang="scss" scoped>
.cover {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover; // 让背景图片填充整个背景
  opacity: 0.6;
  z-index: -2;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  filter: blur(10px); // 虚化当前元素
}

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
      transform: translate(20%, 20%); // 这个的百分比 相对的是父组件的大小
    }
    .under-cover {
      position: absolute;
      width: 10vw;
      height: 10vw;
      // width: 80%;
      // padding-top: 80%; // 让div的高与宽相等，不设置height，设置padding-top与width大小一致
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
        border: none;
        border-radius: 3px;
        padding: 4px 8px;
        cursor: pointer;
      }
      .el-icon {
        font-size: 1rem;
      }
      & > div {
        margin-top: 0.5rem;
      }
    }
  }
}
.lyric-container {
  height: 50vh;
  overflow: scroll;
  margin-top: 3vw;
}
.lyric-container::-webkit-scrollbar,
.all-container::-webkit-scrollbar {
  width: 4px;
  height: 0px;
}
.lyric-container::-webkit-scrollbar-thumb,
.all-container::-webkit-scrollbar {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(173, 173, 173);
  background-color: rgb(177, 175, 175);
}
.lyrics {
  // 这个不能设置高度，否则会跑到外面去
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.comments-container {
  margin-top: 1rem;
  padding-left: 1rem;
  margin-bottom: 2rem;
  .big-title {
    margin-right: 2rem;
    font-size: 1.2rem;
    font-weight: 600;
    margin-top: 1rem;
    border-bottom: 1px solid #ccc;
  }
  .title {
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
    border-bottom: 1px solid #ccc;
    // margin-right: 2rem;
  }
  .hot-comments,
  .all-comments {
    width: 100%;
    padding-right: 2rem;
  }
  .comment-item {
    display: flex;
    padding: 1rem 0;
    border-bottom: 1px solid #ccc;
    // margin-right: 2rem;
    width: 100%;
    img {
      width: 4vw;
      height: 4vw;
    }
    .texts {
      margin-left: 0.6rem;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      width: 100%;
    }
    .time-str {
      color: #727272;
      display: flex;
      justify-content: space-between;
    }
    .thumbup {
      display: flex;
      align-items: center;
      gap: 2px;
    }
  }
}
.related-title {
  font-size: 1rem;
  margin: 1rem 0 0.2rem 1rem;
}
</style>
