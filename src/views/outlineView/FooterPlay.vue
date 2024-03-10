<template>
  <!-- v-show="lockFixed || true" -->
  <div
    :style="{ bottom: lockFixed || enterThis ? 0 : '-40px' }"
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
          <span v-if="songInfo.dt"> {{ currentDtText }}/{{ formatMS(songInfo.dt) }} </span>
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
      <IconCircle v-if="loopStatus == 0" class="control-icon" @click="changePlayStatus" />
      <IconRandomPlay v-if="loopStatus == 1" class="control-icon" @click="changePlayStatus" />
      <IconSinglePlay v-if="loopStatus == 2" class="control-icon" @click="changePlayStatus" />
      <IconMList class="control-icon" @click="showList" />
    </div>
    <audio ref="audioRef" crossorigin="anonymous"></audio>
    <div class="lock-fixed">
      <IconLockOff v-if="!lockFixed" class="lock-item" @click="lockFooter" />
      <IconLockOn v-if="lockFixed" class="lock-item" @click="unlockFooter" />
    </div>
    <el-drawer
      v-model="drawer"
      title="播放列表"
      :direction="direction"
      style="
        width: 50%;
        margin: 0 auto;
        margin-bottom: 40px;
        color: #f4f4f4; 
      "
      :style="{backgroundColor: lightColor}"
      modal-class="over-mask"
    >
      <div style="padding: 0.2rem 1rem">
        <div
          v-for="(item, index) in curList"
          :key="item.id"
          style="display: flex; justify-content: space-around;"
        >
          <div style="width: 40%; cursor: pointer;" @click="playSongInList(index)">{{ item.name }}</div>
          <div class="text-line1" style="width: 30%;">
            <span v-for="(ar, i) in item.ar" :key="ar.id"
              >{{ ar.name }}<span v-if="i < item.ar.length - 1">/</span></span
            >
          </div>
          <div>{{ formatMS(item.dt) }}</div>
          <div><el-icon><Top /></el-icon></div>
          <div><el-icon><Bottom /></el-icon></div>
        </div>
        <div v-if="curList.length == 0">没有播放的歌曲</div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { getSongUrl } from '@/network/getSongsInfo'
import { formatMS, getThemeColors } from '@/utils/utils'

import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPre from '@/components/icons/IconPre.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconMList from '@/components/icons/IconMList.vue'
import IconVolumn from '@/components/icons/IconVolumn.vue'
import IconCircle from '@/components/icons/IconCircle.vue'
import IconRandomPlay from '@/components/icons/IconRandomPlay.vue'
import IconSinglePlay from '@/components/icons/IconSinglePlay.vue'
import IconLockOff from '@/components/icons/IconLockOff.vue'
import IconLockOn from '@/components/icons/IconLockOn.vue'

const store = useStore()
const router = useRouter()

// 为控制底部播放控件的显示与隐藏
const props = defineProps({
  mouseBootom: Boolean
})
const move2bottom = ref(false)
const enterThis = ref(false)
const lockFixed = ref(false)
watch(props, (v) => {
  move2bottom.value = v.mouseBootom
  if (v.mouseBootom) enterThis.value = true
})

function mouseLeave() {
  enterThis.value = false
}
function mouseEnter() {
  enterThis.value = true
}
function lockFooter() {
  lockFixed.value = true
}
function unlockFooter() {
  lockFixed.value = false
}

// 当前播放的歌曲或歌单信息
const songInfo = ref(computed(() => store.state.curSongInfo))
const songUrlInfo = ref(computed(() => store.state.curSongUrlInfo))
const isPlay = ref(computed(() => store.state.isPlay))

const audioRef = ref(null)

watch(songUrlInfo, (v) => {
  audioRef.value.pause()
  audioRef.value.src = v.url
  if(isPlay.value){
    audioRef.value.play()
    setAudioTagsInfo()
  }
})

watch(isPlay, (v) => {
  if (v) {
    audioRef.value.play()
  }else {
    audioRef.value.pause()
  }
})

onMounted(() => {
  const info = localStorage.getItem('songInfo')
  const url = localStorage.getItem('songUrlInfo')
  if(info) {
    store.commit('setSongInfo', JSON.parse(info))
    store.commit('setCurIndex', localStorage.getItem('curIndex') || 0)
  }
  if(url) {
    store.commit('setSongUrlInfo', JSON.parse(url))
  }
})

// setAudioTagsInfo()
const currentDuration = ref(0) // 当前播放的进度
function setAudioTagsInfo() {
  // if (songInfo.value) {
  //   audioRef.value.src = songInfo.value.url;
  // }
  musicVolumnChange() // 设置音量
  store.commit('setAudio', audioRef.value)
  // 播放音乐时，audio的信息自动变化，把变化的信息更新到this中
  audioRef.value.addEventListener('timeupdate', () => {
    currentDuration.value = audioRef.value.currentTime
    // 当非VIP用户播放VIP歌曲时，免费部分放完就会停止或切歌
    if (audioRef.value.currentTime >= audioRef.value.duration) {
      if(curList.value.length > 1 && loopStatus.value != 2)
        playChange(2)
      else {
        audioRef.value.currentTime = 0
        // audioRef.value.duration = 0
        currentDuration.value = 0
        audioRef.value.play()
      }
    }
  })
}
const currentDtText = computed(() => {
  if (currentDuration.value == 0) return '00:00'
  let s = Math.floor(currentDuration.value % 60)
  let m = Math.floor(currentDuration.value / 60)
  let ss = s >= 10 ? s : `0${s}`
  let mm = m >= 10 ? m : `0${m}`
  return `${mm}:${ss}`
})
// 手动改变音乐播放的进度
function musicSliderHandleChange() {
  audioRef.value.currentTime = currentDuration.value
}
watch(currentDuration, (v) => {
  store.commit('setCurPlayDt', v)
})

function playAudio() {
  if (audioRef.value) {
    if (!audioRef.value.src && songUrlInfo.value?.url) {
      audioRef.value.src = songUrlInfo.value.url
    }
    store.commit('setIsPlay', true)
    audioRef.value.play()
    
    setAudioTagsInfo()
  }
}
function pauseAudio() {
  if (audioRef.value) {
    audioRef.value.pause()
    store.commit('setIsPlay', false)
  }
}

function gotoSongPage() {
  router.push(`/song?id=${songInfo.value.id}`)
}

// 切歌
const curList = ref(computed(() => store.state.curPlayList))
const curIndex = ref(computed(() => store.state.curIndex))
const loopStatus = ref(0)   // 0-循环，1-随机，2-单曲
/**
 * 切歌
 * @param {int} m 标志，1-前一首，2-后一首
 */
function playChange(m) {
  audioRef.value.pause()
  if(isPlay.value){
    store.commit('setIsPlay', false)
  }
  let nextI = -1
  if (curList.value.length > 0) {
    // 循环或单曲，前后切换都是只改变一位
    if(loopStatus.value === 0 || loopStatus.value === 2){
      if (m === 1) {
        nextI = curIndex.value === 0 ? curList.value.length - 1 : curIndex.value - 1
      } else if (m === 2) {
        nextI = (curIndex.value + 1) % curList.value.length
      }
    }else if(loopStatus.value === 1){
      nextI = Math.floor(Math.random()*curList.value.length)
    }    
  }
  if(nextI == -1) return ;
  const song = curList.value[nextI]
  getSongUrl(song.id).then((res) => {
    store.commit('setSongInfo', song)
    store.commit('setSongUrlInfo', res.data.data[0])
    store.commit('setIsPlay', true)
    store.commit('setCurIndex', nextI)

    localStorage.setItem('songInfo', JSON.stringify(song))
    localStorage.setItem('songUrlInfo', JSON.stringify(res.data.data[0]))
    localStorage.setItem('curIndex', nextI)

    audioRef.value.play()
  })
}
function playSongInList(index) {
  const song = curList.value[index]
  getSongUrl(song.id).then((res) => {
    store.commit('setSongInfo', song)
    store.commit('setSongUrlInfo', res.data.data[0])
    store.commit('setIsPlay', true)
    store.commit('setCurIndex', index)

    localStorage.setItem('songInfo', JSON.stringify(song))
    localStorage.setItem('songUrlInfo', JSON.stringify(res.data.data[0]))
    localStorage.setItem('curIndex', index)
  })
}
function changePlayStatus(){
  loopStatus.value = (loopStatus.value+1)%3
}

const direction = ref('btt')
const drawer = ref(false)
function showList() {
  drawer.value = true
}

const volumnValue = ref(30)
const showVolumn = ref(false)
function exchangeVolumnSlider() {
  showVolumn.value = !showVolumn.value
}
function musicVolumnChange() {
  audioRef.value.volume = volumnValue.value / 100
}

const [ , lightColor, deepColor] = getThemeColors()
// useAVBars(audioRef, canu, { src: songUrlInfo.value.url, canvHeight: 40, canvWidth: 200, barColor: lightColor.value })
</script>

<style>
.el-drawer__header {
  margin-bottom: 10px;
  color: rgb(240, 240, 240);
}
.el-drawer__body {
  padding: 0;
}
.el-slider__bar {
  background-color: v-bind(lightColor)
}
.el-slider__button {
  border-color: v-bind(lightColor);
}
</style>

<style lang="scss" scoped>
.footer-play-container {
  position: fixed;
  bottom: 0;
  background-color: v-bind(deepColor);
  padding: 0.2rem 1rem;
  width: 100vw;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  z-index: 10;
  box-shadow: 0px 0 7px 3px #b1b0b0;
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
      width: 30px;
      height: fit-content;
      border-radius: 4px;
      cursor: pointer;
    }
    .not-pic {
      background-color: #888;
      height: 30px;
    }
    .infos-right {
      flex-grow: 1;
      color: #eee;
      height: 40px;
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
      align-items: center;
      gap: 0.2rem;
      position: relative;
      height: 20px;
      padding-bottom: 6px 
    }
  }
}
.lock-fixed {
  position: absolute;
  bottom: 40px;
  right: 0;
  width: 3rem;
  height: 1.4rem;
  background-color: v-bind(deepColor);
  border-radius: 10px 10px 0 0;
  text-align: center;
  .lock-item {
    width: 1rem;
    height: 1rem;
    cursor: pointer;
  }
}
.canvas-container-left {
  position: fixed;
  top: 0;
  left: 0;
  // width: 100%;
  height: 100%;
  
}
.canvas-item {
  position: relative;
  top: 0;
  bottom: 0;
  width: 16vw;
  height: 100vh;
}
.canvas-container-right {
  position: fixed;
  top: 0;
  right: 0;
  // width: 100%;
  height: 100%;
  .canvas-item {
    transform: scaleX(-1);
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
