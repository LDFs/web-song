<template>
  <div
    v-show="enterThis"
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
      <img v-if="songInfo.album" :src="songInfo.album.picUrl" alt="" class="album-pic" />
      <div v-else class="album-pic not-pic"></div>
      <div class="infos-right">
        <div v-if="songInfo.name" class="song-artists">
          <div>{{ songInfo.name }}</div>
          <div>
            <span v-for="(item, index) in songInfo.artists" :key="item.id"
              >{{ item.name }}<span v-if="index < songInfo.artists.length - 1">/</span></span
            >
          </div>
        </div>
        <div v-else>没有播放的歌曲</div>
        <div class="progress-bar">
          <el-slider v-model="curPercent" style="flex-grow: 1" />
          <span v-if="songInfo.dt"> {{ curDt }}/{{ songInfo.dt }} </span>
          <span v-else>00:00/00:00</span>
        </div>
      </div>
    </div>
    <div style="position: relative;">
      <el-slider v-if="showVolumn" v-model="volumnValue" vertical height="10vh" style="position: absolute; bottom: 6.4vh;left:-4px;" />
      <IconVolumn class="control-icon" @click="changeVolumn" />
      <IconCircle class="control-icon" />
      <IconMList class="control-icon" @click="showList" />
    </div>
    <audio autoplay ref="audioRef"></audio>
  </div>
  <el-drawer
    v-model="drawer"
    title="播放列表"
    :direction="direction"
    style="width: 50%; margin: 0 auto; margin-bottom: 6vh; background-color: #252424c4; color: #f4f4f4;"
    modal-class="over-mask"
  >
    <div style="padding: 1rem;">
      <div v-for="item in curList" :key="item.id" style="display: flex;">
        <div style="flex-grow: 1;">{{ item.name }}</div>
        <div style="width: 30%; overflew: hidden; text-overflow: ellipsis;white-space: nowrap;">
          <span v-for="(ar, i) in item.ar" :key="ar.id"
          >{{ ar.name }}<span v-if="i < item.ar.length-1">/</span></span>
        </div>
        <div>{{ formatMS(item.dt) }}</div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'

import { getSongUrl } from '@/network/getSongsInfo'
import { formatMS } from '@/utils/utils'

import IconPause from '@/components/icons/IconPause.vue'
import IconPlay from '@/components/icons/IconPlay.vue'
import IconPre from '@/components/icons/IconPre.vue'
import IconNext from '@/components/icons/IconNext.vue'
import IconMList from '@/components/icons/IconMList.vue'
import IconVolumn from '@/components/icons/IconVolumn.vue'
import IconCircle from '@/components/icons/IconCircle.vue'

const store = useStore()

const props = defineProps({
  mouseBootom: Boolean
})
const move2bottom = ref(false)
const enterThis = ref(true)
// watch(props, v => {
//   move2bottom.value = v.mouseBootom
//   if(v.mouseBootom)
//     enterThis.value = true
// })

// function mouseLeave(){
//   enterThis.value = false
// }
// function mouseEnter(){
//   enterThis.value = true
// }

const songInfo = ref(computed(() => store.state.curSongInfo))
const isPlay = ref(computed(() => store.state.isPlay))

const curPercent = ref(10) // 当前播放的进度条比例
const curDt = ref(10) // 当前播放的进度
const audioRef = ref(null)
if (audioRef.value) {
  audioRef.value.src = songInfo.value.url
}
if (isPlay.value && audioRef.value) {
  if (!audioRef.value.src) {
    audioRef.value.src = songInfo.value.url
  }
  audioRef.value.play()
}

watch(songInfo, (v) => {
  audioRef.value.src = v.url
})

watch(isPlay, (v) => {
  if (v) {
    audioRef.value.play()
  }
})

function playAudio() {
  if (audioRef.value && audioRef.value.src) {
    audioRef.value.play()
    store.commit('setIsPlay', true)
  }
}
function pauseAudio() {
  if (audioRef.value) {
    audioRef.value.pause()
    store.commit('setIsPlay', false)
  }
}
const curList = ref(computed(() => store.state.curPlayList))
const curIndex = ref(computed(() => store.state.curIndex))
const loopStatus = ref('loop')
function playChange(m) {
  if (curList.value.length > 0 && loopStatus.value === 'loop') {
    let nextI = 0
    if(m === 1){
      nextI = curIndex.value === 0 ? curList.value.length-1 : curIndex.value - 1
    }else if(m === 2){
      nextI = (curIndex.value + 1) % curList.value.length
    }
    const song = curList.value[nextI]
    getSongUrl(song.id).then((res) => {
      store.commit('setSongInfo', {
        id: song.id,
        name: song.name,
        url: res.data.data[0].url,
        artists: song.ar,
        album: song.al,
        dt: song.dt
      })
      store.commit('setIsPlay', true)
      store.commit('setCurIndex', nextI)
    })
  }
}

const direction = ref('btt')
const drawer = ref(false)
function showList(){
  drawer.value = true
}

const volumnValue = ref(10)
const showVolumn = ref(false)
function changeVolumn(){
  showVolumn.value = !showVolumn.value
}
</script>

<style lang="scss" scoped>
.footer-play-container {
  position: fixed;
  bottom: 0;
  background-color: #3f3e3e;
  padding: 0.2rem 1rem;
  width: 100vw;
  height: 6vh;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  .control-icon {
    width: 1.4rem;
    height: 1.4rem;
    margin-left: .2rem;
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
    .progress-bar {
      display: flex;
      gap: 0.2rem;
    }
  }
}

</style>
<style>
.over-mask, .el-overlay {
  background-color: transparent;
}
.el-slider__button, .el-tooltip__trigger {
  width: 14px;
  height: 14px;
}
</style>
