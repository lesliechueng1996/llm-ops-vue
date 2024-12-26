<script setup lang="ts">
import type { DatasetRecentQueryResponse } from '@/models/dataset-model'
import { format } from 'date-fns'

type RecentQuery = DatasetRecentQueryResponse['data'][0]

defineProps<{
  recentQueries: RecentQuery[]
}>()
</script>

<template>
  <div>
    <h2 class="font-bold text-gray-800">最近查询</h2>
    <a-table :data="recentQueries" :pagination="false" :scroll="{ x: '100%', y: '100%' }">
      <template #columns>
        <a-table-column title="数据源" data-index="source" />
        <a-table-column title="文本" data-index="query">
          <template #cell="{ record }">
            <a-tooltip :content="record.query">
              <p class="max-w-[200px] truncate">{{ record.query }}</p>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="created_at">
          <template #cell="{ record }">
            {{ format(record.created_at * 1000, 'yyyy-MM-dd HH:mm') }}
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
