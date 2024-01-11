<template>
  <div class="swiper-container">
    <el-carousel trigger="click" arrow="always" :autoplay=noPlay>
      <el-carousel-item v-for="item in bannerInfo" :key="item">
        <el-image style="width: 40vw;min-width: 620px;" :src="item.imageUrl" fit="contain" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {getBannerInfo} from '@/network/getDefaultInfo.js'

const bannerInfo = ref([])
getBannerInfo().then(res => {
  const banner = res.data.banners
  bannerInfo.value = banner
})

const windowWidth = window.innerWidth
const carouselHeight = ref('30vh')
if(windowWidth <= '1560'){
  carouselHeight.value = '230px'
}
const noPlay = ref(false)

</script>

<style lang="scss" >
.swiper-container {
  display: flex;
  justify-content: center;
}
.el-carousel {
  width: 40vw;
  min-width: 620px;
  
}
.el-carousel__container {
  height: v-bind(carouselHeight);
  min-height: 230px;
}
// 在不写 scoped 的style里可以覆盖
// .swiper-container .el-carousel__arrow {
//   color: #f41fe2;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
</style>