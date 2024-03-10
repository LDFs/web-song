<template>
  <div id="header-container">
    <div v-if="activeMenu === 0" class="bottom-menu">
      <div
        v-for="(item, index) in subMenu"
        :key="item.name"
        class="sub-menu-item"
        :class="getActiveSubMeun(index)"
        @click="changeSubMenuItem(item, index)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="search-input">
      <el-icon color="#111"><Search /></el-icon>
      <input
        type="text"
        name=""
        value=""
        placeholder="音乐/歌单/歌手/专辑"
        @keyup.enter="gotoSearch"
        v-model="searchData"
      />
    </div>
    <div style="position: relative">
      <div class="link-text" @click="setThemeColor">设置主题颜色</div>
      <ThemeColor v-if="showThemeColor" @blur="hiddenTheme" tabindex="-1" />
    </div>
    <div>
      <el-button plain @click="showLoginPanel = true" v-if="!isLogin"> 登录 </el-button>
      <div
        v-else
        style="
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        "
      >
        <img
          :src="userAvater"
          alt=""
          style="width: 30px; height: 30px; border-radius: 50%"
        />
        <div>
          {{ userNickname }}
        </div>
      </div>
    </div>
  </div>
  <el-dialog v-model="showLoginPanel" title="登录" width="800">
    <el-button plain @click="qrLogin"> 使用二维码登录 </el-button>
    <div>
      <img :src="qrimg" alt="" />
    </div>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import { activeMenu, activeSubMenu } from "@/store/observable";
import ThemeColor from "./ThemeColor.vue";
import { getThemeColors } from "@/utils/utils";
import {
  getLoginQrKey,
  getLoginQr,
  qrCheck,
  loginStatus,
} from "@/network/user";

import { ElMessage } from "element-plus";

const router = useRouter();
const route = useRoute();
const store = useStore();
const [mainColor, , deepColor] = getThemeColors();

const mc = localStorage.getItem("mainColor");
if (mc) {
  store.commit("setMainColor", mc);
  let [l, d] = [localStorage.getItem("lightColor"), localStorage.getItem("deepColor")];
  store.commit("setDerivateColor", { l, d });
}

/**
 * subMenu 指'发现音乐'目录项对应的子目录，里面每一项是一个对象：{name: 'xxx', linkName: 'xxxx'}
 */
defineProps({
  subMenu: Array,
});
const getActiveSubMeun = (i) => {
  if (i === activeSubMenu.value) return { activeSubMenuStyle: true };
};
const changeSubMenuItem = (item) => {
  router.push(item.linkName);
};
const subMenus = ["/", "/toplist", "/playlist", "/artist", "/album"];
const path = computed(() => route.fullPath);
watch(path, (v) => {
  // console.log(route.fullPath, v)
  const i = subMenus.findIndex((item) => v === item);
  activeSubMenu.value = i;
});

// 搜索
const searchData = ref("");
function gotoSearch() {
  router.push(`/searchResult?keywords=${searchData.value}&type=1`);
}

const showThemeColor = ref(false);
function setThemeColor() {
  showThemeColor.value = !showThemeColor.value;
}
function hiddenTheme() {
  showThemeColor.value = false;
}

loginStatus().then((res) => {
  if (res.data.account) {
    isLogin.value = true;
  }
});

const showLoginPanel = ref(false);
const qrimg = ref("");
const userNickname = ref("anonymous");
const userAvater = ref(
  "http://p2.music.126.net/VnZiScyynLG7atLIZ2YPkw==/18686200114669622.jpg"
);
const isLogin = ref(false);
async function qrLogin() {
  const key = await getLoginQrKey().then((res) => {
    return res.data.data.unikey;
  });
  const img = await getLoginQr(key).then((res) => {
    return res.data.data.qrimg;
  });
  qrimg.value = img;
  const start = Date.now()
  const timer = setInterval(async () => {
    const res = await checkQrStatus(key);
    // console.log(res);
    let end = Date.now()
    if (res.code === 800) {
      ElMessage({
        message: "登录二维码已过期，请重新获取",
        type: "warning",
      });
      clearInterval(timer);
    } else if (res.code === 802) {
      userNickname.value = res.nickname;
      userAvater.value = res.avatarUrl;
      console.log('用户信息：', res)
    } else if (res.code === 803) {
      ElMessage({
        message: "登录成功",
        type: "success",
      });
      // document.cookie = res.cookie   // 保存cookie
      console.log('cookie信息：', res)
      const arr = res.cookie.split(';')
      arr.forEach(item => {
        document.cookie = item
      })
      isLogin.value = true;
      clearInterval(timer);
      await loginStatus();
    }else if(end - start >= 60*1000){
      ElMessage({
        message: "登录二维码已过期，请重新获取",
        type: "warning",
      });
      clearInterval(timer);
    }
  }, 3000);
}
async function checkQrStatus(key) {
  let status;
  await qrCheck(key).then((res) => {
    status = res.data;
  });
  return status;
}
</script>

<style lang="scss" scoped>
#header-container {
  width: 100vw;
  background-color: v-bind(mainColor);
  display: flex;
  justify-content: center;
  gap: 20px;
  color: #fff;
  min-height: 10px;
  align-items: center;
  font-size: 1rem;
  padding: 0.6rem 0;
}
.search-input {
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

.bottom-menu {
  min-height: 36px;
  display: flex;
  gap: 50px;
  align-items: center;
  div {
    padding: 0.1rem 1rem;
  }
}
.sub-menu-item:hover {
  cursor: pointer;
}
.activeSubMenuStyle {
  border-radius: 18px;
  background-color: v-bind(deepColor);
}
</style>
