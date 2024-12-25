<script setup lang="ts">
import NewDatasetModal from '@/components/space/dataset/NewDatasetModal.vue'
import { usePagination } from '@/hooks/use-pagination'
import LoadMore from '@/components/LoadMore.vue'
import { getDatasetsByPagination } from '@/services/dataset-service'

defineProps<{
  createType: string | null
}>()

const emit = defineEmits<{
  (e: 'cancelModal'): void
}>()

const { data, reloadData, isLoading, needShowLoadMore } = usePagination(getDatasetsByPagination)

const handleModalCancel = () => {
  reloadData()

  emit('cancelModal')
}
</script>

<template>
  <div class="grow overflow-y-scroll">
    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="data.length === 0" />
        <!-- <tool-provider-card
          v-for="provider in apiToolProviders"
          :key="provider.name"
          :provider="{
            ...provider,
            label: provider.name,
            tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
          }"
          @click="selectedProvider = provider"
        /> -->
      </div>
      <load-more :needShowLoadMore="needShowLoadMore" />
    </a-spin>

    <new-dataset-modal :visible="createType === '知识库'" @cancel="handleModalCancel" />
    <!-- <edit-tool-modal
      v-if="editProviderId"
      :provider-id="editProviderId"
      @cancel="handleModalCancel"
    /> -->
  </div>
</template>

<style scoped></style>
