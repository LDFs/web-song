// 左边封面 右边名称的列表项
<template>
  <div class="lr-item">
    <img :src="imgUrl" alt="" :style="{width: imgWidth}">
    <div class="lr-text">
      <div>{{ title }}</div>
      <div>{{ desc }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  imgUrl: String,
  title: String,
  desc: String,
  imgWidth: String,
})
</script>

<style lang="scss" scoped>
.lr-item {
  display: flex;
}
.lr-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>