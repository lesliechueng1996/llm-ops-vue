<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDocumentBatch } from '@/services/document-service'

const props = defineProps<{
  batchId: string
}>()

const route = useRoute()
const datasetId = route.params.datasetId as string

const isFinished = ref(false)
const processList = ref<
  {
    id: string
    name: string
    extension: string
    size: number
    status: string
    segment_count: number
    completed_segment_count: number
    error: string
  }[]
>([])

let interval: number | null = null

const loadProcess = async () => {
  const res = await getDocumentBatch(datasetId, props.batchId)
  processList.value = res.data

  let flag = true
  for (const item of processList.value) {
    if (item.status !== 'completed') {
      flag = false
      break
    }
  }
  isFinished.value = flag

  if (flag && interval !== null) {
    clearInterval(interval)
    interval = null
  }
}

onMounted(async () => {
  await loadProcess()

  if (!isFinished.value) {
    interval = setInterval(async () => {
      await loadProcess()
    }, 2000)
  }
})

onUnmounted(() => {
  if (interval !== null) {
    clearInterval(interval)
    interval = null
  }
})
</script>

<template>
  <div>
    <h2 class="font-medium text-gray-800 text-sm mb-2">
      {{ isFinished ? '服务器处理完成' : '服务器处理中' }}
    </h2>
    <div class="space-y-2">
      <div
        class="flex items-center justify-between px-4 py-2 border-2 border-gray-200 rounded-lg"
        v-for="item in processList"
        :key="item.id"
      >
        <div class="flex items-center justify-start gap-2">
          <icon-file size="22" />
          <div>
            <p class="text-sm text-gray-700">{{ item.name }}</p>
            <p class="text-xs text-gray-500">{{ (item.size / 1024).toFixed(2) }}KB</p>
          </div>
        </div>
        <div v-if="item.status === 'completed'">处理完成</div>
        <div v-else-if="item.status === 'error'">
          <a-tooltip content="This is tooltip content">
            <p class="text-red-500">处理失败</p>
          </a-tooltip>
        </div>
        <div v-else>
          {{
            item.segment_count === 0
              ? 0
              : (item.completed_segment_count / item.segment_count) * 100
          }}%
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
