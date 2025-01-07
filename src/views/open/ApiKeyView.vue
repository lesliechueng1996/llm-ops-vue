<script setup lang="ts">
import { usePagination } from '@/hooks/use-pagination'
import { changeApiKeyActive, getApiKeyPagination, deleteApiKey } from '@/services/api-key-service'
import { type GetApiKeyPaginationRes } from '@/models/api-key-model'
import { format } from 'date-fns'
import { ref } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import CreateApiKeyModal from '@/components/open/CreateApiKeyModal.vue'
import UpdateApiKeyModal from '@/components/open/UpdateApiKeyModal.vue'

interface DropdownValue {
  type: 'edit' | 'delete'
  record: GetApiKeyPaginationRes['data']['list'][number]
}

const { data, pagination, loadData, reloadData } = usePagination(getApiKeyPagination)

const pageChangeHandler = async (page: number) => {
  pagination.currentPage = page
  await loadData(false)
}

const isActiveLoadingMap = ref<Record<string, boolean>>({})

const changeActiveHandler = async (id: string, value: boolean) => {
  try {
    isActiveLoadingMap.value[id] = true
    await changeApiKeyActive(id, value)
  } finally {
    isActiveLoadingMap.value[id] = false
  }

  reloadData()
}

const currentApiKey = ref<GetApiKeyPaginationRes['data']['list'][number] | null>(null)

const handleSelect = (value: string | number | Record<string, unknown> | undefined) => {
  const data = value as unknown as DropdownValue
  if (data.type === 'edit') {
    currentApiKey.value = data.record
    showUpdateApiKeyModal.value = true
  } else if (data.type === 'delete') {
    Modal.warning({
      title: '要删除秘钥吗？',
      content:
        '删除秘钥后，无法使用该秘钥访问 LLMOps 个人空间中的所有 Agent，并且无法恢复，如果临时关闭请使用禁用功能。',
      okText: '确认删除',
      cancelText: '取消',
      async onOk() {
        try {
          await deleteApiKey(data.record.id)
          Message.success('删除成功')
        } catch {
          Message.error('删除失败')
        }
        reloadData()
      },
    })
  }
}

const copyApiKey = (apiKey: string) => {
  navigator.clipboard.writeText(apiKey)
  Message.success('复制成功')
}

const showCreateApiKeyModal = ref(false)
const showUpdateApiKeyModal = ref(false)
</script>

<template>
  <div>
    <div class="mb-6 text-end">
      <a-button class="rounded-lg" type="primary" @click="showCreateApiKeyModal = true">
        新增密钥
      </a-button>
    </div>
    <a-table
      :data="data"
      :pagination="{
        total: pagination.totalRecord,
        pageSize: pagination.pageSize,
        current: pagination.currentPage,
        showTotal: true,
      }"
      row-class="cursor-pointer"
      @page-change="pageChangeHandler"
    >
      <template #columns>
        <a-table-column title="密钥" data-index="api_key" :width="500">
          <template #cell="{ record }">
            <div class="flex items-center gap-2 group">
              <span class="max-w-[450px] truncate">{{ record.api_key }}</span>
              <a-button
                type="text"
                size="small"
                class="rounded-md opacity-0 group-hover:opacity-100"
                @click="copyApiKey(record.api_key)"
              >
                <template #icon>
                  <icon-copy />
                </template>
              </a-button>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="状态">
          <template #cell="{ record }">
            <div class="flex items-center gap-2">
              <div
                :class="`size-2 rounded-sm ${record.is_active ? 'bg-green-500' : 'bg-gray-500'}`"
              ></div>
              <span>{{ record.is_active ? '可用' : '已禁用' }}</span>
            </div>
          </template>
        </a-table-column>
        <a-table-column title="创建时间" data-index="created_at">
          <template #cell="{ record }">
            {{ format(record.created_at * 1000, 'yyyy-MM-dd HH:mm:ss') }}
          </template>
        </a-table-column>
        <a-table-column title="备注" ellipsis>
          <template #cell="{ record }">
            <a-tooltip :content="record.remark">
              <p class="max-w-[200px] truncate">{{ record.remark || '-' }}</p>
            </a-tooltip>
          </template>
        </a-table-column>
        <a-table-column title="操作">
          <template #cell="{ record }">
            <div class="flex items-center" @click.stop>
              <a-switch
                type="round"
                :default-checked="record.is_active"
                @change="(value) => changeActiveHandler(record.id, value as boolean)"
                :loading="isActiveLoadingMap[record.id]"
              />
              <a-divider direction="vertical" />
              <a-dropdown @select="handleSelect">
                <a-button>
                  <template #icon>
                    <icon-more />
                  </template>
                </a-button>
                <template #content>
                  <a-doption :value="{ type: 'edit', record }">编辑</a-doption>
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
  </div>

  <create-api-key-modal v-model:visible="showCreateApiKeyModal" @refresh="reloadData" />
  <update-api-key-modal
    v-if="currentApiKey"
    v-model:visible="showUpdateApiKeyModal"
    :id="currentApiKey.id"
    :is-active="currentApiKey.is_active"
    :remark="currentApiKey.remark"
    @refresh="reloadData"
  />
</template>

<style scoped></style>
