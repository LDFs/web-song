<template>
  <div id="home-container" class="out-container">
    <Swiper />
    <Main />

  </div>
  
</template>
<script setup>
  import {onActivated} from 'vue'
  import Swiper from './children/HorizSwiper.vue'
  import Main from './children/MainMiddle.vue'

  onActivated(() => {
    console.log('activated home...')
  })
</script>

<style scoped>

</style>

