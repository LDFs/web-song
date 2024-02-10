<template>
  <!-- v-show="lockFixed || true" -->
  <div
    
    :style="{bottom: (lockFixed || enterThis ? 0 : '-8vh')}"
    class="footer-play-container"
    @mouseleave="mouseLeave"
    @mouseenter="mouseEnter"
  >
    <div>
      <IconPre class="control-icon" @click="playChange(1)" />
      <IconPause v-if="!isPlay" class="control-icon" @click="playAudio" />
      <IconPlay v-else class="control-icon" @click="pauseAudio" />
      <IconNext class="control-icon" @click="playChange(2)" />
    </div>
    <div class="infos">
      <img
        v-if="songInfo.al"
        :src="songInfo.al.picUrl"
        alt=""
        class="album-pic"
        @click="gotoSongPage"
      />
      <div v-else class="album-pic not-pic"></div>
      <div class="infos-right">
        <div v-if="songInfo.name" class="song-artists">
          <div class="play-song-name">{{ songInfo.name }}</div>
          <div class="play-song-name" style="color: #9f9f9f">
            <span v-for="(item, index) in songInfo.ar" :key="item.id"
              >{{ item.name }}<span v-if="index < songInfo.ar.length - 1">/</span></span
            >
          </div>
        </div>
        <div v-else>没有播放的歌曲</div>
        <div class="progress-bar">
          <el-slider
            v-model="currentDuration"
            :max="songInfo.dt / 1000"
            style="flex-grow: 1"
            :show-tooltip="false"
            @change="musicSliderHandleChange"
          />
          <el-slider
            v-if="
              songUrlInfo.freeTrialInfo &&
              Object.keys(songUrlInfo.freeTrialInfo).length > 0
            "
            v-model="freeTrail"
            :max="songInfo.dt / 1000"
            :show-tooltip="false"
            style="position: absolute"
          />
          <span v-if="songInfo.dt">
            {{ currentDtText }}/{{ formatMS(songInfo.dt) }}
          </span>
          <span v-else>00:00/00:00</span>
        </div>
      </div>
    </div>
    <div style="position: relative">
      <el-slider
        v-if="showVolumn"
        v-model="volumnValue"
        vertical
        height="10vh"
        @change="musicVolumnChange"
        style="position: absolute; bottom: 6.4vh; left: -4px"
        :show-tooltip="false"
      />
      <IconVolumn class="control-icon" @click="exchangeVolumnSlider" />
      <IconCircle class="control-icon" />
      <IconMList class="control-icon" @click="showList" />
    </div>
    <audio autoplay ref="audioRef"></audio>
    <div class="lock-fixed">
    <IconLockOff v-if="!lockFixed" class="lock-item" @click="lockFooter" />
    <IconLockOn v-if="lockFixed" class="lock-item" @click="unlockFooter" />
  </div>
  </div>
  <el-drawer
    v-model="drawer"
    title="播放列表"
    :direction="direction"
    style="
      width: 50%;
      margin: 0 auto;
      margin-bottom: 8vh;
      background-color: #252424c4;
      color: #f4f4f4;
    "
    modal-class="over-mask"
  >
    <div style="padding: .2rem 1rem;">
      <div
        v-for="(item, index) in curList"
        :key="item.id"
        style="display: flex; cursor: pointer"
        @click="playSongInList(index)"
      >
        <div style="flex-grow: 1">{{ item.name }}</div>
        <div
          style="
            width: 30%;
            overflew: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          "
        >
          <span v-for="(ar, i) in item.ar" :key="ar.id"
            >{{ ar.name }}<span v-if="i < item.ar.length - 1">/</span></span
          >
        </div>
        <div>{{ formatMS(item.dt) }}</div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

import { getSongUrl } from "@/network/getSongsInfo";
import { formatMS } from "@/utils/utils";

import IconPause from "@/components/icons/IconPause.vue";
import IconPlay from "@/components/icons/IconPlay.vue";
import IconPre from "@/components/icons/IconPre.vue";
import IconNext from "@/components/icons/IconNext.vue";
import IconMList from "@/components/icons/IconMList.vue";
import IconVolumn from "@/components/icons/IconVolumn.vue";
import IconCircle from "@/components/icons/IconCircle.vue";
import IconLockOff from "@/components/icons/IconLockOff.vue";
import IconLockOn from "@/components/icons/IconLockOn.vue";


const store = useStore();
const router = useRouter();

// 为控制底部播放控件的显示与隐藏
const props = defineProps({
  mouseBootom: Boolean,
});
const move2bottom = ref(false);
const enterThis = ref(false);
const lockFixed = ref(false)
watch(props, v => {
  move2bottom.value = v.mouseBootom
  if(v.mouseBootom)
    enterThis.value = true
})

function mouseLeave(){
  enterThis.value = false
}
function mouseEnter(){
  enterThis.value = true
}
function lockFooter(){
  lockFixed.value = true
}
function unlockFooter(){
  lockFixed.value = false
}

// 当前播放的歌曲或歌单信息
const songInfo = ref(computed(() => store.state.curSongInfo));
const songUrlInfo = ref(computed(() => store.state.curSongUrlInfo));
const isPlay = ref(computed(() => store.state.isPlay));

const audioRef = ref(null);
if (audioRef.value) {
  audioRef.value.src = songInfo.value.url
}
if (isPlay.value && audioRef.value) {
  if (!audioRef.value.src) {
    audioRef.value.src = songInfo.value.url
  }
  audioRef.value.play()
}

watch(songUrlInfo, (v) => {
  audioRef.value.src = v.url;
  setAudioTagsInfo();
});

watch(isPlay, (v) => {
  if (v) {
    audioRef.value.play();
  }
});
// setAudioTagsInfo()
const currentDuration = ref(0); // 当前播放的进度
const freeTrail = ref([0, 0]);
function setAudioTagsInfo() {
  // if (songInfo.value) {
  //   audioRef.value.src = songInfo.value.url;
  // }
  musicVolumnChange(); // 设置音量
  // 播放音乐时，audio的信息自动变化，把变化的信息更新到this中
  audioRef.value.addEventListener("timeupdate", () => {
    currentDuration.value = audioRef.value.currentTime;
    // 当非VIP用户播放VIP歌曲时，免费部分放完就会停止或切歌
    if (
      audioRef.value.currentTime >= audioRef.value.duration &&
      curList.value.length > 1
    ) {
      playChange(2);
    }
  });
}
const currentDtText = computed(() => {
  if (currentDuration.value == 0) return "00:00";
  let s = Math.floor(currentDuration.value % 60);
  let m = Math.floor(currentDuration.value / 60);
  let ss = s >= 10 ? s : `0${s}`;
  let mm = m >= 10 ? m : `0${m}`;
  return `${mm}:${ss}`;
});
// 手动改变音乐播放的进度
function musicSliderHandleChange() {
  audioRef.value.currentTime = currentDuration.value;
}
watch(currentDuration, (v) => {
  store.commit("setCurPlayDt", v);
});

function playAudio() {
  if (audioRef.value) {
    if (!audioRef.value.src && songUrlInfo.value?.url) {
      audioRef.value.src = songUrlInfo.value.url;
    }
    audioRef.value.play();
    store.commit("setIsPlay", true);
    setAudioTagsInfo();
  }
}
function pauseAudio() {
  if (audioRef.value) {
    audioRef.value.pause();
    store.commit("setIsPlay", false);
  }
}

function gotoSongPage() {
  router.push(`/song?id=${songInfo.value.id}`);
}

// 切歌
const curList = ref(computed(() => store.state.curPlayList));
const curIndex = ref(computed(() => store.state.curIndex));
const loopStatus = ref("loop");
function playChange(m) {
  if (curList.value.length > 0 && loopStatus.value === "loop") {
    let nextI = 0;
    if (m === 1) {
      nextI = curIndex.value === 0 ? curList.value.length - 1 : curIndex.value - 1;
    } else if (m === 2) {
      nextI = (curIndex.value + 1) % curList.value.length;
    }
    const song = curList.value[nextI];
    getSongUrl(song.id).then((res) => {
      store.commit("setSongInfo", song);
      store.commit("setSongUrlInfo", res.data.data[0]);
      store.commit("setIsPlay", true);
      store.commit("setCurIndex", nextI);
    });
  }
}
function playSongInList(index) {
  const song = curList.value[index];
  getSongUrl(song.id).then((res) => {
    store.commit("setSongInfo", song);
    store.commit("setSongUrlInfo", res.data.data[0]);
    store.commit("setIsPlay", true);
    store.commit("setCurIndex", index);
  });
}

const direction = ref("btt");
const drawer = ref(false);
function showList() {
  drawer.value = true;
}

const volumnValue = ref(30);
const showVolumn = ref(false);
function exchangeVolumnSlider() {
  showVolumn.value = !showVolumn.value;
}
function musicVolumnChange() {
  audioRef.value.volume = volumnValue.value / 100;
}
</script>

<style>
.el-drawer__header {
  margin-bottom: 10px;
}
.el-drawer__body {
  padding: 0;
}

</style>

<style lang="scss" scoped>
.footer-play-container {
  position: fixed;
  bottom: 0;
  background-color: #3f3e3e;
  padding: 0.2rem 1rem;
  width: 100vw;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  z-index: 10;
  .control-icon {
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 0.2rem;
    cursor: pointer;
  }
  .infos {
    width: 30vw;
    display: flex;
    gap: 0.6rem;
    align-items: center;
    .album-pic {
      width: 2vw;
      height: fit-content;
      border-radius: 4px;
      cursor: pointer;
    }
    .not-pic {
      background-color: #888;
      height: 2vw;
    }
    .infos-right {
      flex-grow: 1;
      color: #eee;
    }
    .song-artists {
      display: flex;
      gap: 0.6rem;
    }
    .play-song-name {
      overflow: hidden;
      text-overflow: ellipsis;
      text-wrap: nowrap;
      max-width: 50%;
    }
    .progress-bar {
      display: flex;
      gap: 0.2rem;
      position: relative;
    }
  }
}
.lock-fixed {
  position: absolute;
  bottom: 8vh;
  right: 0;
  width: 3rem;
  height: 1.4rem;
  background-color: #3f3e3e;
  border-radius: 10px 10px 0 0;
  text-align: center;
  .lock-item {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
}
</style>
<style>
.over-mask,
.el-overlay {
  background-color: transparent;
}
.el-slider__button,
.el-tooltip__trigger {
  width: 14px;
  height: 14px;
}
</style>
