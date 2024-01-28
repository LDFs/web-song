// 左边封面 右边名称的列表项
<template>
  <div class="lr-item">
    <img :src="item.imgUrl" alt="" :style="{width: imgWidth}">
    <div class="lr-text">
      <div class="text-line2" v-if="item.title">{{ item.title }}</div>
      <div class="desc text-line2" v-if="item.desc">{{ item.desc }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: Object,
  imgWidth: {
    type:String,
    default: '4rem'
  },
})
</script>

<style lang="scss" scoped>
.lr-item {
  display: flex;
  padding-left: 1rem;
  padding-top: .4rem;
  padding-bottom: .4rem;
  &:hover {
    cursor: pointer;
    background-color: rgb(240, 240, 240);
  }
  &>img {
    height: fit-content;
  }
}
.lr-text {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: .6rem;
  font-size: .8rem;
  .desc {
    color: #a2a2a2;    
  }
}

</style>