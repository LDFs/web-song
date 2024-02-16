<template>
  <OutlineArchi :border="'0 1'">
    <template v-slot:left>
      <div class="top-info">
        <div class="album-cover">
          <span class="msk"></span>
          <span class="border"></span>
          <img :src="albumInfo.picUrl" alt="" />
        </div>
        <div class="albuminfo">
          <div>{{ albumInfo.name }}</div>
          <div>
            <span>歌手：</span>
            <span
              v-for="(item, index) in albumInfo.artists"
              :key="item.id"
              @click="gotoArtist(item.id)"
              class="artist-name"
              >{{ item.name }}
              <span v-if="index < albumInfo.artists.length - 1">/</span>
            </span>
          </div>
          <div><span>发行时间：</span>{{ publishTime }}</div>
          <div><span>发行公司：</span>{{ albumInfo.company }}</div>
          <button class="play-btn">
            <el-icon><VideoPlay /></el-icon>播放
          </button>
        </div>
      </div>
      <div class="album-desc">
        <span class="desc-title">专辑介绍：</span>{{ albumInfo.description }}
      </div>
      <div class="songs-list">
        <div class="list-title">歌曲列表</div>
        <el-table :data="songs" style="width: 100%" @cell-click="clickItem">
          <el-table-column type="index" :index="(index) => index + 1" />
          <el-table-column
            prop="name"
            class-name="link-text"
            label="歌曲标题"
            width="180"
          />
          <el-table-column label="时长" width="180">
            <template #default="scope">
              {{ formatMS(scope.row.dt) }}
            </template>
          </el-table-column>
          <el-table-column label="歌手" class-name="link-text">
            <template #default="scope">
              <span
                v-for="(item, index) in scope.row.ar"
                :key="item.id"
                @click="gotoArtist(item.id)"
                class="artist-name"
              >
                {{ item.name }}<span v-if="index < scope.row.ar.length - 1">/</span>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
    <template v-slot:right>
      <div>TA的其他热门专辑</div>
      <div v-if="hotAlbums.length > 0" class="hot-albums">
        <LRItem
          v-for="item in hotAlbums"
          :key="item.id"
          class="item"
          :item="item"
          :jumpUrl="'/albumDetail'"
        />
      </div>
    </template>
  </OutlineArchi>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getParamsByKey, formatDateByNumber, formatMS, getThemeColors } from "@/utils/utils";
import { getAlbumDetail, getArtHotAlbum } from "@/network/getPlayList";
import OutlineArchi from "@/common/OutlineArchi.vue";
import LRItem from "@/common/LRItem.vue";

const [, lightColor] = getThemeColors()
const route = useRoute();
const router = useRouter();
const path = computed(() => route.fullPath);
const id = ref(getParamsByKey(route.fullPath, "id"));
watch(path, (v) => {
  id.value = getParamsByKey(v, "id");
  updateData();
});
const albumInfo = ref({});
const songs = ref([]);
const publishTime = ref("");
const hotAlbums = ref([]);
updateData();
function updateData() {
  getAlbumDetail(id.value).then((res) => {
    albumInfo.value = res.data.album;
    songs.value = res.data.songs;
    publishTime.value = formatDateByNumber(albumInfo.value.publishTime);
    const params = {
      id: albumInfo.value.artist.id,
      limit: 5,
    };
    getArtHotAlbum(params).then((res) => {
      hotAlbums.value = res.data.hotAlbums.map((item) => {
        return {
          id: item.id,
          name: item.name,
          desc: formatDateByNumber(item.publishTime),
          picUrl: item.picUrl,
        };
      });
    });
  });
}

function gotoArtist(id) {
  router.push("/artistSongs?id=" + id);
}
function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id;
    router.push("/song?id=" + id);
  }
}
</script>
<style>
.link-text {
  cursor: pointer;
}
</style>
<style lang="scss" scoped>
.album-cover {
  width: 30%;
  position: relative;
  margin-top: 2rem;
  .msk {
    display: inline-block;
    width: 72%;
    height: 84%;
    border-radius: 50%;
    background-color: #414040;
    position: absolute;
    // bottom: 10px;
    // right: 10px;
    z-index: -1;
    transform: translate(30%, 8%);
    box-shadow: -2px 4px 4px 2px #ccc;
  }
  .border {
    display: inline-block;
    width: 70%;
    height: 82%;
    border: 1px solid #919191;
    border-radius: 2px;
    position: absolute;
    bottom: 10%;
    left: 16%;
    z-index: -1;
    box-shadow: 1px 1px 7px 1px #6a6a6a69;
  }
  img {
    width: 80%;
  }
}
.top-info {
  display: flex;
  .albuminfo {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 2rem;
  }
}
.play-btn {
  border-radius: 4px;
  background-color: v-bind(lightColor);
  border: none;
  width: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: 1rem;
  color: #fff;
  padding: 4px 10px;
}
.artist-name:hover {
  cursor: pointer;
  text-decoration: underline;
}
.album-desc {
  padding-right: 2rem;
  margin-top: 2rem;
  .desc-title {
    font-size: 1rem;
    font-weight: 600;
  }
}
.songs-list {
  min-height: 60vh;
  padding-right: 2rem;
  margin-top: 2rem;
  .list-title {
    font-size: 1rem;
    font-weight: 600;
  }
}
.hot-albums {
  padding: 1rem;
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
</style>
