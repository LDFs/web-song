<template>
  <div class="whole-page out-container">
    <div class="detail-container">
      <div class="detail-header">
        <div class="cover-img"><img :src="detailInfo.coverImgUrl" alt="" /></div>
        <div class="info-right">
          <div class="title">{{ detailInfo.name }}</div>
          <div class="create-info">
            <img :src="creator.backgroundUrl" alt="" />
            <span class="creator-name">{{ creator.nickname }}</span>
            <span class="creat-time">{{ creatTime }} 创建</span>
          </div>
          <div class="control-btns">
            <button class="play link-text" @click="playTheList">
              <el-icon><VideoPlay /></el-icon>播放
            </button>
            <button>
              <el-icon><FolderAdd /></el-icon>{{ detailInfo.subscribedCount }}
            </button>
            <button>
              <el-icon><Share /></el-icon>{{ detailInfo.shareCount }}
            </button>
            <button>
              <el-icon><ChatLineSquare /></el-icon>{{ detailInfo.commentCount }}
            </button>
          </div>
          <div class="tags">
            标签：
            <span v-for="item in detailInfo.tags" :key="item">{{ item }}</span>
          </div>
          <div class="describe">介绍：{{ detailInfo.description }}</div>
        </div>
      </div>
      <div class="music-list">
        <div class="list-title">
          <span class="title">歌曲列表</span>
          <span class="tiny-font">{{ detailInfo.trackCount }}首歌</span>
          <span>播放：{{ detailInfo.playCount }}次</span>
        </div>
        <div>
          <TableCom ref="tableRef" :id="id" :getDataFun="getListTracks" :total="total" />
        </div>
      </div>
    </div>
    <div class="whole-right">
      <div class="right-title">喜欢这个歌单的人</div>
      <div class="avaters">
        <img v-for="item in subscribes" :src="item.avatarUrl" :key="item.userId" alt="" />
      </div>
      <div class="right-title top-bot-mar">相关推荐</div>
      <LRItem
        v-for="item in relatedList"
        :key="item.id"
        class="item"
        :item="item"
        :jumpUrl="'/playlistDetail'"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import { getListDetail, getRelatedList, getListTracks } from "@/network/getPlayList";
import { getParamsByKey, formatDateByNumber, getThemeColors } from "@/utils/utils";
import LRItem from "@/common/LRItem.vue";
import {useTable} from '@/utils/useTable'
import TableCom from "@/components/TableCom.vue";

const [mainColor, lightColor] = getThemeColors()

const route = useRoute();
const router = useRouter();
const path = computed(() => route.fullPath);
const id = ref(getParamsByKey(path.value, "id"));
watch(path, (v) => {
  id.value = getParamsByKey(v, "id");
  updateInfo();
});

const total = ref(0); // 总条数

const detailInfo = ref({});
// const musicLists = ref([]);
const creatTime = ref("");
const creator = ref({});
const subscribes = ref([]);

// const [allData, refresh, loading, pagination] = useTable(getListDetail, id.value)

// onMounted(() => {
//   refresh()
// })

updateInfo();
function updateInfo() {  
  getListDetail({id: id.value}).then((res) => {
    detailInfo.value = res.data.playlist;
    creatTime.value = formatDateByNumber(detailInfo.value.createTime);
    creator.value = res.data.playlist.creator;
    subscribes.value = res.data.playlist.subscribers.slice(0, 8);
    total.value = res.data.playlist.trackCount
  });
}


const relatedList = ref([]);
getRelatedList(id.value).then((res) => {
  relatedList.value = res.data.playlists.map((item) => {
    return {
      id: item.id,
      name: item.name,
      picUrl: item.coverImgUrl,
      desc: `by ${item.creator.nickname}`,
    };
  });
});

const tableRef = ref(null)
function playTheList(){
  tableRef.value.playTheList()
}
</script>
<style>
.link-text {
  cursor: pointer;
}
.el-tooltip__trigger {
  height: auto;
  width: auto;
}
</style>

<style lang="scss" scoped>

.whole-page {
  border-left: 1px solid #c1bfbf;
  border-right: 1px solid #c1bfbf;
  display: flex;
}
.detail-container {
  width: 74%;
  border-right: 1px solid #c1bfbf;
  padding: 1rem;
}
.detail-header {
  display: flex;
  .cover-img {
    width: 36%;
    margin-right: 2rem;
    img {
      width: 100%;
    }
  }
  .info-right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    width: 76%;
    .create-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      img {
        width: 2.6rem;
      }
      .creat-time {
        color: #b0b0b0;
        margin-left: 4px;
      }
    }
    .control-btns {
      display: flex;
      gap: 0.6rem;
      button {
        background-color: #ededed;
        border-radius: 4px;
        border: 1px solid #dbdbdb;
        padding: 0.4rem;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        .el-icon {
          margin-right: 4px;
          font-size: 1rem;
        }
      }
      .play {
        background-color: v-bind(lightColor);
        color: #fff;
      }
    }
  }
}
.title {
  font-size: 1.2rem;
}
.tags span {
  border: 1px solid #e5e5e5;
  background-color: #f0f0f0;
  border-radius: 20px;
  margin-right: 1rem;
  padding: 0.1rem 0.4rem;
}
.describe {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
.list-title {
  margin-top: 2rem;
  padding-bottom: 6px;
  border-bottom: 2px solid v-bind(mainColor);
  .tiny-font {
    font-size: 0.8rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
.link-text:hover {
  text-decoration: underline;
  cursor: hover;
}
.whole-right {
  width: 26%;
  padding: 1rem;
  .right-title {
    font-weight: 700;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid #7b7b7b;
  }
  .avaters {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    img {
      width: 22%;
      margin-top: 1rem;
    }
  }
  .item {
    display: flex;
    margin-bottom: 1rem;
    img {
      width: 4vw;
    }
    .item-right {
      display: flex;
      flex-direction: column;
      margin-left: 10px;
    }
    .nickname {
      color: #505050;
    }
  }
}
.top-bot-mar {
  margin-top: 2rem;
  margin-bottom: 1rem;
}
</style>
