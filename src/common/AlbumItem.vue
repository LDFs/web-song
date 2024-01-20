// 碟片的小项
<template>
  <div class="item-container">
    <div class="cover">
      <img :src="coverUrl" alt="" >      
    </div>
    <div class="title">{{ title }}</div>
    <div class="artist">{{ artist }}</div>
  </div>
</template>

<script setup>
defineProps({
  coverUrl: String,
  title: String,
  artist: String
})

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