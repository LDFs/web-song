<template>
  <div class="little-nav-title">
    <div class="nav-left">
      <el-icon color="#e82222"><Orange /></el-icon>
      <div class="big-title">{{ title || '歌单' }}</div>
      <slot name="breadcrumb"></slot>
    </div>
    <div class="more">更多<el-icon><Right /></el-icon></div>
  </div>
</template>

<script setup>
defineProps({
  title: String
})

</script>

<style lang="scss" scoped>
.little-nav-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px 4px;
  border-bottom: 2px solid #e82222;
  .more:hover {
    cursor: pointer;
  }
}
.nav-left {
  display: flex;
  gap: 12px;
  align-items: center;
}
.big-title {
  font-size: 1.2rem;
}
</style>