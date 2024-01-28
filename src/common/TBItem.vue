// 上方封面，下方文字的歌单列表项
<template>
  <div class="item-container">
    <div class="cover" @click="gotoListDetal">
      <img @load='imgOnLoad' :src="coverUrl" alt="" >
      <div class="count-play">
        <div>{{ displayCount }}</div>
        <div class="icon"><el-icon ><VideoPlay /></el-icon></div>
      </div>
    </div>
    <div class="title text-line2">{{ title }}</div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
const props = defineProps({
  id: Number,
  coverUrl: String,
  title: String,
  playCount: Number
})
const displayCount = computed(() => {
  let n = props.playCount
  if(n > 10000){
    return Math.floor(n/10000) + '万'
  }
  return n
})
const router = useRouter()
const gotoListDetal = () => {
  router.push(`/playlistDetail?id=${props.id}`)
}

const emit = defineEmits(['imgLoad'])
function imgOnLoad(){
  emit('imgLoad')
}

</script>

<style lang="scss" scoped>
.item-container {
  margin-bottom: 10px;
}
.cover {
  position: relative;
  width: 100%;
}
.cover img {
  width: 100%;
  height: fit-content;
}
.cover:hover {
  cursor: pointer;
}
.count-play {
  position: absolute;
  bottom: 7px;
  padding-left: 6px;
  color: #e0e0e0;
  width: 100%;
  padding-top: 4px;
  background-color: #7574748a;
  border-top: 1px solid #1a1a1a;
  font-size: 0.8rem;
  .icon {
    position: absolute;
    right: 10px;
    bottom: -6px;
    font-size: 1.2rem;
  }
}
.title {
  font-size: 0.9rem;
}
</style>