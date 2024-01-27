// 碟片的小项
<template>
  <div v-if="item && Object.keys(item).length>0" class="item-container">
    <div class="cover" @click="gotoAlbum">
      <span class="msk"></span>
      <span class="border"></span>
      <img @load='imgOnLoad' :src="item.picUrl" alt="" >
    </div>
    <div class="title">{{ item.name }}</div>
    <div class="artist">
      <span v-for="ar in item.artists" :key="ar.id">{{ ar.name }}</span>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from 'vue-router'

const props = defineProps({
  item: Object
})

const emit = defineEmits(['imgLoad'])
function imgOnLoad(){
  emit('imgLoad')
}
const router = useRouter()
function gotoAlbum(){
  router.push(`/albumDetail?id=${props.item.id}`)
}
</script>

<style lang="scss" scoped>
.item-container {
  margin-bottom: 10px;
}
.cover {
  position: relative;
  width: 100%;
  .msk {
    display: inline-block;
    width: 72%;
    height: 84%;
    border-radius: 50%;
    background-color: #414040;
    position: absolute;
    bottom: 10px;
    right: 10px;
    z-index: -1;
  }
  .border {
    display: inline-block;
    width: 70%;
    height: 82%;
    border: 1px solid #ccc;
    border-radius: 2px;
    position: absolute;
    bottom: 12px;
    left: 16%;
    z-index: -1;
  }
  img {
    width: 80%;
  }
}
.cover:hover {
  cursor: pointer;
}
.title {
  font-size: 0.9rem;
}
.artist {
  font-size: .9rem;
  color: #ababab;
}
</style>