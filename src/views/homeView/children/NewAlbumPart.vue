// 新碟上架的列表
<template>
  <div class="new-container">
    <div v-for="item in list" :key="item.name" class="item">
      <img :src="item.picUrl" />
      <div class="title">{{ item.name }}</div>
      <div class="artist">{{ item.artist.name }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  list: Array
})

</script>

<style lang="scss" scoped>
.new-container {
  width: 100%;
  background-color: #edecec;
  border: 1px solid #b9b9b9;
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
  padding: 18px 0;
  .item {
    width: 18%;
    // display: flex;
    // flex-direction: column;
    font-size: 0.8rem;
    img {
      width: 100%;
    }
    .artist {
      font-size: 0.7rem;
      color: #777;
    }
  }
  &>.item:hover {
    cursor: pointer;
  }
}
</style>