<template>
  <div class="theme-color-container" >
    <div class="inline-block">
      <div class="inline-block">选取主题颜色</div>
      <el-color-picker v-model="color1" />
      <div class="close-btn" @click="closeTheme">
        <el-icon><IconCha /></el-icon>
      </div>
    </div>
    <div class="slider-demo-block">
      <span class="demonstration">深浅颜色间隔</span>
      <el-slider v-model="range" :max="50" />
    </div>
    <div class="derivate-color">
      <div>
        深色<span class="color-item inline-block" :style="{ backgroundColor: deepColor }"></span>
      </div>
      <div>
        浅色<span class="color-item inline-block" :style="{ backgroundColor: lightColor }"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import IconCha from '@/components/icons/IconCha.vue'

const store = useStore()
const color1 = ref(store.state.themeModule.mainColor)
const range = ref(20)

const [l, d] = computeDerivateColor(color1.value)
const lightColor = ref(l)
const deepColor = ref(d)

watch(color1, (v) => {
  store.commit('setMainColor', v)
  localStorage.setItem('mainColor', v)
  let [l, d] = computeDerivateColor(v)
  lightColor.value = l
  deepColor.value = d
  localStorage.setItem('lightColor', l)
  localStorage.setItem('deepColor', d)
  store.commit('setDerivateColor', {l, d})
})
watch(range, () => {
  let [l, d] = computeDerivateColor(color1.value)
  lightColor.value = l
  deepColor.value = d
  localStorage.setItem('lightColor', l)
  localStorage.setItem('deepColor', d)
  store.commit('setDerivateColor', {l, d})
})

// 计算衍生的颜色，比如被选中颜色的深色与浅色系
function computeDerivateColor(color) {
  function to16FixOneBit(s) {
    s = s.toString(16)
    if (s.length == 1) {
      return `0${s}`
    } else return s
  }
  function getDeepColor(r, g, b) {
    if (r - range.value <= 0) {
      r = 0
    } else {
      r -= range.value
    }
    if (g - range.value <= 0) {
      g = 0
    } else {
      g -= range.value
    }
    if (b - range.value <= 0) {
      b = 0
    } else {
      b -= range.value
    }
    return `#${to16FixOneBit(r)}${to16FixOneBit(g)}${to16FixOneBit(b)}`
  }
  function getLightColor(r, g, b) {
    if (r + range.value > 255) {
      r = 255
    } else {
      r += range.value
    }
    if (g + range.value > 255) {
      g = 255
    } else {
      g += range.value
    }
    if (b + range.value > 255) {
      b = 255
    } else {
      b += range.value
    }
    return `#${to16FixOneBit(r)}${to16FixOneBit(g)}${to16FixOneBit(b)}`
  }
  if (!color) return color
  if (color[0] === '#') {
    let r = '',
      g = '',
      b = ''
    if (color.length === 7) {
      // 格式为 #xxxxxx
      r = color.slice(1, 3)
      g = color.slice(3, 5)
      b = color.slice(5, 7)
    } else if (color.length == 4) {
      // 格式为 #xxx
      r = color[1].repeat(2)
      g = color[2].repeat(2)
      b = color[3].repeat(2)
    }
    r = parseInt(r, 16) // 将16进制转为10进制
    g = parseInt(g, 16)
    b = parseInt(b, 16)

    const l = getLightColor(r, g, b)
    const d = getDeepColor(r, g, b)
    return [l, d]
  }
}

const emit = defineEmits(['closeTheme'])
function closeTheme() {
  emit('closeTheme', '111')
}
</script>

<style lang="scss" scoped>
.theme-color-container {
  position: absolute; 
  top: 2rem; 
  background-color: #fff;
  width: 16vw; 
  color: #000;
  font-size: .8rem;
  padding: 10px;
  box-shadow: 1px 1px 6px 2px #eee;
  z-index: 20;
}
.close-btn {
  background-color: #000;
  position: absolute;
  right: 1em;
  top: 1em;
  height: 1.2em;
  width: 1.2em;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.inline-block {
  display: inline-block;
  margin-right: 10px;
}
.color-item {
  width: 26px;
  height: 26px;
}
.slider-demo-block {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
}
.slider-demo-block .demonstration {
  line-height: 44px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 0;
}
.slider-demo-block .demonstration + .el-slider {
  width: 50%;
}
.derivate-color {
  display: flex;
  align-items: center;
  gap: 6px;
  div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
