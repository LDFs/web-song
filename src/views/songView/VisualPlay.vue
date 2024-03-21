<template>
  <div
    v-if="musicInfo && Object.keys(musicInfo).length > 0"
    class="cover"
    :style="{ backgroundImage: `url(${musicInfo.al.picUrl})` }"
  ></div>
  <div class="visual-container">
    <div style="display: flex; align-items: center;">
      <span class="fix-select-text">{{ typeText }}</span>
      <el-select v-model="visualType" placeholder="Select" style="width: 10vw; height: 2rem;">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          @change="$forceUpdate()"
        />
      </el-select>
    </div>
    <div class="right-cover" >
      <canvas ref="canvasElement" class="canvas-item" width="400" height="400"></canvas>
      <button class="al-pic" :class="{pauseRotate: !isPlay}" :style="{backgroundImage: `url(${musicInfo.al.picUrl})`}" >
      </button>
      <div class="control-div" @click="changePlay">
        <IconPause v-if="!isPlay" class="control-icon" />
        <IconPlay v-else class="control-icon" />
      </div>
    </div>
    <div>
      <div style="font-size: .8rem; color: rgb(81 81 81);display:flex;flex-direction: column; gap: 10px;align-items: center;">
        <div style="font-weight: 700;font-size: 1.6rem;">{{ musicInfo.name }}</div>
        <div>专辑：{{ musicInfo.al.name }}</div>
        <div>歌手：
          <span v-for="(item, i) in musicInfo.ar" :key="item.id">{{ item.name }}<span
            v-if="i < musicInfo.ar.length-1"
          >/</span></span>
        </div>
      </div>
      <LyricScroll :containerStyle="{minWidth: '400px',width: '38vw',fontSize: '1rem' }" :id="String(musicInfo.id)" />
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import LyricScroll from "./LyricScroll.vue";
import IconPause from '@/components/icons/IconPause2.vue'
import IconPlay from '@/components/icons/IconPlay2.vue'
import { getThemeColors } from '@/utils/utils'

const store = useStore()
const audio = computed(() => store.state.audio)
const musicInfo = computed(() => store.state.curSongInfo)
const isPlay = computed(() => store.state.isPlay)

const canvasElement = ref(null)

const [ , , deepColor] = getThemeColors()
const visualType = ref('frequencyLine')
const options = [{
  value: 'frequencyLine',
  label: '折线图'
}, {
  value: 'roundRect',
  label: '柱形图'
}, {
  value: 'danceLine',
  label: '跳动的线'
}]
const typeText = computed(() => {
  const index = options.findIndex(item => {
    return item.value == visualType.value
  })
  return options[index].label
})

function roundRectangle(dataArray, canvasCtx, analyser){
  const randomData = Uint8Array.from(new Uint8Array(120), (v,k) => k);
  randomData.sort(() => Math.random() - 0.5)
  draw()
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);    // 音频的频率数据  这种方式获得的音频数据，每首歌最后1/4部分都为0
    const frontData = dataArray.slice(0, 120)
    
    const bData = []
    randomData.forEach(value => {
      bData.push(frontData[value])
    })
    const angle = Math.PI * 2 / bData.length;
    if(!canvasElement.value){
      return 
    }
    // 清除上次绘制记录
    canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height)

    // 1. 圆角矩形
    // 背景填充颜色
    canvasCtx.fillStyle = deepColor.value
    // 通过将当前状态推入堆栈来保存画布的整个状态
    canvasCtx.save()
    // 向当前矩阵添加平移变换
    canvasCtx.translate(canvasElement.value.width/2, canvasElement.value.height/2)
    
    bData.forEach((value, index) => {
      canvasCtx.save()
      // 向变换矩阵添加一个旋转
      canvasCtx.rotate(angle * index)
      // 创建新路径
      canvasCtx.beginPath()
      const h = value / 256 * 60
      // 绘制圆角矩形
      canvasCtx.roundRect(-4, 140, 4, (h<4)?4: h)
      // 填充矩形
      canvasCtx.fill()
      // 通过弹出绘图状态堆栈中的顶部条目来恢复最近保存的画布状态
      canvasCtx.restore()
    })
    canvasCtx.restore()
  }
}

function lineFreauency(dataArray, canvasCtx, analyser){
  const randomData = Uint8Array.from(new Uint8Array(120), (v,k) => k);
  randomData.sort(() => Math.random() - 0.5)
  draw()
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);    // 音频的频率数据  这种方式获得的音频数据，每首歌最后1/4部分都为0
    
    const frontData = dataArray.slice(0, 120)
    
    const bData = []
    randomData.forEach(value => {
      bData.push(frontData[value])
    })
    const angle = Math.PI * 2 / bData.length;
    if(!canvasElement.value){
      return 
    }
    // 清除上次绘制记录
    canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height)
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = deepColor.value
    canvasCtx.globalAlpha = 0.5; // 设置绘图的透明度, 并且同时会显示多条线
    // 通过将当前状态推入堆栈来保存画布的整个状态
    canvasCtx.save()
    // 向当前矩阵添加平移变换
    canvasCtx.translate(canvasElement.value.width/2, canvasElement.value.height/2)
    let x = 0;
    canvasCtx.beginPath();
    for(let i = 0; i < bData.length; i++) {
      canvasCtx.save()
      canvasCtx.rotate(angle * i)
      const y =  bData[i] / 256 * 60; 
      if(i === 0) {
        canvasCtx.moveTo(x, y +140); 
      } else {
        canvasCtx.lineTo(x, y +140); 
      }
      canvasCtx.restore()
    }
    canvasCtx.lineTo(0, bData[0] / 256 * 60 + 140);
    canvasCtx.restore()
    canvasCtx.stroke();
  }
}

function lineTimeDomain(dataArray, canvasCtx, analyser){
  draw()
  function draw() {
    requestAnimationFrame(draw);
    analyser.getByteTimeDomainData(dataArray);      // 音频的波形数据  这种方式绘制的曲线抖动很快
    
    const angle = Math.PI * 2 / 120;   // 150
    if(!canvasElement.value){
      return 
    }
    // 清除上次绘制记录
    canvasCtx.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height) 
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = deepColor.value
    canvasCtx.globalAlpha = 0.5; // 设置绘图的透明度, 并且同时会显示多条线
    // 通过将当前状态推入堆栈来保存画布的整个状态
    canvasCtx.save()
    // 向当前矩阵添加平移变换
    canvasCtx.translate(canvasElement.value.width/2, canvasElement.value.height/2)

    let x = 0;
    canvasCtx.beginPath();
    for(let i = 0; i < 120; i++) {
      canvasCtx.save()
      canvasCtx.rotate(angle * i)
      const v = dataArray[i] / 128.0;
      const y = v * canvasElement.value.width /2;
      if(i === 0) {
        canvasCtx.moveTo(x, y - 40); 
      } else {
        canvasCtx.lineTo(x, y - 40); 
      }
      canvasCtx.restore()
    }
    canvasCtx.lineTo(0, dataArray[0] / 128.0 * canvasElement.value.width / 2 -40);
    canvasCtx.restore()
    canvasCtx.stroke();
  }
}
const dataArray = ref(null)
const canvasCtx = ref(null)
const analyser = ref(null)

onMounted(() => {
  // 创建音频处理图
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  // 创建一个音频处理对象,用于获取音频时间和频率数据。
  analyser.value = audioCtx.createAnalyser();
  // 将 audio 元素与音频处理图连接起来
  const source = audioCtx.createMediaElementSource(audio.value);
  source.connect(analyser.value);
  analyser.value.connect(audioCtx.destination);
  analyser.value.fftSize = 512;   // 设置频率数据的精度

  const bufferLength = analyser.value.frequencyBinCount;
  dataArray.value = new Uint8Array(bufferLength);

  canvasCtx.value = canvasElement.value.getContext('2d');
  handleDraw(visualType.value)
})
function handleDraw(type){
  if(type === 'roundRect'){
    roundRectangle(dataArray.value, canvasCtx.value, analyser.value)
  }else if(type === 'frequencyLine'){
    lineFreauency(dataArray.value, canvasCtx.value, analyser.value)
  }else if(type === 'danceLine') {
    lineTimeDomain(dataArray.value, canvasCtx.value, analyser.value)
  }
}
watch(visualType, v => {
  handleDraw(v)  
})


function changePlay(){
  store.commit('setIsPlay', !isPlay.value)
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
.visual-container {
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
  .fix-select-text {
    display: inline-block;
    background-color: #fff;
    height: 2rem;
    padding: 0 8px;
    position: relative;
    right: -2px;
    border-radius: 2px 0 0 2px;
    line-height: 2rem;
  }
}
.right-cover {
  position: relative;
  min-width: 300px;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  .canvas-item {
    // width: 300px;
    // height: 300px;
    border-radius: 50%;
    position: absolute;
    // top: 0;
  }
  .al-pic {
    position: relative;
    width: 250px;
    height: 250px;
    background-size: cover;
    border-radius: 50%;
    border: none;
    outline: none;
    animation: music-btn-anim 20s infinite linear;
    cursor: pointer;
    
  }
  .control-div {
      opacity: 0;
      position: absolute;
      width: 250px;
      height: 250px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .control-icon {
      width: 50%;
      height: 50%;
      cursor: pointer;      
    }
    .control-div:hover {
      opacity: 1;
    }
  .pauseRotate {
    animation-play-state: paused;
  }
}

@keyframes music-btn-anim {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
.left-lyric {
  position: relative;
  width: 40vw;
  height: 90vh;
  background-color: #f8f174;
}
</style>