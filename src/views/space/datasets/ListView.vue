<script setup lang="ts">
import NewDatasetModal from '@/components/space/dataset/NewDatasetModal.vue'
import { usePagination } from '@/hooks/use-pagination'
import LoadMore from '@/components/LoadMore.vue'
import { getDatasetsByPagination } from '@/services/dataset-service'
import DatasetCard from '@/components/space/dataset/DatasetCard.vue'
import EditDatasetModal from '@/components/space/dataset/EditDatasetModal.vue'
import { ref } from 'vue'

defineProps<{
  createType: string | null
}>()

const emit = defineEmits<{
  (e: 'cancelModal'): void
}>()

const { data, reloadData, isLoading, needShowLoadMore } = usePagination(getDatasetsByPagination)
const editDatasetId = ref<string | null>(null)

const handleModalCancel = () => {
  reloadData()

  emit('cancelModal')
  editDatasetId.value = null
}
</script>

<template>
  <div class="grow overflow-y-scroll">
    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="data.length === 0" />
        <dataset-card
          v-for="dataset in data"
          :key="dataset.id"
          :dataset="dataset"
          @edit-dataset="editDatasetId = $event"
        />
      </div>
      <load-more :needShowLoadMore="needShowLoadMore" />
    </a-spin>

    <new-dataset-modal :visible="createType === '知识库'" @cancel="handleModalCancel" />
    <edit-dataset-modal v-if="editDatasetId" :id="editDatasetId" @cancel="handleModalCancel" />
  </div>
</template>

<style scoped></style>
