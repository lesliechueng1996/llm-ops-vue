<script setup lang="ts">
import { getCategories, getBuiltinTools } from '@/services/builtin-tool'
import { type GetCategoriesResponse, type GetBuiltinToolsResponse } from '@/models/builtin-tool'
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import ToolProviderCard from '@/components/ToolProviderCard.vue'
import ToolProviderDrawer from '@/components/ToolProviderDrawer.vue'
import CommonHeader from '@/components/CommonHeader.vue'

type Provider = GetBuiltinToolsResponse['data'][0]

const categories = ref<GetCategoriesResponse['data']>([])
const providers = ref<Provider[]>([])

const selectedProvider = ref<Provider | null>(null)

const router = useRouter()

// filter
const selectedCategory = ref<string>('')
const searchWord = ref<string>('')

const filteredProviders = computed(() => {
  return providers.value.filter((provider) => {
    return (
      (selectedCategory.value === '' || provider.category === selectedCategory.value) &&
      (searchWord.value === '' ||
        provider.label.toLowerCase().includes(searchWord.value.toLowerCase()))
    )
  })
})

const isLoading = ref<boolean>(false)

onMounted(async () => {
  try {
    isLoading.value = true
    const res = await Promise.all([getCategories(), getBuiltinTools()])
    categories.value = [...res[0].data]
    providers.value = [...res[1].data]
  } finally {
    isLoading.value = false
  }
})

const handleCreateCustomTool = () => {
  router.push('/space/tools')
}
</script>

<template>
  <div class="h-screen px-6 flex flex-col">
    <!-- header -->
    <common-header
      class="shrink-0"
      title="插件广场"
      btn-text="创建自定义插件"
      @clickBtn="handleCreateCustomTool"
    >
      <template #icon>
        <icon-common />
      </template>
    </common-header>

    <!-- filter -->
    <div class="flex items-center justify-between mb-6 shrink-0">
      <div class="space-x-1">
        <a-button
          :type="selectedCategory === '' ? 'primary' : 'text'"
          class="rounded-lg"
          @click="selectedCategory = ''"
          >全部</a-button
        >
        <a-button
          v-for="category in categories"
          :key="category.category"
          :type="selectedCategory === category.category ? 'primary' : 'text'"
          class="rounded-lg"
          @click="selectedCategory = category.category"
          >{{ category.name }}</a-button
        >
      </div>
      <a-input
        class="w-52 rounded-lg bg-white border border-gray-200"
        placeholder="请输入插件名称"
        allow-clear
        v-model="searchWord"
      >
        <template #prefix>
          <icon-search />
        </template>
      </a-input>
    </div>

    <div class="grow overflow-y-scroll">
      <a-spin class="w-full h-full" :loading="isLoading" tip="加载中...">
        <!-- built-in tool provider list -->
        <div class="flex flex-wrap gap-5">
          <a-empty v-if="filteredProviders.length === 0" />
          <tool-provider-card
            v-for="provider in filteredProviders"
            :key="provider.name"
            :provider="provider"
            @click="selectedProvider = provider"
          />
        </div>
      </a-spin>
    </div>

    <tool-provider-drawer :selectedProvider="selectedProvider" @cancel="selectedProvider = null" />
  </div>
</template>

<style scoped></style>
