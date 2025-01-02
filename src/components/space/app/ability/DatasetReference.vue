<script setup lang="ts">
import { usePagination } from '@/hooks/use-pagination'
import { getDatasetsByPagination } from '@/services/dataset-service'
import { useDraftConfigStore } from '@/stores/draft-config'
import { Message } from '@arco-design/web-vue'
import { computed, ref, watch } from 'vue'
import RetrievalSettingModal from '@/components/space/dataset/document/RetrievalSettingModal.vue'
import type { HitTestingStrategy } from '@/models/dataset-model'

const draftConfigStore = useDraftConfigStore()

const retrievalStrategyText = computed(() => {
  if (draftConfigStore.retrievalConfig === null) {
    return '未设置'
  }

  if (draftConfigStore.retrievalConfig.retrieval_strategy === 'full_text') {
    return '全文检索'
  }

  if (draftConfigStore.retrievalConfig.retrieval_strategy === 'semantic') {
    return '向量检索'
  }

  if (draftConfigStore.retrievalConfig.retrieval_strategy === 'hybrid') {
    return '混合检索'
  }

  return '未设置'
})

// Dataset Drawer
const visible = ref(false)
const { data: datasetRecords, needShowLoadMore } = usePagination(getDatasetsByPagination)

const selectedDatasetIds = ref<string[]>([])

const handleDrawerOk = async () => {
  visible.value = false

  const newSelectedDatasets = datasetRecords.value
    .filter((dataset) => selectedDatasetIds.value.includes(dataset.id))
    .map((dataset) => ({
      id: dataset.id,
      name: dataset.name,
      icon: dataset.icon,
      description: dataset.description,
    }))

  draftConfigStore.datasets = newSelectedDatasets

  await draftConfigStore.saveDatasets()

  Message.success('保存成功')
}

const toggleSelectedDataset = (datasetId: string) => {
  if (selectedDatasetIds.value.includes(datasetId)) {
    selectedDatasetIds.value = selectedDatasetIds.value.filter((id) => id !== datasetId)
  } else {
    if (selectedDatasetIds.value.length >= 5) {
      Message.error('最多只能选择5个知识库')
      return
    }

    selectedDatasetIds.value.push(datasetId)
  }
}

const handleDeleteDataset = async (datasetId: string) => {
  draftConfigStore.datasets = draftConfigStore.datasets.filter(
    (dataset) => dataset.id !== datasetId,
  )
  await draftConfigStore.saveDatasets()
  Message.success('保存成功')
}

watch(visible, (newVal) => {
  if (newVal) {
    selectedDatasetIds.value = draftConfigStore.datasets.map((dataset) => dataset.id)
  }
})

// Retrieval Strategy
const modalVisible = ref(false)

const handleRetrievalStrategyConfirm = async (settings: {
  strategy: HitTestingStrategy
  maxResults: number
  minScore: number
}) => {
  modalVisible.value = false
  draftConfigStore.retrievalConfig = {
    retrieval_strategy: settings.strategy,
    k: settings.maxResults,
    score: settings.minScore,
  }
  await draftConfigStore.saveRetrievalConfig()
  Message.success('保存成功')
}

const defaultRetrievalSettings = ref<{
  strategy: HitTestingStrategy
  maxResults: number
  minScore: number
}>({
  strategy: 'hybrid',
  maxResults: 4,
  minScore: 0.5,
})

watch(modalVisible, (newVal) => {
  if (newVal) {
    defaultRetrievalSettings.value = {
      strategy: draftConfigStore.retrievalConfig?.retrieval_strategy ?? 'hybrid',
      maxResults: draftConfigStore.retrievalConfig?.k ?? 4,
      minScore: draftConfigStore.retrievalConfig?.score ?? 0.5,
    }
    console.log(defaultRetrievalSettings.value)
  }
})
</script>

<template>
  <a-collapse-item header="知识库" key="dataset-reference">
    <p class="text-xs text-gray-500" v-if="draftConfigStore.datasets.length === 0">
      引用文本类型的数据，实现知识问答，应用最多支持关联5个知识库。
    </p>
    <div v-else class="space-y-1">
      <div
        v-for="dataset in draftConfigStore.datasets"
        :key="dataset.id"
        class="flex items-center justify-between gap-2 px-2 py-2.5 bg-white rounded-lg group cursor-pointer"
      >
        <div class="flex items-center gap-2">
          <a-avatar class="size-8" shape="square">
            <img :src="dataset.icon" :alt="dataset.name" />
          </a-avatar>
          <div>
            <p class="text-sm font-medium">{{ dataset.name }}</p>
            <p class="text-xs text-gray-500 line-clamp-1">{{ dataset.description }}</p>
          </div>
        </div>
        <a-button
          class="hidden group-hover:block"
          type="text"
          size="small"
          status="danger"
          shape="circle"
          @click="handleDeleteDataset(dataset.id)"
        >
          <template #icon><icon-delete /></template>
        </a-button>
      </div>
    </div>

    <template #extra>
      <div class="space-x-3">
        <a-button
          class="rounded-lg"
          type="secondary"
          size="small"
          v-if="draftConfigStore.retrievalConfig !== null && draftConfigStore.datasets.length > 0"
          @click.stop="modalVisible = true"
        >
          <template #icon>
            <icon-language size="16" />
          </template>
          <template #default>
            {{ retrievalStrategyText }}
          </template>
        </a-button>
        <icon-plus class="text-gray-500 cursor-pointer" size="16" @click.stop="visible = true" />
      </div>
    </template>
  </a-collapse-item>

  <a-drawer :width="400" :visible="visible" @cancel="visible = false" unmountOnClose>
    <template #title>选择引用知识库</template>
    <div class="h-full overflow-y-scroll">
      <div class="space-y-2">
        <div
          v-for="datasetRecord in datasetRecords"
          :class="`flex items-center px-3 py-2 gap-2 rounded-lg cursor-pointer border ${selectedDatasetIds.includes(datasetRecord.id) ? 'border-blue-700 bg-blue-50 hover:border-blue-800' : 'border-gray-200 hover:border-gray-300'}`"
          :key="datasetRecord.id"
          @click="toggleSelectedDataset(datasetRecord.id)"
        >
          <a-avatar class="size-6" shape="square">
            <img :src="datasetRecord.icon" :alt="datasetRecord.name" />
          </a-avatar>
          <span class="text-sm text-gray-700">{{ datasetRecord.name }}</span>
        </div>
      </div>

      <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
        <span ref="load-more" v-if="needShowLoadMore">
          <icon-loading />
          加载中
        </span>
        <span v-else>数据加载完成</span>
      </div>
    </div>

    <template #footer>
      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-700">{{ selectedDatasetIds.length }} 个知识库被选中</p>
        <div class="space-x-3">
          <a-button type="secondary" @click="visible = false">取消</a-button>
          <a-button type="primary" @click="handleDrawerOk">添加</a-button>
        </div>
      </div>
    </template>
  </a-drawer>

  <retrieval-setting-modal
    v-model:visible="modalVisible"
    :default-settings="defaultRetrievalSettings"
    @confirm="handleRetrievalStrategyConfirm"
  />
</template>

<style scoped></style>
