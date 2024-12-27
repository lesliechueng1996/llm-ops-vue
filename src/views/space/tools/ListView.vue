<script setup lang="ts">
import { getApiToolProvidersWithPage } from '@/services/api-tool'
import { computed, ref } from 'vue'
import ToolProviderCard from '@/components/ToolProviderCard.vue'
import ToolProviderDrawer, { type Provider } from '@/components/ToolProviderDrawer.vue'
import NewToolModal from '@/components/space/tool/NewToolModal.vue'
import EditToolModal from '@/components/space/tool/EditToolModal.vue'
import { usePagination } from '@/hooks/use-pagination'

defineProps<{
  createType: string | null
}>()

const emit = defineEmits<{
  (e: 'cancelModal'): void
}>()

const { data, reloadData, isLoading, needShowLoadMore } = usePagination(getApiToolProvidersWithPage)

const apiToolProviders = computed(() =>
  data.value.map((provider) => ({
    ...provider,
    label: provider.name,
    tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
  })),
)

const selectedProvider = ref<(Provider & { id: string }) | null>(null)

const editProviderId = ref<string | null>(null)

const handleModalCancel = () => {
  reloadData()

  editProviderId.value = null
  selectedProvider.value = null

  emit('cancelModal')
}
</script>

<template>
  <div class="grow overflow-y-scroll">
    <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
      <div class="flex flex-wrap gap-5">
        <a-empty v-if="apiToolProviders.length === 0" />
        <tool-provider-card
          v-for="provider in apiToolProviders"
          :key="provider.name"
          :provider="{
            ...provider,
            label: provider.name,
            tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
          }"
          @click="selectedProvider = provider"
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

    <tool-provider-drawer
      :selectedProvider="selectedProvider"
      @cancel="selectedProvider = null"
      :canEdit="true"
      @edit="editProviderId = $event"
    />
    <new-tool-modal :visible="createType === '自定义插件'" @cancel="handleModalCancel" />
    <edit-tool-modal
      v-if="editProviderId"
      :provider-id="editProviderId"
      @cancel="handleModalCancel"
    />
  </div>
</template>

<style scoped></style>
