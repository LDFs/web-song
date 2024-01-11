<template>
  <div id="home-container">
    <Swiper />
    <Main />

  </div>
  
</template>
<script setup>
  
  import Swiper from './children/HorizSwiper.vue'
  import Main from './children/MainMiddle.vue'

  
</script>

<style scoped>
#home-container {
  width: 54vw;
}
</style>

