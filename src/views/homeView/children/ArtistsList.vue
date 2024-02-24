<template>
  <div class="artists-container">
    <div class="artist-title">
      <span>入驻歌手</span>
      <span class="see-all">查看全部<el-icon><ArrowRight /></el-icon></span>
    </div>
    <LRItem class="artist-item" v-for="item in artistsList" :key="item.name" :item="item" :jumpUrl="'/artistSongs'" />
  </div>
</template>

<script setup>
import LRItem from '@/common/LRItem.vue';
defineProps({
  artistsList: Array
})
</script>

<style lang="scss" scoped>
.artists-container {
  padding: 20px;
}
.artist-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
  border-bottom: 1px solid #c1bfbf;
  .see-all:hover {
    cursor: pointer;
  }
}
.artist-item {
  width: 100%;
  display: flex;
  margin-top: 1vh;
  img {
    width: 30%;
  }
  .art-right {
    flex-grow: 1;
    background-color: #f9f8f8;
    border: 1px solid #ededed;
    padding-left: .8rem;
    font-size: .8rem;
  }
  .item-name {
    font-weight: 600;
    margin-top: 6px;
  }
  .item-desc {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 9vw;
  }
}
.artist-item:hover {
  cursor: pointer;
}
</style>