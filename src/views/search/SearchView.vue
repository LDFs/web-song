<template>
  <div>

  </div>
</template>

<script setup>
import {ref, computed, watch} from 'vue'
import {useRoute} from 'vue-router'
import {getSearchResult} from '@/network/getSongsInfo'

import { getParamsByKey } from '@/utils/utils'

const route = useRoute()
const path = computed(() => route.fullPath)
const keywords = ref(getParamsByKey(route.fullPath, 'keywords'))
const type = ref(getParamsByKey(route.fullPath, 'type'))
watch(path, v => {
  keywords.value = getParamsByKey(v, 'keywords')
  type.value = getParamsByKey(v, 'type')
  updateData()
})

const resLists = ref([])
const resMap = {
  1: 'songs',
  10: 'albums',
  100: 'artists',
  1000: 'playlists'
}
function updateData(){
  getSearchResult(keywords.value, type.value).then(res => {
    const result = res.data.result
    resLists.value = result[resMap[type.value]]
  })
}
updateData()

</script>

<style lang="scss" scoped>

</style>