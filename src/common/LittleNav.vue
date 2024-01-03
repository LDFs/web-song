<template>
  <div class="little-nav-title">
    <div>{{ title || '歌单' }}</div>
    <div>更多<el-icon><ArrowRight /></el-icon></div>
  </div>
</template>

<script setup>
// import defineProps from 'vue'
defineProps({
  title: String
})
</script>

<style lang="scss" scoped>

</style>