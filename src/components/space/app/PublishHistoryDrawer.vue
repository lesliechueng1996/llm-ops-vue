<script setup lang="ts">
import type { GetAppDetailResponse } from '@/models/app-model'
import { format } from 'date-fns'
import { getAppPublishHistory, fallbackHistory } from '@/services/app-service'
import { usePagination } from '@/hooks/use-pagination'
import { Message } from '@arco-design/web-vue'
import { watch } from 'vue'

const props = defineProps<{
  visible: boolean
  app: GetAppDetailResponse['data']
}>()

const emit = defineEmits(['update:visible', 'fallbacked'])

const handleCancel = () => {
  emit('update:visible', false)
}

const { data, pagination, needShowLoadMore, loadData, resetPagination } = usePagination(
  getAppPublishHistory.bind(null, props.app.id),
  false,
)

const handleFallback = (configVersionId: string) => {
  fallbackHistory(props.app.id, configVersionId).then(() => {
    Message.success('回退成功')
  })

  handleCancel()
  emit('fallbacked')
}

watch(
  () => props.visible,
  (newVal) => {
    if (newVal) {
      loadData(true, '')
    } else {
      resetPagination()
    }
  },
)
</script>

<template>
  <a-drawer
    :width="394"
    :visible="visible"
    :footer="false"
    @cancel="handleCancel"
    unmountOnClose
    :drawer-style="{ backgroundColor: '#F9FAFB' }"
  >
    <template #title> 发布历史 </template>
    <div class="pt-3 px-2 h-full flex flex-col">
      <div class="space-y-3 min-h-0 shrink-0">
        <div class="flex items-center gap-3">
          <a-avatar class="size-10" shape="square">
            <img alt="avatar" :src="app.icon" />
          </a-avatar>
          <div>
            <h1 class="text-base font-bold text-gray-800">聊天机器人</h1>
            <p class="text-xs text-gray-500">
              最近编辑 · {{ format(new Date(app.draft_updated_at * 1000), 'yyyy-MM-dd HH:mm') }}
            </p>
          </div>
        </div>
        <p class="text-sm text-gray-500">{{ app.description }}</p>
      </div>
      <a-divider />
      <div class="pt-1 min-h-0 shrink-0 grow flex flex-col">
        <p class="text-xs text-gray-500 mb-4 min-h-0 shrink-0">
          共计{{ pagination.totalRecord }}条发布记录
        </p>
        <div class="h-full overflow-y-scroll min-h-0 grow space-y-4">
          <div
            v-for="(item, index) in data"
            :key="item.id"
            class="bg-white border-gray-200 border rounded-lg px-4 py-3 flex items-center justify-between group cursor-pointer"
          >
            <div class="space-y-1.5">
              <div class="flex items-center gap-2">
                <h2 class="pr-1 font-bold text-sm">版本</h2>
                <a-tag class="text-xs text-gray-500 bg-gray-100 rounded-lg"
                  ># {{ String(item.version).padStart(3, '0') }}</a-tag
                >
                <a-tag v-if="index === 0" class="text-xs text-gray-500 bg-gray-100 rounded-lg"
                  >当前版本</a-tag
                >
              </div>
              <p class="text-xs text-gray-500">
                发布时间: {{ format(new Date(item.created_at * 1000), 'yyyy-MM-dd HH:mm') }}
              </p>
            </div>
            <a-button
              type="secondary"
              class="rounded-lg group-hover:block hidden"
              @click="handleFallback(item.id)"
            >
              回退
            </a-button>
          </div>

          <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
            <span ref="load-more" v-if="needShowLoadMore">
              <icon-loading />
              加载中
            </span>
            <span v-else>数据加载完成</span>
          </div>
        </div>
      </div>
    </div>
  </a-drawer>
</template>

<style scoped></style>
