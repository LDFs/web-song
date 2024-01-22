// 碟片的小项
<template>
  <div class="item-container">
    <div class="cover">
      <span class="msk"></span>
      <span class="border"></span>
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
  .msk {
    display: inline-block;
    width: 72%;
    height: 84%;
    border-radius: 50%;
    background-color: #282828;
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
    border-radius: 4px;
    position: absolute;
    bottom: 12px;
    right: 17px;
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