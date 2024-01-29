<template>
  <el-table :data="list" style="width: 100%" @cell-click="clickItem">
    <el-table-column type="index" :index="(index) => index + 1" />
    <el-table-column prop="name" class-name="link-text" label="歌单标题" width="260" />
    <el-table-column prop="trackCount" label="歌曲数量" width="140" />
    <el-table-column prop="creator.nickname" label="创作者" />
    <el-table-column prop="playCount" label="收听次数" />
  </el-table>
</template>

<script setup>
import {useRouter} from 'vue-router'
defineProps({
  list: Array
})
const router = useRouter()
function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id
    router.push('/playlistDetail?id=' + id)
  }
}
</script>

<style lang="scss" scoped>

</style>