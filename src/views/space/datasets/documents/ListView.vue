<script setup lang="ts">
import { useDataset, useDocuments } from '@/hooks/use-documents'
import SearchInput from '@/components/SearchInput.vue'
import { format } from 'date-fns'

const { dataset } = useDataset()
const { data, changeEnabledHandler, pagination, pageChangeHandler } = useDocuments()

const handleSelect = (key: string | number | Record<string, unknown> | undefined) => {
  if (key === 'rename') {
    console.log('rename')
  } else if (key === 'delete') {
    console.log('delete')
  }
}
</script>

<template>
  <div class="p-6 flex flex-col gap-6">
    <!-- Header -->
    <div class="flex items-center justify-start gap-3 shrink-0">
      <router-link to="/space/datasets">
        <icon-left size="16" />
      </router-link>
      <a-avatar :size="40" shape="square">
        <img alt="avatar" :src="dataset?.icon" />
      </a-avatar>
      <div class="flex flex-col justify-center">
        <a-breadcrumb>
          <a-breadcrumb-item>知识库</a-breadcrumb-item>
          <a-breadcrumb-item>{{ dataset?.name }}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="space-x-2">
          <a-tag class="bg-gray-200 text-gray-500 text-xs rounded-lg"
            >{{ dataset?.document_count }} 文档</a-tag
          >
          <a-tag class="bg-gray-200 text-gray-500 text-xs rounded-lg"
            >{{ dataset?.hit_count }} 命中</a-tag
          >
          <a-tag class="bg-gray-200 text-gray-500 text-xs rounded-lg"
            >{{ dataset?.related_app_count }} 关联应用</a-tag
          >
        </div>
      </div>
    </div>

    <!-- Action -->
    <div class="flex items-center justify-between">
      <search-input placeholder="输入关键词搜索文档" />
      <div class="space-x-3">
        <a-button class="rounded-lg font-bold text-sm text-gray-700" type="secondary"
          >召回测试</a-button
        >
        <a-button class="rounded-lg font-bold text-sm text-white" type="primary">添加文件</a-button>
      </div>
    </div>

    <a-table
      :data="data"
      :pagination="{
        total: pagination.totalRecord,
        pageSize: pagination.pageSize,
        current: pagination.currentPage,
        showTotal: true,
      }"
      @page-change="pageChangeHandler"
    >
      <template #columns>
        <a-table-column title="#" data-index="position"></a-table-column>
        <a-table-column title="文档名" dataIndex="name"></a-table-column>
        <a-table-column title="字符数" dataIndex="character_count">
          <template #cell="{ record }"> {{ Math.round(record.character_count / 1000) }}K </template>
        </a-table-column>
        <a-table-column title="召回次数" dataIndex="hit_count"></a-table-column>
        <a-table-column title="上传时间" dataIndex="created_at">
          <template #cell="{ record }">
            {{ format(new Date(record.created_at * 1000), 'yyyy-MM-dd hh:mm:ss') }}
          </template>
        </a-table-column>
        <a-table-column title="状态" dataIndex="enabled">
          <template #cell="{ record }">
            <div class="flex items-center gap-2">
              <div
                :class="`size-2 ${record.enabled ? 'bg-green-500' : 'bg-gray-300'} rounded-[3px]`"
              ></div>
              <p>{{ record.enabled ? '可用' : '已禁用' }}</p>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <div class="flex items-center">
              <a-switch
                type="round"
                :default-checked="record.enabled"
                @change="(value) => changeEnabledHandler(record.id, value as boolean)"
              />
              <a-divider direction="vertical" />
              <a-dropdown @select="handleSelect">
                <a-button>
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <a-doption value="rename">重命名</a-doption>
                  <a-doption class="text-red-700" value="delete">删除</a-doption>
                </template>
              </a-dropdown>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>
  </div>
</template>

<style scoped></style>
