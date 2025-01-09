<script setup lang="ts">
import CustomAppCard from '@/components/space/app/CustomAppCard.vue'
import { usePagination } from '@/hooks/use-pagination'
import { getAppsPagination, deleteApp } from '@/services/app-service'
import NewAppModal from '@/components/space/app/NewAppModal.vue'
import EditAppModal from '@/components/space/app/EditAppModal.vue'
import { ref } from 'vue'
import type { GetAppsPaginationResponse } from '@/models/app-model'

defineProps<{
  createType: string | null
}>()

type App = GetAppsPaginationResponse['data']['list'][number]

const emit = defineEmits<{
  (e: 'cancelModal'): void
}>()

const { data, reloadData, isLoading, needShowLoadMore } = usePagination(getAppsPagination)
const editApp = ref<{
  id: string
  icon: string
  name: string
  description: string
} | null>(null)

const handleModalCancel = () => {
  reloadData()

  editApp.value = null
  emit('cancelModal')
}

const handleEditApp = (app: App) => {
  editApp.value = {
    id: app.id,
    icon: app.icon,
    name: app.name,
    description: app.description,
  }
}

const handleDeleteApp = (appId: string) => {
  deleteApp(appId).then(() => {
    reloadData()
  })
}
</script>

<template>
  <div class="grow overflow-y-scroll">
    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="data.length === 0" />
        <custom-app-card
          v-for="app in data"
          :key="app.id"
          :id="app.id"
          :icon="app.icon"
          :label="app.name"
          :provider="app.model_config.provider"
          :model="app.model_config.model"
          :description="app.description || app.preset_prompt"
          :created-at="app.created_at"
          :updated-at="app.updated_at"
          :is-published="app.status === 'published'"
          @edit-app="handleEditApp(app)"
          @delete-app="handleDeleteApp"
        />
      </div>
      <div class="flex justify-center items-center my-4 text-gray-500 text-sm">
        <span ref="load-more" v-if="needShowLoadMore">
          <icon-loading />
          加载中
        </span>
        <span v-else>数据加载完成</span>
      </div>
    </a-spin>

    <new-app-modal :visible="createType === 'AI应用'" @cancel="handleModalCancel" />
    <edit-app-modal
      v-if="editApp"
      :id="editApp.id"
      :icon="editApp.icon"
      :description="editApp.description"
      :name="editApp.name"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<style scoped></style>
