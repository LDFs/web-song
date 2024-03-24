<template>
  <el-table :data="musicLists" style="width: 100%" @cell-click="clickItem" v-loading="loading">
    <el-table-column type="index" :index="(index) => index + 1" />
    <el-table-column prop="name" class-name="link-text" label="歌曲标题" width="180" />
    <el-table-column label="时长" width="180" >
      <template #default="scope">
        {{ formatMS(scope.row.dt) }}
      </template>
    </el-table-column>
    <el-table-column label="歌手" >
      <template #default="scope">
        <span v-for="(item, index) in scope.row.ar" :key="item.id" @click="gotoArtist(item.id)"
          class="link-text">
          {{ item.name }}<span v-if="index < scope.row.ar.length-1">/</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column prop="al.name" class-name="link-text" label="专辑" />
  </el-table>
  <el-pagination
    v-if="showPagi"
    style="height: 3rem;"
    v-model:current-page="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next, sizes"
    :page-sizes="sizeOption"
    :total="total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup>
import {ref, watch} from 'vue'
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { formatMS } from "@/utils/utils";

const router = useRouter();
const store = useStore()

const props = defineProps({
  getDataFun: Function,
  tableStyle: Object,
  id: String,
  total: Number,
  showPagi: Boolean
})
watch(props, () => {
  toUpdate()
})

const currentPage = ref(1);
const sizeOption = [10, 20, 50, 100, 200]; // 每页大小选项
const pageSize = ref(sizeOption[0]); //每页大小
const musicLists = ref([])
const loading = ref(false)

function handleSizeChange(n){
  pageSize.value = n
  toUpdate()
}

function handleCurrentChange() {
  toUpdate()
}
toUpdate()
function toUpdate(){
  loading.value = true
  props.getDataFun({id: props.id, limit: pageSize.value, offset: (currentPage.value-1)*pageSize.value}).then(res => {
    musicLists.value = res.data.songs
    loading.value = false
  })
}

function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id;
    router.push("/song?id=" + id);
  } else if (column.no === 4) {
    const id = row.al.id;
    router.push(`/albumDetail?id=${id}`);
  }
}
function gotoArtist(id) {
  router.push("/artistSongs?id=" + id);
}

function playTheList(){
  store.commit('setCurList', musicLists.value)
  store.commit('setIsPlay', true)
  store.commit("setSongInfo", musicLists.value[0]);
  store.dispatch("updateMusicUrl", musicLists.value[0].id);
}
defineExpose({
  playTheList
})

</script>

<style lang="scss" scoped>

</style>