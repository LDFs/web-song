<template>
  <div id="header-container">
    <div class="top-line">
      <div>
        logo
      </div>
      <div class="bigMenu">
        <div v-for="(item, index) in menu" :key="item.name" class="menu-item" 
          :class="getActiveMenu(index, activeMenu)" @click="clickMenuItem(index)">
          {{ item.name }}
          <div :class="getActiveTriangle(index, activeMenu)"></div>
        </div>
      </div>
      <div class="search-input">
        <el-icon color="#111"><Search /></el-icon>
        <input type="text" name="" value="" placeholder="音乐/视频/电台">
      </div>
      <div class='user'>
        <div class='user-icon'></div>
      </div>
    </div>
    <div class="bottom-line">
      <div v-if="activeMenu === 0" class="bottom-menu">
        <div v-for="(item, index) in subMenu" :key="item.name" class="sub-menu-item"
          :class="getActiveSubMeun(index, activeSubMeun)" @click="changeSubMenuItem(index)">
          {{ item.name }}
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref } from 'vue'
// import {useRouter} from 'vue-router'
// const router = useRouter()

/**
 * 顶部的目录列表menu，由父组件传入，里面每一项是一个对象：{name: 'xxx', linkName: 'xxxx'}
 * subMenu 指'发现音乐'目录项对应的子目录，里面每一项是一个对象：{name: 'xxx', linkName: 'xxxx'}
 */
defineProps({
  menu: Array,
  subMenu: Array
})
const activeMenu = ref(0)
const getActiveMenu = (i, j) => {
  if (i === j){
    return {activeMenuStyle: true}
  }
}
const getActiveTriangle = (i, j) => {
  if(i === j) return {itemTriangle: true}
  else return {itemTriangleNone: true}
}
const clickMenuItem = index => {
  activeMenu.value = index
}

const activeSubMeun = ref(0)
const getActiveSubMeun = (i, j) => {
  if(i === j) return {activeSubMeunStyle: true}
}
const changeSubMenuItem = index =>{
  activeSubMeun.value = index
}

</script>

<style lang="scss" scoped>
#header-container {
  width: 100vw;
}
.bigMenu {
  display: flex;
  .menu-item {
    display: inline-block;
    padding: 26px 20px;
    position: relative;
  }
}
.top-line {
  width: 100%;
  background-color: #171616;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}
.menu-item:hover {
  cursor: pointer;
}
.activeMenuStyle {
  background-color: #000;
}
.itemTriangle {
  content: "";
  width: 0;
  height: 0;
  border-width: 5px;
  border-color: rgb(242, 37, 37) transparent transparent rgb(242, 37, 37);
  border-style: solid;
  transform: rotateZ(45deg);
  position: absolute;
  bottom: -5px;
  left: 50%;
}
.itemTriangleNone {
  display: none;
}
.search-input{
  border-radius: 20px;
  background-color: #fff;
  width: 190px;
  height: 30px;
  display: flex;
  align-items: center;
  padding-left: 6px;
  gap: 6px;
  input {
    border: none;
    width: 80%;
    outline: none;
    margin: 0 6px;
  }
}
.user {
  .user-icon {
    width: 40px;
    height: 40px;
    border-radius: 26px;
    background-color: #ccc;
  }
}

.bottom-line {
  background-color: rgb(242, 37, 37);
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #fff;
  min-height: 10px;
}
.bottom-menu {
  min-height: 36px;
  display: flex;
  gap: 50px;
  align-items: center;
  div {
    padding: 0 12px;
  }
}
.sub-menu-item:hover {
  cursor: pointer;
}
.activeSubMeunStyle {
  border-radius: 18px;
  background-color: #900707;
}
</style>