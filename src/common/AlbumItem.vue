// 碟片的小项
<template>
  <div v-if="item && Object.keys(item).length>0" class="item-container">
    <div class="cover" @click="gotoAlbum">
      <span class="msk"></span>
      <span class="border"></span>
      <div style="aspect-ratio: 1; width: 80%; position: relative;">
        <div style="width: 100%; height: 100%; background-color: #ccc;"></div>
        <img @load='imgOnLoad' :src="`${item.blurPicUrl}?param=130y130`" alt="" >
      </div>
    </div>
    <div class="title text-line2">{{ item.name }}</div>
    <div class="artist text-line2">
      <span v-for="(ar, index) in item.artists" :key="ar.id">{{ ar.name }}<span v-if="index < item.artists.length-1">/</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router'

const props = defineProps({
  item: Object
})
// const allArtists = computed(() => {
  // return props.item.artists.reduce((pre, cur) => {
    // if(pre === '') return cur.name
    // return pre + '/' + cur.name
  // }, '')
// })
const loading = ref(true)
const emit = defineEmits(['imgLoad'])
function imgOnLoad(){
  emit('imgLoad')
  loading.value = false
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
  // min-height: 130px;
  .msk {
    display: inline-block;
    width: 72%;
    height: 84%;
    border-radius: 50%;
    background-color: #414040;
    position: absolute;
    // bottom: 10px;
    // right: 10px;
    z-index: -1;
    transform: translate(30%, 8%);
    box-shadow: -2px 4px 4px 2px #ccc;
  }
  .border {
    display: inline-block;
    width: 70%;
    height: 82%;
    border: 1px solid #919191;
    border-radius: 2px;
    position: absolute;
    bottom: 10%;
    left: 16%;
    z-index: -1;
    box-shadow: 1px 1px 7px 1px #6a6a6a69;
  }
  img {
    width: 100%;
    position: absolute;
    top: 0;
    // height: 0;
    // padding-bottom: 100%;
    // object-fit: contain;
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