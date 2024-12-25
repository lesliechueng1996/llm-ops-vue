<script setup lang="ts">
import NewDatasetModal from '@/components/space/dataset/NewDatasetModal.vue'
import { usePagination } from '@/hooks/use-pagination'
import LoadMore from '@/components/LoadMore.vue'
import { deleteDataset, getDatasetsByPagination } from '@/services/dataset-service'
import DatasetCard from '@/components/space/dataset/DatasetCard.vue'
import EditDatasetModal from '@/components/space/dataset/EditDatasetModal.vue'
import { ref } from 'vue'
import { Modal } from '@arco-design/web-vue'

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

const handleDelete = (id: string) => {
  Modal.warning({
    title: '警告',
    content: '是否删除知识库，删除后不可恢复',
    okText: '删除',
    onOk: async () => {
      await deleteDataset(id)
      emit('cancelModal')
    },
  })
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
          @delete-dataset="handleDelete"
        />
      </div>
      <load-more :needShowLoadMore="needShowLoadMore" />
    </a-spin>

    <new-dataset-modal :visible="createType === '知识库'" @cancel="handleModalCancel" />
    <edit-dataset-modal v-if="editDatasetId" :id="editDatasetId" @cancel="handleModalCancel" />
  </div>
</template>

<style scoped></style>
