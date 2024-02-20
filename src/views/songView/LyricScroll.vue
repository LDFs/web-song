<template>
  <div class="lyric-container" ref="lyricRef" :style="containerStyle">
    <div class="lyrics" v-if="Object.keys(lyrics).length > 0">
      <div
        v-for="(item, i) in lyrics"
        :key="i"
        style="width: 100%; text-align: center;"
        :class="{activeLyric: lyricIndex == i}"
      >
        {{ item.c }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import {
  getSongLyric,
} from "@/network/getSongsInfo";
import { getParamsByKey, getThemeColors } from "@/utils/utils";

const store = useStore();
const route = useRoute();

defineProps(
  {
    containerStyle: Object,

  }
)

const lyric = ref("");
const lyrics = ref([]);
const lyricIndex = ref(0);
const oneLyricHeight = ref(24);
const id = ref(getParamsByKey(route.fullPath, "id"));
const path = computed(() => route.fullPath);
const curPlaySongId = ref(computed(() => store.state.curSongInfo.id));
watch(path, (v) => {
  id.value = getParamsByKey(v, "id");
  updateInfo();
});
let curDuration = ref(
  computed(() => {
    if (id.value == String(curPlaySongId.value)) {
      return store.state.curPlayDt;
    } else return 0;
  })
);
watch(curPlaySongId, (v) => {
  if (v == id.value) curDuration = computed(() => store.state.curPlayDt);
});
const lyricRef = ref(null);
updateInfo()
function updateInfo(){
  getSongLyric(id.value).then((res) => {
    lyric.value = res.data.lrc.lyric;
    createLrcObj(lyric.value);
  });
}

function createLrcObj(lrc) {
  let oLRC = {
    ms: [],
  };
  if (lrc.length == 0) return;
  let lrcs = lrc.split("\n"); // 存储每一句歌词
  for (let i in lrcs) {
    lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); // 去除前后空格
    let t = lrcs[i].substring(
      // 一句歌词的时间，不要前后的中括号，如 00:13.866
      lrcs[i].indexOf("[") + 1,
      lrcs[i].indexOf("]")
    );
    let s = t.split(":"); // 把时间按冒号分开
    if (isNaN(parseInt(s[0]))) {
      // 如果第一部分不是数字
      for (let i in oLRC) {
        // ？？刚开始时，oLRC里面只有ms啊
        if (i != "ms" && i == s[0].toLowerCase()) oLRC[i] = s[1];
      }
    } else {
      let arr = lrcs[i].match(/\[(\d+:.+?)\]/g); // 提取数字字段，可能有多个，如取出一个为"[00:01.370]"
      let start = 0;
      for (let k in arr) {
        start += arr[k].length; // "[00:01.370]"的长度。计算歌词开始的位置
      }
      let content = lrcs[i].substring(start); // 歌词内容
      for (let k in arr) {
        let t = arr[k].substring(1, arr[k].length - 1); // 除去 [] 的中间部分
        let s = t.split(":");
        oLRC.ms.push({
          t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
          c: content === "" ? "............" : content,
        });
      }
    }
  }
  oLRC.ms.sort((a, b) => a.t - b.t);
  lyrics.value = oLRC.ms;
}

watch(lyricRef, (v) => {
  if (v) {
    if (v.children && v.children.length > 0 && v.children[0].children.length > 0) {
      oneLyricHeight.value = v.children[0].children[0].offsetHeight;
    }
  }
});
watch(
  curDuration,
  (newD) => {
    // this.duration = newD
    for (let i = 0; i < lyrics.value.length; i++) {
      if (newD <= parseFloat(lyrics.value[i].t)) {
        if (lyricIndex.value === i - 1) break;
        // 找到比当前时间点 大一点的后一位的歌词的索引值
        lyricIndex.value = i - 1;
        //当前距离上方的距离  控制歌词上下滚动
        let currentTemp = lyricRef.value.style.marginTop;
        currentTemp = currentTemp.substr(0, currentTemp.length - 2);
        currentTemp = parseInt(currentTemp); // 滚动距离
        if (i > 6) {
          //第五句歌词之后 开始使用定位
          /**
           * 例子
           * 第一句 margin-top 25px
           * 第二句 margin-top 50px
           * 第三句 margin-top 75px;
           * 以此类推
           *  ***计算出给一句歌词一个距离顶部的一个距离
           *  (每次只需要切换到当前距离顶部的位置 实现歌词滚动)
           *  顶部的位置 = 当前高亮歌词索引 * 25 +'px'   ***
           * @type {number}
           */
          currentTemp = (i - 6) * oneLyricHeight.value;
          // lyricRef.value.style.marginTop = currentTemp + "rem"; // 设置样式
          lyricRef.value.scrollTop = currentTemp;
          // console.log("=-", currentTemp);
        }
        //如果当前是最后一句歌词 代表歌曲要放送结束了 将我们的lyricIndex(当前歌词索引值还原成0便于下一曲使用)
        if (lyricIndex.value === lyrics.value.length - 1) {
          lyricIndex.value = 0;
        }
        break;
      }
    }
  },
  {
    immediate: true,
  }
);
const [, lightColor] = getThemeColors()
</script>

<style lang="scss" scoped>
.lyric-container {
  height: 50vh;
  overflow: scroll;
  margin-top: 3vw;
}
.lyric-container::-webkit-scrollbar,
.all-container::-webkit-scrollbar {
  width: 4px;
  height: 0px;
}
.lyric-container::-webkit-scrollbar-thumb,
.all-container::-webkit-scrollbar {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgb(173, 173, 173);
  background-color: rgb(177, 175, 175);
}
.lyrics {
  // 这个不能设置高度，否则会跑到外面去
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .activeLyric {
    color: v-bind(lightColor);
    font-size: 1.2rem;
    font-weight: bold;
  }
}
</style>