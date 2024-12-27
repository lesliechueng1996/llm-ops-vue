<script setup lang="ts">
import { useSegments } from '@/hooks/use-segments'
import TagHeader from '@/components/space/dataset/document/TagHeader.vue'
import { format } from 'date-fns'
import SearchInput from '@/components/SearchInput.vue'
import SegmentCard from '@/components/space/dataset/document/segment/SegmentCard.vue'

const {
  belongDocument,
  datasetId,
  enableLoading,
  handleEnableChange,
  data,
  isLoading,
  needShowLoadMore,
} = useSegments()
</script>

<template>
  <div class="p-6 space-y-6">
    <tag-header
      label="文档"
      :title="belongDocument?.name || ''"
      :tags="[
        `${belongDocument?.segment_count ?? 0} 文档片段`,
        `${belongDocument?.hit_count ?? 0} 命中`,
        `${belongDocument?.updated_at ? format(new Date(belongDocument.updated_at * 1000), 'yyyy-MM-dd HH:mm:ss') : '-'} 最后编辑`,
      ]"
      :back-url="`/space/datasets/${datasetId}/documents`"
    >
      <template #icon>
        <div
          class="size-10 rounded-lg bg-white flex items-center justify-center border border-gray-200"
        >
          <icon-file size="20" />
        </div>
      </template>
    </tag-header>

    <!-- Action -->
    <div class="flex items-center justify-between">
      <search-input placeholder="输入关键词搜索片段" />
      <div class="flex items-center gap-3">
        <a-button
          class="rounded-lg font-bold text-sm text-gray-700 flex items-center gap-2"
          type="secondary"
          :loading="enableLoading"
          @click="handleEnableChange(!belongDocument?.enabled)"
        >
          <div
            :class="`size-2 ${belongDocument?.enabled ? 'bg-green-500' : 'bg-gray-300'} rounded-[3px]`"
          ></div>
          <p>{{ belongDocument?.enabled ? '可用' : '已禁用' }}</p>
        </a-button>
        <a-button class="rounded-lg font-bold text-sm text-white" type="outline">
          <template #icon>
            <icon-file size="16" />
          </template>
          添加片段</a-button
        >
      </div>
    </div>

    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="data.length === 0" />
        <segment-card v-for="segment in data" :key="segment.id" :segment="segment" />
      </div>
      <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
        <span ref="load-more" v-if="needShowLoadMore">
          <icon-loading />
          加载中
        </span>
        <span v-else>数据加载完成</span>
      </div>
    </a-spin>
  </div>
</template>

<style scoped></style>
