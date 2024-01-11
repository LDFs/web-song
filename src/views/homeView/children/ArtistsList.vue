<template>
  <div class="artists-container">
    <div class="artist-title">
      <span>入驻歌手</span>
      <span>查看全部<el-icon><ArrowRight /></el-icon></span>
    </div>
    <div class="artist-item" v-for="item in artistsList">
      <img :src="item.picUrl" alt="">
      <div>
        <div>{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
}
.artist-item {

}
</style>