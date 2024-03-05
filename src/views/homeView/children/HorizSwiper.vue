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

// const windowWidth = window.innerWidth
// const carouselHeight = ref('27vh')
// if(windowWidth <= '1560'){
//   carouselHeight.value = '230px'
// }
const noPlay = ref(true)

</script>

<style lang="scss" >
.swiper-container {
  display: flex;
  justify-content: center;
}
.el-carousel {
  width: 54vw;
  min-width: 740px;
  
}
.el-carousel__container {
  width: 74%;
  margin: 0 auto;
}
@media screen and (max-width: 1560px)  {
  .el-carousel__container {
    max-height: 230px;
  }
}
@media screen and (min-width: 1560px)  {
  .el-carousel__container {
    height: 14.8vw;
  }
}
.el-carousel__arrow {
  width: 10%;
  height: 100%;
  border-radius: 0;
  background-color: #ccc;
  font-size: 3rem;
}
.el-carousel__arrow--left {
  left: -10%;
}
.el-carousel__arrow--right {
  right: -10%;
}
// 在不写 scoped 的style里可以覆盖
// .swiper-container .el-carousel__arrow {
//   color: #f41fe2;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }
</style>