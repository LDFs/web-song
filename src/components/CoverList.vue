// 歌单封面列表 矩阵形式，根据传入的参数显示不同的行列
<template>
  <div v-if="type==='0'" class="cover-container">
    <TBItem v-for="item in list" :key="item.name" 
    :coverUrl="item.picUrl" :title="item.name" :playCount="item.playCount" />
  </div>
  <div v-if="type==='1'" class="cover-container">
    <AlbumItemVue v-for="item in list" :key="item.name" :coverUrl="item.picUrl" :title="item.name" :artist="item.artist.name"/>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import TBItem from '@/common/TBItem.vue';
import AlbumItemVue from '@/common/AlbumItem.vue';

const props = defineProps({
  mList: Array,
  type: String,  // 0-list, 1-album
  row: {
    type: Number,
    default: 2
  },
  col: {
    type: Number,
    default: 2
  }
})
const list = computed(() => {
  const n = props.row*props.col
  if(n < props.mList.length){
    return props.mList.slice(0, n)
  }else return props.mList
})
const percent1 = ref(Math.floor(100/props.col-2) + '%')
</script>

<style lang="scss" scoped>
.cover-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  // gap: 2%;
  flex-wrap: wrap;
  &>div {
    width: v-bind(percent1);
  }
}
</style>