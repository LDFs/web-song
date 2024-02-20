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
                  class="link-text"
                >
                  {{ item.name }}<span v-if="index < songDetail.ar.length - 1">、</span>
                </span>
              </span>
            </div>
            <div class="album">
              <span class="lable">所属专辑：</span>
              <span class="names link-text" @click="gotoThisAlbum">{{
                songDetail.al.name
              }}</span>
            </div>
            <div class="contrl-btns">
              <button class="play-btn" @click="playAudio">
                <el-icon><VideoPlay /></el-icon>
                <div>播放</div>
                <div
                  v-if="
                    songUrlInfo.freeTrialInfo &&
                    Object.keys(songUrlInfo.freeTrialInfo).length > 0
                  "
                >
                  VIP尊享
                </div>
              </button>
              <button class="play-btn" v-if="id === String(curPlaySongId)" @click="toVisualPage" >沉浸播放</button>
            </div>
          </div>
        </div>
        <LyricScroll />
        <div class="comments-container">
          <div class="big-title">评论</div>
          <div v-if="hotComments.length > 0" class="hot-comments">
            <div class="title">精彩评论</div>
            <div v-for="item in hotComments" class="comment-item" :key="item.commentId">
              <img :src="item.user.avatarUrl" alt="" />
              <div class="texts">
                <p>
                  <span class="user-name">{{ item.user.nickname }}：</span
                  >{{ item.content }}
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
import { ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import {
  getSongDetail,
  getComments,
  getSongUrl,
} from "@/network/getSongsInfo";
import { getSongRelatedLists } from "@/network/getPlayList";
import { getParamsByKey, getThemeColors } from "@/utils/utils";
import OutlineArchi from "@/common/OutlineArchi.vue";
import LRItem from "@/common/LRItem.vue";
import LyricScroll from "./LyricScroll.vue";

import ThumbUp from "@/components/icons/IconThumbUp.vue";

const [, lightColor] = getThemeColors()

const store = useStore();
const route = useRoute();
const router = useRouter();
const path = computed(() => route.fullPath);
const id = ref(getParamsByKey(route.fullPath, "id"));
const curPlaySongId = ref(computed(() => store.state.curSongInfo.id));
watch(path, (v) => {
  id.value = getParamsByKey(v, "id");
  updateInfo();
});
const songDetail = ref({});
const songUrlInfo = ref({});
const relatedList = ref([]);
updateInfo();

function updateInfo() {
  getSongDetail(id.value).then((res) => {
    songDetail.value = res.data.songs[0];
  });
  getSongUrl(id.value).then((res) => {
    // console.log(res.data.data[0].freeTrialInfo)
    songUrlInfo.value = res.data.data[0];
  });

  getComments(id.value).then((res) => {
    hotComments.value = res.data.hotComments;
    comments.value = res.data.comments;
  });

  getSongRelatedLists(id.value).then((res) => {
    relatedList.value = [];
    res.data.playlists.forEach((item) => {
      relatedList.value.push({
        id: item.id,
        imgUrl: item.coverImgUrl,
        title: item.name,
        desc: `by ${item.creator.nickname}`,
      });
    });
  });
}

function playAudio() {
  store.commit("setSongInfo", songDetail.value);
  store.commit("setSongUrlInfo", songUrlInfo.value);
  store.commit("setIsPlay", true);
  store.commit("pushCurList", songDetail.value);

  localStorage.setItem('songInfo', JSON.stringify(songDetail.value))
  localStorage.setItem('songUrlInfo', JSON.stringify(songUrlInfo.value))
  localStorage.setItem('curIndex', 0)
}
function toVisualPage(){
  router.push('/visualSong?id=' + songDetail.value.id)
}

const hotComments = ref([]);
const comments = ref([]);

function gotoArtist(id) {
  router.push("/artistSongs?id=" + id);
}
function gotoThisAlbum() {
  router.push(`/albumDetail?id=${songDetail.value.al.id}`);
}
function gotoList(id) {
  router.push("/playlistDetail?id=" + id);
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
  filter: blur(18px); // 虚化当前元素
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
      display: flex;
      gap: 10px;
      .play-btn {
        display: flex;
        align-items: center;
        gap: 4px;
        background-color: v-bind(lightColor);
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
