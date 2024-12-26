<script setup lang="ts">
import { useDataset, useDocuments } from '@/hooks/use-documents'
import SearchInput from '@/components/SearchInput.vue'
import { format } from 'date-fns'
import { Modal, Message } from '@arco-design/web-vue'
import { deleteDocument } from '@/services/document-service'
import RenameModal from '@/components/space/dataset/document/RenameModal.vue'
import { ref } from 'vue'
import HitTestingModal from '@/components/space/dataset/document/HitTestingModal.vue'

const { dataset, datasetId, reloadDataset } = useDataset()
const { data, changeEnabledHandler, pagination, pageChangeHandler, reloadData, enabledLoadingMap } =
  useDocuments()

type Document = (typeof data.value)[0]

interface DropdownValue {
  type: 'rename' | 'delete'
  record: Document
}

const currentDocument = ref<Document | null>(null)
const showHitTestingModal = ref(false)

const handleSelect = (value: string | number | Record<string, unknown> | undefined) => {
  const data = value as unknown as DropdownValue
  if (data.type === 'rename') {
    currentDocument.value = data.record
  } else if (data.type === 'delete') {
    Modal.warning({
      title: '要删除该文档吗？',
      content:
        '删除文档后，知识库/向量数据库将无法检索到该文档，如需暂时关闭该文档的检索，可以选择禁用功能。',
      okText: '确认删除',
      cancelText: '取消',
      async onOk() {
        try {
          await deleteDocument(datasetId, data.record.id)
          Message.success('删除成功')
        } catch {
          Message.error('删除失败')
        }

        await reloadDataset()
        await reloadData()
      },
    })
  }
}

const getStatusMessage = (status: string, error: string) => {
  const statusMap: Record<string, string> = {
    waiting: '等待中',
    parsing: '解析处理中',
    splitting: '分割中',
    indexing: '构建索引中',
    completed: '构建完成',
    error: '出错',
  }

  const baseMessage = statusMap[status] || '未知状态'
  return error ? `${baseMessage} (${error})` : baseMessage
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
        <a-button
          class="rounded-lg font-bold text-sm text-gray-700"
          type="secondary"
          @click="showHitTestingModal = true"
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
            <a-tooltip :content="getStatusMessage(record.status, record.error)">
              <div class="flex items-center gap-2 w-fit">
                <div
                  :class="`size-2 ${record.enabled ? 'bg-green-500' : 'bg-gray-300'} rounded-[3px]`"
                ></div>
                <p>{{ record.enabled ? '可用' : '已禁用' }}</p>
              </div>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <div class="flex items-center">
              <a-switch
                type="round"
                :default-checked="record.enabled"
                @change="(value) => changeEnabledHandler(record.id, value as boolean)"
                :loading="enabledLoadingMap[record.id]"
              />
              <a-divider direction="vertical" />
              <a-dropdown @select="handleSelect">
                <a-button>
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <a-doption :value="{ type: 'rename', record }">重命名</a-doption>
                  <a-doption class="text-red-700" :value="{ type: 'delete', record }"
                    >删除</a-doption
                  >
                </template>
              </a-dropdown>
            </div>
          </template>
        </a-table-column>
      </template>
    </a-table>

    <rename-modal
      v-if="currentDocument"
      :document-id="currentDocument.id"
      :original-name="currentDocument.name"
      :dataset-id="datasetId"
      @success="
        () => {
          currentDocument = null
          reloadData()
        }
      "
      @close="currentDocument = null"
    />

    <hit-testing-modal v-model:visible="showHitTestingModal" />
  </div>
</template>

<style scoped></style>
