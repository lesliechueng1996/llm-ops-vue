<script setup lang="ts">
const { needShowLoadMore, loadMoreKey = 'load-more' } = defineProps<{
  needShowLoadMore: boolean
  loadMoreKey?: string
}>()
</script>

<template>
  <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
    <span :ref="loadMoreKey" v-if="needShowLoadMore">
      <icon-loading />
      加载中
    </span>
    <span v-else>数据加载完成</span>
  </div>
</template>

<style scoped></style>
