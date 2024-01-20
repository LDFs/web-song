<template>
  <div>
    <CoverList :m-list="playLists" :col="5" :row="6" />
  </div>
</template>

<script setup>
import {useRoute} from 'vue-router'
import {ref, onActivated} from 'vue'

import CoverList from '@/components/CoverList.vue';
import {getHighqualityList} from '@/network/getPlayList'

const route = useRoute()
const playLists = ref([])
onActivated(() => {
  // console.log('===', route.params)
  const paramCat = route.params.cat
  if(paramCat === 'all'){
    getHighqualityList().then(res => {
      playLists.value = res.data.playlists
    })
  }
  
})



</script>

<style lang="scss" scoped>

</style>