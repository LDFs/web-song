<template>
  <div v-show="enterThis" class="footer-play-container" 
    @mouseleave="mouseLeave" @mouseenter="mouseEnter">
    底部播放区域
  </div>
</template>

<script setup>
import {ref, watch} from 'vue'

const props = defineProps({
  mouseBootom: Boolean
})
const move2bottom = ref(false)
const enterThis = ref(false)
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

</script>

<style lang="scss" scoped>
.footer-play-container {
  position: fixed;
  bottom: 0;
  background-color: #888;
  padding: 1rem;
  width: 100vw;

}
</style>