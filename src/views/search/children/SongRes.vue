<template>
  <el-table :data="list" style="width: 100%" @cell-click="clickItem" v-loading="loading">
    <el-table-column type="index" :index="(index) => index + 1" />
    <el-table-column prop="name" class-name="link-text" label="歌曲标题" width="180" />
    <el-table-column label="时长" width="180" >
      <template #default="scope">
        {{ formatMS(scope.row.duration) }}
      </template>
    </el-table-column>
    <el-table-column label="歌手">
      <template #default="scope">
        <span
          v-for="(item, index) in scope.row.artists"
          :key="item.id"
          @click="gotoArtist(item.id)"
          class="link-text"
        >
          {{ item.name }}<span v-if="index < scope.row.artists.length - 1">/</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column class-name="link-text" prop="album.name" label="专辑" />
  </el-table>
</template>

<script setup>
// import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { formatMS } from '@/utils/utils'

const router = useRouter()

defineProps({
  list: Array,
  loading: Boolean
})
function clickItem(row, column) {
  if (column.no === 1) {
    const id = row.id
    router.push('/song?id=' + id)
  } else if (column.no === 4) {
    const id = row.album.id
    router.push(`/albumDetail?id=${id}`)
  }
}
function gotoArtist(id) {
  router.push('/artistSongs?id=' + id)
}
</script>

<style lang="scss" scoped></style>
