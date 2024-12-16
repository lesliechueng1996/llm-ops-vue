<script setup lang="ts">
import { getApiToolProvidersWithPage } from '@/services/api-tool'
import { onMounted, onUnmounted, reactive, ref, useTemplateRef, watch } from 'vue'
import ToolProviderCard, { type Provider } from '@/components/ToolProviderCard.vue'
import ToolProviderDrawer from '@/components/ToolProviderDrawer.vue'
import { useRoute } from 'vue-router'
import { initPagination } from '@/config'
import NewToolModal from '@/components/space/tool/NewToolModal.vue'

defineProps<{
  createType: string | null
}>()

defineEmits<{
  cancelModal: () => void
}>()

const apiToolProviders = ref<Provider[]>([])
const isLoading = ref<boolean>(false)
const pagination = reactive({ ...initPagination })

const selectedProvider = ref<Provider | null>(null)
const route = useRoute()

const loadMore = useTemplateRef('load-more')
let observer: IntersectionObserver | null = null

const loadApiToolProviders = async (isInit: boolean, search: string = '') => {
  try {
    isLoading.value = true
    const res = await getApiToolProvidersWithPage(
      search,
      pagination.currentPage,
      pagination.pageSize,
    )
    const list = res.data.list.map((provider) => ({
      ...provider,
      label: provider.name,
      tools: provider.tools.map((tool) => ({ ...tool, label: tool.name })),
    }))

    if (isInit) {
      apiToolProviders.value = list
    } else {
      apiToolProviders.value = [...apiToolProviders.value, ...list]
    }

    pagination.totalPage = res.data.paginator.total_page
    pagination.totalRecord = res.data.paginator.total_record
    pagination.currentPage = res.data.paginator.current_page
    pagination.pageSize = res.data.paginator.page_size

    if (pagination.totalPage <= pagination.currentPage && loadMore.value) {
      observer?.unobserve(loadMore.value)
    }

    console.log('pagination', pagination)
  } finally {
    isLoading.value = false
  }
}

const initObserver = () => {
  const options = {
    rootMargin: '0px',
    threshold: 1.0,
  }

  observer = new IntersectionObserver((entries) => {
    console.log('1', entries)
    if (entries[0].isIntersecting) {
      console.log('2')
      if (pagination.currentPage < pagination.totalPage) {
        console.log('3', pagination)
        pagination.currentPage += 1
        loadApiToolProviders(false, route.query.search as string)
      }
    }
  }, options)

  if (loadMore.value) {
    observer.observe(loadMore.value)
  }
}

onMounted(async () => {
  await loadApiToolProviders(true)

  initObserver()
})

onUnmounted(() => {
  if (observer) {
    console.log('unobserve')
    observer.disconnect()
    observer = null
  }
})

watch(
  () => route.query.search,
  async (newValue) => {
    pagination.currentPage = initPagination.currentPage
    pagination.pageSize = initPagination.pageSize
    pagination.totalPage = initPagination.totalPage
    pagination.totalRecord = initPagination.totalRecord

    await loadApiToolProviders(true, newValue as string)

    initObserver()
  },
)
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
        <span ref="load-more" v-if="pagination.currentPage < pagination.totalPage">
          <icon-loading />
          加载中 {{ pagination.currentPage }}
        </span>
        <span v-else>数据加载完成</span>
      </div>
    </a-spin>

    <tool-provider-drawer :selectedProvider="selectedProvider" @cancel="selectedProvider = null" />
    <new-tool-modal :visible="createType === '插件'" @cancel="$emit('cancelModal')" />
  </div>
</template>

<style scoped></style>
