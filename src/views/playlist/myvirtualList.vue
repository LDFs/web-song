<template>
  <div ref="scrollRef" style="height:200px; overflow:scroll;" @scroll="scrollFn">
    <div :style="{ transform: getTransform }">
      <div v-for="(item, index) in showList" :key="index" style="height: 40px; border: 1px solid #000;">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  list: Array
})

const scrollRef = ref(null)
const itemHeight = 40
const wholeHeight = 200
const startIndex = ref(0)
const startOffset = ref(0)

const containCount = Math.ceil(wholeHeight / itemHeight)
const endIndex = ref(containCount+1)
const showList = computed(() => {
  return props.list.slice(startIndex.value, endIndex.value+1)
})
// 为什么要这个平移呢???
const getTransform = computed(() => `translate3d(0,${startOffset.value}px,0)`)

onMounted(() => {
  endIndex.value = startIndex.value + containCount

})

const scrollFn = () => {
  const top = scrollRef.value.scrollTop
  startIndex.value = Math.floor(top / itemHeight)
  endIndex.value = startIndex.value + containCount
  startOffset.value = top - (top % itemHeight)
}

</script>

<style lang="scss" scoped>

</style>