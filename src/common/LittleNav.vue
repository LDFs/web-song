<template>
  <div class="little-nav-title">
    <div class="nav-left">
      <div class="circle-dot"></div>
      <div class="big-title">{{ title || '歌单' }}</div>
      <slot name="breadcrumb"></slot>
    </div>
    <slot name="right"></slot>
    <!-- <div class="more">更多<el-icon><Right /></el-icon></div> -->
  </div>
</template>

<script setup>
import {computed} from 'vue'
import { useStore } from 'vuex';
const store = useStore()
const mainColor = computed(() => store.state.themeModule.mainColor)
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
  border-bottom: 2px solid v-bind(mainColor);
}
.nav-left {
  display: flex;
  gap: 12px;
  align-items: center;
}
.big-title {
  font-size: 1.2rem;
}
.circle-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 5px solid v-bind(mainColor);
}
</style>