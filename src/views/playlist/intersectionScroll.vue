<template>
  <div ref="listRef" class="infinite-list-container" @scroll="scrollEvent($event)">
    <!-- <div class="infinite-list-phantom" :style="{ height: listHeight + 'px' }"></div> -->
    <div class="infinite-list" :style="{ transform: getTransform }">
      <div
        ref="items"
        class="infinite-list-item"
        v-for="(item, index) in visibleData"
        :key="index"
        :style="{ height: itemSize + 'px', lineHeight: itemSize + 'px' }"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup>
/**
 * TODO LIST： 使用 intersectionObserver 实现虚拟列表
 */
import { ref, onMounted, computed } from 'vue'

const screenHeight = ref(0) //可视区域高度
const startOffset = ref(0) //偏移量
const start = ref(0) //起始索引
const end = ref(null) //结束索引
const listRef = ref(null)


const props = defineProps({
  listData: {
    type: Array,
    default: () => []
  },
  //每项高度
  itemSize: {
    type: Number,
    default: 50
  }
})
onMounted(() => {
  screenHeight.value = window.innerHeight
  start.value = 0
  end.value = start.value + visibleCount.value
})
function scrollEvent() {
  // 当前滚动位置
  let scrollTop = listRef.value.scrollTop
  console.log(scrollTop)
  // 此时的开始索引
  start.value = Math.floor(scrollTop / props.itemSize)
  // 此时的结束索引
  end.value = start.value + visibleCount.value
  // 此时的偏移量
  startOffset.value = scrollTop - (scrollTop % props.itemSize)
}
function observeScroll( entries ) {
  entries.forEach(item => {
    if(item.isIntersecting){
      console.log(item)
    }
  })
}
const listHeight = computed(() => props.listData.length * props.itemSize)
const visibleCount = computed(() => Math.ceil(screenHeight.value / props.itemSize))
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)
const visibleData = computed(() =>
  props.listData.slice(start.value, Math.min(end.value, props.listData.length))
)
</script>
<style scoped>
.infinite-list-container {
  height: 300px;
  overflow: auto;
  position: relative;
  -webkit-overflow-scrolling: touch;
}

.infinite-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.infinite-list {
  left: 0;
  right: 0;
  top: 0;
  position: absolute;
  text-align: center;
}

.infinite-list-item {
  padding: 10px;
  color: #555;
  box-sizing: border-box;
  border-bottom: 1px solid #999;
}
</style>
