<template>
  <div
    v-show="enterThis"
    class="footer-play-container"
    @mouseleave="mouseLeave"
    @mouseenter="mouseEnter"
  >
    <div>
      <IconPre class="control-icon" />
      <IconPause class="control-icon" />
      <IconPlay class="control-icon" @click="pauseAudio" />
      <IconNext class="control-icon" />
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
          <el-progress :percentage="curPercent" :show-text="false" style="flex-grow: 1;" />
          <span v-if="songInfo.dt">
            {{ curDt }}/{{ songInfo.dt }}
          </span>
          <span v-else>00:00/00:00</span>
        </div>
      </div>
    </div>
    <div>
      <IconVolumn class="control-icon" />
      <IconCircle class="control-icon" />
      <IconMList class="control-icon" />
    </div>
    <audio autoplay ref="audioRef"></audio>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'

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

const songInfo = computed(() => store.state.curSongInfo)
const isPlay = ref(computed(() => store.state.isPlay))

const curPercent = ref(10)   // 当前播放的进度条比例
const curDt = ref(10)   // 当前播放的进度
const audioRef = ref(null)
audioRef.value.src = songInfo.value.url
watch(store.state, (v, o)=>{
  if(v.curSongInfo.id !== o.curSongInfo.id){
    audioRef.value.src = v.curSongInfo.url
  }
})
watch(isPlay, v=>{
  if(v.value){
    audioRef.value.play()
  }
})

function pauseAudio(){
  if(audioRef.value){
    audioRef.value.pause()
  }
}

</script>

<style lang="scss" scoped>
.footer-play-container {
  position: fixed;
  bottom: 0;
  background-color: #3f3e3e;
  padding: .2rem 1rem;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: .4rem;
  .control-icon {
    width: 1.4rem;
    height: 1.4rem;
  }
  .infos {
    width: 30vw;
    display: flex;
    gap: .6rem;
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
      gap: .2rem;
    }
  }
}
</style>
